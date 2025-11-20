'use client';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Header from '@/components/layout/Header';
import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { AlignedMaterial, MaterialsProfile, Maintenance, EquipmentMachinery, SECTORS } from '@/types/api';
import {
  materialsProfileService,
  MaterialsProfileFilterParams,
} from '@/services/materialsProfileService';
import { maintenanceService, equipmentMachineryService } from '@/services';
import UploadEstimateModal from '@/components/materials/UploadEstimateModal';
import CreateMaterialsProfileModal from '@/components/materials/CreateMaterialsProfileModal';
import * as XLSX from 'xlsx';

// Icons Components
const UploadIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const FilterIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

const ExcelIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

export default function MaterialsPage() {
  const searchParams = useSearchParams();
  const hasInitialized = useRef(false);
  const [materialProfiles, setMaterialProfiles] = useState<
    MaterialsProfile[] | null
  >();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [filters, setFilters] = useState<MaterialsProfileFilterParams>({
    maintenance_ids: [],
    equipment_machinery_ids: [],
    sector: '',
  });
  const [isFiltering, setIsFiltering] = useState(false);

  // Data for filters
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [equipments, setEquipments] = useState<EquipmentMachinery[]>([]);
  const [loadingMaintenances, setLoadingMaintenances] = useState(false);
  const [loadingEquipments, setLoadingEquipments] = useState(false);
  const [selectedMaintenanceIds, setSelectedMaintenanceIds] = useState<string[]>([]);
  const [selectedEquipmentIds, setSelectedEquipmentIds] = useState<string[]>([]);

  // Equipment search state
  const [equipmentSearchTerm, setEquipmentSearchTerm] = useState('');
  const [isEquipmentDropdownOpen, setIsEquipmentDropdownOpen] = useState(false);

  // Modal states
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Export to Excel function
  const handleExportToExcel = () => {
    if (!materialProfiles || materialProfiles.length === 0) {
      alert('Không có dữ liệu để xuất');
      return;
    }

    // Prepare data for Excel
    const excelData: (string | number)[][] = [];
    
    // Add header rows (merged cells will be handled later)
    excelData.push([
      'STT',
      'Tên thiết bị',
      'Tên vật tư (Dự toán)',
      'ĐVT (Dự toán)',
      'SL (Dự toán)',
      'Tên vật tư (Thực tế)',
      'ĐVT (Thực tế)',
      'SL (Thực tế)',
      'Chênh lệch'
    ]);

    // Add data rows
    materialProfiles.forEach((profile) => {
      const alignedMaterials = alignMaterials(profile.estimate, profile.reality);
      
      // Separate consumable and replacement materials
      const consumableMaterials = alignedMaterials.filter(
        (item) =>
          (item.estimate && profile.estimate?.consumable_supplies?.[item.name]) ||
          (item.reality && profile.reality?.consumable_supplies?.[item.name])
      );
      
      const replacementMaterials = alignedMaterials.filter(
        (item) =>
          (item.estimate && profile.estimate?.replacement_materials?.[item.name]) ||
          (item.reality && profile.reality?.replacement_materials?.[item.name])
      );

      let firstRow = true;
      
      // Add consumable materials header if exists
      if (consumableMaterials.length > 0) {
        excelData.push([
          firstRow ? profile.index_path : '',
          firstRow ? profile.equipment_machinery : '',
          'VẬT TƯ TIÊU HAO',
          '',
          '',
          '',
          '',
          '',
          ''
        ]);
        firstRow = false;
        
        // Add consumable material rows
        consumableMaterials.forEach((material) => {
          // If reality exists and estimate exists, show estimate name in reality column
          const realityName = material.reality?.name || (material.estimate?.name || '');
          
          excelData.push([
            '',
            '',
            material.estimate?.name || '',
            material.estimate?.unit || '',
            material.estimate?.quantity || 0,
            realityName,
            material.reality?.unit || '',
            material.reality?.quantity || 0,
            '' // Empty for formula
          ]);
        });
      }

      // Add replacement materials header if exists
      if (replacementMaterials.length > 0) {
        excelData.push([
          firstRow ? profile.index_path : '',
          firstRow ? profile.equipment_machinery : '',
          'VẬT TƯ THAY THẾ',
          '',
          '',
          '',
          '',
          '',
          ''
        ]);
        firstRow = false;
        
        // Add replacement material rows
        replacementMaterials.forEach((material) => {
          // If reality exists and estimate exists, show estimate name in reality column
          const realityName = material.reality?.name || (material.estimate?.name || '');
          
          excelData.push([
            '',
            '',
            material.estimate?.name || '',
            material.estimate?.unit || '',
            material.estimate?.quantity || 0,
            realityName,
            material.reality?.unit || '',
            material.reality?.quantity || 0,
            '' // Empty for formula
          ]);
        });
      }
      
      // If no materials, add empty row
      if (consumableMaterials.length === 0 && replacementMaterials.length === 0) {
        excelData.push([
          profile.index_path,
          profile.equipment_machinery,
          '',
          '',
          '',
          '',
          '',
          '',
          ''
        ]);
      }
    });

    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet(excelData);
    
    // Add formulas to difference column (column I)
    let currentRow = 2; // Start from row 2 (after header)
    materialProfiles.forEach((profile) => {
      const alignedMaterials = alignMaterials(profile.estimate, profile.reality);
      
      const consumableMaterials = alignedMaterials.filter(
        (item) =>
          (item.estimate && profile.estimate?.consumable_supplies?.[item.name]) ||
          (item.reality && profile.reality?.consumable_supplies?.[item.name])
      );
      
      const replacementMaterials = alignedMaterials.filter(
        (item) =>
          (item.estimate && profile.estimate?.replacement_materials?.[item.name]) ||
          (item.reality && profile.reality?.replacement_materials?.[item.name])
      );
      
      // Skip header rows and add formulas for each material row
      if (consumableMaterials.length > 0) {
        currentRow++; // Skip "VẬT TƯ TIÊU HAO" header
        consumableMaterials.forEach(() => {
          const cellAddress = `I${currentRow}`;
          ws[cellAddress] = { f: `E${currentRow}-H${currentRow}` };
          currentRow++;
        });
      }
      
      if (replacementMaterials.length > 0) {
        currentRow++; // Skip "VẬT TƯ THAY THẾ" header
        replacementMaterials.forEach(() => {
          const cellAddress = `I${currentRow}`;
          ws[cellAddress] = { f: `E${currentRow}-H${currentRow}` };
          currentRow++;
        });
      }
      
      // Handle empty equipment
      if (consumableMaterials.length === 0 && replacementMaterials.length === 0) {
        currentRow++;
      }
    });
    
    // Set column widths
    ws['!cols'] = [
      { wch: 10 },  // STT
      { wch: 35 },  // Tên thiết bị
      { wch: 30 },  // Tên vật tư (Dự toán)
      { wch: 10 },  // ĐVT (Dự toán)
      { wch: 12 },  // SL (Dự toán)
      { wch: 30 },  // Tên vật tư (Thực tế)
      { wch: 10 },  // ĐVT (Thực tế)
      { wch: 12 },  // SL (Thực tế)
      { wch: 12 }   // Chênh lệch
    ];
    
    // Apply bold formatting to header row (row 1)
    const headerCells = ['A1', 'B1', 'C1', 'D1', 'E1', 'F1', 'G1', 'H1', 'I1'];
    headerCells.forEach(cell => {
      if (ws[cell]) {
        ws[cell].s = {
          font: { bold: true },
          alignment: { horizontal: 'center', vertical: 'center' }
        };
      }
    });
    
    // Apply bold formatting to STT (column A) and Equipment Name (column B) for all data rows
    // Also bold "VẬT TƯ TIÊU HAO" and "VẬT TƯ THAY THẾ" headers
    currentRow = 2;
    materialProfiles.forEach((profile) => {
      const alignedMaterials = alignMaterials(profile.estimate, profile.reality);
      
      const consumableMaterials = alignedMaterials.filter(
        (item) =>
          (item.estimate && profile.estimate?.consumable_supplies?.[item.name]) ||
          (item.reality && profile.reality?.consumable_supplies?.[item.name])
      );
      
      const replacementMaterials = alignedMaterials.filter(
        (item) =>
          (item.estimate && profile.estimate?.replacement_materials?.[item.name]) ||
          (item.reality && profile.reality?.replacement_materials?.[item.name])
      );
      
      const startRow = currentRow;
      
      if (consumableMaterials.length > 0) {
        // Bold "VẬT TƯ TIÊU HAO" row
        const consumableHeaderCell = `C${currentRow}`;
        if (ws[consumableHeaderCell]) {
          ws[consumableHeaderCell].s = {
            font: { bold: true },
            alignment: { horizontal: 'center', vertical: 'center' }
          };
        }
        currentRow++;
        currentRow += consumableMaterials.length;
      }
      
      if (replacementMaterials.length > 0) {
        // Bold "VẬT TƯ THAY THẾ" row
        const replacementHeaderCell = `C${currentRow}`;
        if (ws[replacementHeaderCell]) {
          ws[replacementHeaderCell].s = {
            font: { bold: true },
            alignment: { horizontal: 'center', vertical: 'center' }
          };
        }
        currentRow++;
        currentRow += replacementMaterials.length;
      }
      
      if (consumableMaterials.length === 0 && replacementMaterials.length === 0) {
        currentRow++;
      }
      
      // Bold STT and Equipment name cells
      const sttCell = `A${startRow}`;
      const equipmentCell = `B${startRow}`;
      if (ws[sttCell]) {
        ws[sttCell].s = {
          font: { bold: true },
          alignment: { horizontal: 'center', vertical: 'center' }
        };
      }
      if (ws[equipmentCell]) {
        ws[equipmentCell].s = {
          font: { bold: true },
          alignment: { horizontal: 'left', vertical: 'center' }
        };
      }
    });

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Hồ sơ vật tư');

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().slice(0, 10);
    const filename = `Ho_so_vat_tu_${timestamp}.xlsx`;

    // Save file
    XLSX.writeFile(wb, filename);
    
    alert(`Đã xuất ${materialProfiles.length} thiết bị ra file Excel`);
  };

  // Function to align materials for comparison
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const alignMaterials = (estimate: any, reality: any): AlignedMaterial[] => {
    const allMaterials = new Set([
      ...Object.keys(estimate.consumable_supplies),
      ...Object.keys(estimate.replacement_materials),
      ...Object.keys(reality.consumable_supplies),
      ...Object.keys(reality.replacement_materials),
    ]);

    return Array.from(allMaterials).map((materialName) => {
      const estimateConsumable = estimate.consumable_supplies[materialName];
      const estimateReplacement = estimate.replacement_materials[materialName];
      const realityConsumable = reality.consumable_supplies[materialName];
      const realityReplacement = reality.replacement_materials[materialName];

      const estimateItem = estimateConsumable || estimateReplacement;
      const realityItem = realityConsumable || realityReplacement;

      return {
        name: materialName,
        estimate: estimateItem || null,
        reality: realityItem || null,
      };
    });
  };

  useEffect(() => {
    // Prevent double execution in React Strict Mode
    if (hasInitialized.current) return;
    hasInitialized.current = true;
    
    const initializePage = async () => {
      // Load maintenances first
      await loadMaintenances();
      
      // Check for URL parameters
      const maintenanceId = searchParams.get('maintenance_id');
      const projectName = searchParams.get('project');
      
      if (maintenanceId) {
        // Auto-apply filter from URL parameters
        setSelectedMaintenanceIds([maintenanceId]);
        const newFilters = {
          maintenance_ids: [maintenanceId],
          equipment_machinery_ids: [],
          sector: '',
        };
        setFilters(newFilters);
        // Fetch data with the new filters (only once)
        await fetchData(newFilters);
        
        // Show notification (only once)
        if (projectName) {
          setTimeout(() => {
            alert(`Đang hiển thị vật tư cho dự án: ${decodeURIComponent(projectName)}`);
          }, 500);
        }
      } else {
        // No URL params, fetch all data
        await fetchData();
      }
    };
    
    initializePage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load equipments when sector changes
  useEffect(() => {
    if (filters.sector) {
      loadEquipments(filters.sector);
    } else {
      setEquipments([]);
      setSelectedEquipmentIds([]);
    }
  }, [filters.sector]);

  const loadMaintenances = async () => {
    setLoadingMaintenances(true);
    try {
      const response = await maintenanceService.getAll();
      if (response.status && response.data) {
        setMaintenances(response.data);
      }
    } catch (err) {
      console.error('Error loading maintenances:', err);
    } finally {
      setLoadingMaintenances(false);
    }
  };

  const loadEquipments = async (sector: string) => {
    setLoadingEquipments(true);
    try {
      const response = await equipmentMachineryService.filter({ sector });
      if (response.status && response.data) {
        setEquipments(response.data);
      }
    } catch (err) {
      console.error('Error loading equipments:', err);
    } finally {
      setLoadingEquipments(false);
    }
  };

  const fetchData = async (filterParams?: MaterialsProfileFilterParams) => {
    try {
      setLoading(true);
      setError(null);

      // Use provided filters or current state filters
      const currentFilters = filterParams || filters;

      // Check if any filter is applied
      const hasFilters = 
        currentFilters.sector || 
        (currentFilters.maintenance_ids && currentFilters.maintenance_ids.length > 0) || 
        (currentFilters.equipment_machinery_ids && currentFilters.equipment_machinery_ids.length > 0);

      if (hasFilters) {
        // Use filter API
        const response = await materialsProfileService.filter(currentFilters);
        console.log('Filtered material profiles:', response.data);
        setMaterialProfiles(response.data || []);
      } else {
        // Use paginate API
        const response = await materialsProfileService.paginate(1, 10);
        console.log('Paginated material profiles:', response.data.items);
        setMaterialProfiles(response.data.items || []);
      }
    } catch (error) {
      console.error('Failed to load material profiles:', error);
      setError('Không thể tải dữ liệu vật tư.');
      setMaterialProfiles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (
    key: keyof MaterialsProfileFilterParams,
    value: string
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleApplyFilter = () => {
    const newFilters = {
      ...filters,
      maintenance_ids: selectedMaintenanceIds,
      equipment_machinery_ids: selectedEquipmentIds,
    };
    setFilters(newFilters);
    setIsFiltering(true);
    fetchData(newFilters); // Pass new filters directly
  };

  const handleClearFilter = () => {
    const emptyFilters = {
      maintenance_ids: [],
      equipment_machinery_ids: [],
      sector: ''
    };
    setFilters(emptyFilters);
    setSelectedMaintenanceIds([]);
    setSelectedEquipmentIds([]);
    setIsFiltering(false);
    fetchData(emptyFilters); // Pass empty filters directly
  };

  const handleMaintenanceToggle = (maintenanceId: string) => {
    setSelectedMaintenanceIds(prev => {
      if (prev.includes(maintenanceId)) {
        return prev.filter(id => id !== maintenanceId);
      } else {
        return [...prev, maintenanceId];
      }
    });
  };

  const handleEquipmentToggle = (equipmentId: string) => {
    setSelectedEquipmentIds(prev => {
      if (prev.includes(equipmentId)) {
        return prev.filter(id => id !== equipmentId);
      } else {
        return [...prev, equipmentId];
      }
    });
  };

  return (
    <DashboardLayout>
      <Header title="QUẢN LÝ VẬT TƯ" />
      <div className="p-6 space-y-6">
        {/* Action Bar */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] font-medium"
          >
            <UploadIcon />
            <span>Cập nhật dự toán</span>
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl hover:from-orange-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] font-medium"
          >
            <PlusIcon />
            <span>Tạo hồ sơ vật tư</span>
          </button>
          <button
            onClick={handleExportToExcel}
            disabled={!materialProfiles || materialProfiles.length === 0}
            className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <ExcelIcon />
            <span>Xuất Excel</span>
          </button>
        </div>

        {/* Upload Modal */}
        <UploadEstimateModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          onSuccess={() => {
            fetchData(); // Reload data after successful upload
          }}
        />

        {/* Create Materials Profile Modal */}
        <CreateMaterialsProfileModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={() => {
            fetchData(); // Reload data after successful creation
          }}
        />

        {/* Filter Section */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                <FilterIcon />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Bộ lọc tìm kiếm</h3>
            </div>
            {isFiltering && (
              <span className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                <FilterIcon />
                <span>Đang lọc</span>
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Sector Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                🏭 Ngành
              </label>
              <select
                value={filters.sector}
                onChange={(e) => handleFilterChange('sector', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 text-gray-900 font-medium transition-all duration-200 bg-white hover:border-cyan-300"
              >
                <option value="">Tất cả ngành</option>
                {Object.values(SECTORS).map((sector) => (
                  <option key={sector} value={sector}>
                    {sector}
                  </option>
                ))}
              </select>
            </div>

            {/* Maintenance Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                📋 Dự án
              </label>
              {loadingMaintenances ? (
                <div className="flex items-center gap-2 text-gray-500 text-sm px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cyan-500"></div>
                  <span>Đang tải...</span>
                </div>
              ) : (
                <>
                  <select
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value && !selectedMaintenanceIds.includes(value)) {
                        handleMaintenanceToggle(value);
                        e.target.value = '';
                      }
                    }}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 text-gray-900 font-medium transition-all duration-200 bg-white hover:border-cyan-300"
                  >
                    <option value="">Chọn dự án...</option>
                    {maintenances
                      .filter(m => !selectedMaintenanceIds.includes(m.id))
                      .map((maintenance) => (
                        <option key={maintenance.id} value={maintenance.id}>
                          {maintenance.project} - {maintenance.maintenance_tier} - Lần {maintenance.maintenance_number}
                        </option>
                      ))}
                  </select>
                  {selectedMaintenanceIds.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {selectedMaintenanceIds.map((id) => {
                        const maintenance = maintenances.find(m => m.id === id);
                        if (!maintenance) return null;
                        return (
                          <div
                            key={id}
                            className="inline-flex items-center gap-1.5 bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-800 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                          >
                            <span>
                              {maintenance.project} - {maintenance.maintenance_tier} - Lần {maintenance.maintenance_number}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleMaintenanceToggle(id)}
                              className="hover:text-cyan-900 transition-colors"
                            >
                              <CloseIcon />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Equipment Selection */}
            <div className="relative space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                ⚙️ Thiết bị
              </label>
              {!filters.sector ? (
                <div className="px-4 py-3 text-sm text-gray-500 border-2 border-gray-200 rounded-xl bg-gray-50 flex items-center gap-2">
                  <span>💡</span>
                  <span>Vui lòng chọn ngành trước</span>
                </div>
              ) : loadingEquipments ? (
                <div className="flex items-center gap-2 text-gray-500 text-sm px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cyan-500"></div>
                  <span>Đang tải...</span>
                </div>
              ) : (
                <>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <SearchIcon />
                    </div>
                    <input
                      type="text"
                      value={equipmentSearchTerm}
                      onChange={(e) => setEquipmentSearchTerm(e.target.value)}
                      onFocus={() => setIsEquipmentDropdownOpen(true)}
                      placeholder="Tìm kiếm thiết bị..."
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 text-gray-900 font-medium transition-all duration-200 bg-white hover:border-cyan-300"
                    />
                    {isEquipmentDropdownOpen && (
                      <>
                        <div 
                          className="fixed inset-0 z-10" 
                          onClick={() => setIsEquipmentDropdownOpen(false)}
                        />
                        <div className="absolute z-20 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
                          {equipments
                            .filter(eq => 
                              !selectedEquipmentIds.includes(eq.id) &&
                              eq.name.toLowerCase().includes(equipmentSearchTerm.toLowerCase())
                            )
                            .map((equipment) => (
                              <div
                                key={equipment.id}
                                onClick={() => {
                                  handleEquipmentToggle(equipment.id);
                                  setEquipmentSearchTerm('');
                                  setIsEquipmentDropdownOpen(false);
                                }}
                                className="px-4 py-3 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 cursor-pointer text-gray-900 border-b border-gray-100 last:border-b-0 transition-all duration-150 font-medium"
                              >
                                {equipment.name}
                              </div>
                            ))}
                          {equipments.filter(eq => 
                            !selectedEquipmentIds.includes(eq.id) &&
                            eq.name.toLowerCase().includes(equipmentSearchTerm.toLowerCase())
                          ).length === 0 && (
                            <div className="px-4 py-3 text-gray-500 text-center text-sm">
                              Không tìm thấy thiết bị
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                  {selectedEquipmentIds.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {selectedEquipmentIds.map((id) => {
                        const equipment = equipments.find(eq => eq.id === id);
                        if (!equipment) return null;
                        return (
                          <div
                            key={id}
                            className="inline-flex items-center gap-1.5 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                          >
                            <span>{equipment.name}</span>
                            <button
                              type="button"
                              onClick={() => handleEquipmentToggle(id)}
                              className="hover:text-green-900 transition-colors"
                            >
                              <CloseIcon />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Filter Action Buttons */}
          <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={handleApplyFilter}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] font-semibold"
            >
              <FilterIcon />
              <span>Áp dụng bộ lọc</span>
            </button>
            <button
              onClick={handleClearFilter}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] font-semibold"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Xóa bộ lọc</span>
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col justify-center items-center py-20 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border border-gray-100">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-cyan-200"></div>
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-cyan-500 absolute top-0 left-0"></div>
            </div>
            <span className="mt-6 text-lg font-semibold text-gray-700">Đang tải dữ liệu...</span>
            <span className="mt-2 text-sm text-gray-500">Vui lòng chờ trong giây lát</span>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-full">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-red-900 mb-1">Lỗi tải dữ liệu</h3>
                <span className="text-red-700">{error}</span>
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-xl p-6 text-white transform hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium opacity-90 mb-1">
                    Trang thiết bị
                  </p>
                  <p className="text-4xl font-bold">
                    {materialProfiles?.length ?? 0}
                  </p>
                </div>
                <div className="p-4 bg-white/20 backdrop-blur-sm rounded-xl">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl shadow-xl p-6 text-white transform hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium opacity-90 mb-1">
                    Vật tư dự toán
                  </p>
                  <p className="text-4xl font-bold">
                    {materialProfiles?.reduce((sum, profile) => {
                      const consumableCount = profile.estimate?.consumable_supplies 
                        ? Object.keys(profile.estimate.consumable_supplies).length : 0;
                      const replacementCount = profile.estimate?.replacement_materials 
                        ? Object.keys(profile.estimate.replacement_materials).length : 0;
                      return sum + consumableCount + replacementCount;
                    }, 0)}
                  </p>
                </div>
                <div className="p-4 bg-white/20 backdrop-blur-sm rounded-xl">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl shadow-xl p-6 text-white transform hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium opacity-90 mb-1">
                    Vượt dự toán
                  </p>
                  <p className="text-4xl font-bold">
                    {materialProfiles?.reduce((count, profile) => {
                      const alignedMaterials = alignMaterials(profile.estimate, profile.reality);
                      const overBudgetCount = alignedMaterials.filter((item) => {
                        const estimateQty = item.estimate ? item.estimate.quantity : 0;
                        const realityQty = item.reality ? item.reality.quantity : 0;
                        return realityQty > estimateQty;
                      });
                      return count + overBudgetCount.length;
                    }, 0)}
                  </p>
                </div>
                <div className="p-4 bg-white/20 backdrop-blur-sm rounded-xl">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Materials Table */}
        {!loading && !error && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="overflow-x-auto max-h-[calc(100vh-100px)] overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 sticky top-0 z-10">
                  <tr className="border-b-2 border-white/20">
                    <th
                      rowSpan={2}
                      className="px-3 py-4 text-center text-xs font-bold text-white uppercase tracking-wider border-r border-white/20 w-12"
                    >
                      TT
                    </th>
                    <th
                      rowSpan={2}
                      className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider border-r border-white/20 min-w-[200px]"
                    >
                      Thiết bị
                    </th>
                    <th
                      colSpan={3}
                      className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider border-r border-white/20"
                    >
                      📋 Vật tư dự toán
                    </th>
                    <th
                      colSpan={3}
                      className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider border-r border-white/20"
                    >
                      ✅ Vật tư thực tế
                    </th>
                    <th
                      rowSpan={2}
                      className="px-3 py-4 text-center text-xs font-bold text-white uppercase tracking-wider w-24"
                    >
                      Chênh lệch
                    </th>
                  </tr>
                  <tr className="border-b-2 border-white/20">
                    <th className="px-4 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider border-r border-white/20 min-w-[150px]">
                      Tên vật tư
                    </th>
                    <th className="px-2 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider border-r border-white/20 w-16">
                      ĐVT
                    </th>
                    <th className="px-2 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider border-r border-white/20 w-16">
                      SL
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider border-r border-white/20 min-w-[150px]">
                      Tên vật tư
                    </th>
                    <th className="px-2 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider border-r border-white/20 w-16">
                      ĐVT
                    </th>
                    <th className="px-2 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider border-r border-white/20 w-16">
                      SL
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {materialProfiles?.map((material) => {
                    const alignedMaterials = alignMaterials(
                      material.estimate,
                      material.reality
                    );

                    // Separate consumable and replacement materials
                    const consumableMaterials = alignedMaterials.filter(
                      (item) =>
                        (item.estimate &&
                          material.estimate?.consumable_supplies?.[
                            item.name
                          ]) ||
                        (item.reality &&
                          material.reality?.consumable_supplies?.[item.name])
                    );

                    const replacementMaterials = alignedMaterials.filter(
                      (item) =>
                        (item.estimate &&
                          material.estimate?.replacement_materials?.[
                            item.name
                          ]) ||
                        (item.reality &&
                          material.reality?.replacement_materials?.[item.name])
                    );

                    // Create rows array: header rows + material rows
                    type RowType = 
                      | { type: 'header'; category: string; label: string }
                      | { type: 'material'; category: string; data: AlignedMaterial };
                    
                    const allRows: RowType[] = [];
                    
                    // Add consumable header
                    if (consumableMaterials.length > 0) {
                      allRows.push({ 
                        type: 'header', 
                        category: 'consumable',
                        label: 'Vật tư tiêu hao'
                      });
                    }
                    
                    // Add consumable materials
                    consumableMaterials.forEach((item) => {
                      allRows.push({ 
                        type: 'material', 
                        category: 'consumable',
                        data: item 
                      });
                    });
                    
                    // Add replacement header
                    if (replacementMaterials.length > 0) {
                      allRows.push({ 
                        type: 'header', 
                        category: 'replacement',
                        label: 'Vật tư thay thế'
                      });
                    }
                    
                    // Add replacement materials
                    replacementMaterials.forEach((item) => {
                      allRows.push({ 
                        type: 'material', 
                        category: 'replacement',
                        data: item 
                      });
                    });

                    const totalRows = allRows.length || 1; // At least 1 row if no materials

                    return allRows.length > 0 ? allRows.map((row, rowIndex) => (
                      <tr key={`${material.id}-${rowIndex}`} className="hover:bg-gray-50 border-b border-gray-200">
                        {/* Equipment Index - only on first row */}
                        {rowIndex === 0 && (
                          <td 
                            rowSpan={totalRows} 
                            className="px-3 py-4 text-center border-r border-gray-200 align-top bg-gradient-to-br from-gray-50 to-gray-100"
                          >
                            <div className="text-sm font-bold text-gray-900 sticky top-0">
                              {material.index_path}
                            </div>
                          </td>
                        )}
                        
                        {/* Equipment Name - only on first row */}
                        {rowIndex === 0 && (
                          <td 
                            rowSpan={totalRows} 
                            className="px-6 py-4 border-r border-gray-200 align-top bg-gradient-to-br from-blue-50 to-cyan-50"
                          >
                            <div className="sticky top-0">
                              <div className="text-sm font-bold text-gray-900">
                                {material.equipment_machinery}
                              </div>
                            </div>
                          </td>
                        )}

                        {/* Render based on row type */}
                        {row.type === 'header' ? (
                          // Header row (category label)
                          <>
                            <td 
                              colSpan={3} 
                              className={`px-4 py-3 text-center border-r border-gray-200 ${
                                row.category === 'consumable' 
                                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500' 
                                  : 'bg-gradient-to-r from-green-500 to-emerald-500'
                              }`}
                            >
                              <div className="text-sm font-bold uppercase text-white tracking-wide">
                                {'label' in row ? row.label : ''}
                              </div>
                            </td>
                            <td 
                              colSpan={3} 
                              className={`px-4 py-3 text-center border-r border-gray-200 ${
                                row.category === 'consumable' 
                                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500' 
                                  : 'bg-gradient-to-r from-green-500 to-emerald-500'
                              }`}
                            >
                              <div className="text-sm font-bold uppercase text-white tracking-wide">
                                {'label' in row ? row.label : ''}
                              </div>
                            </td>
                            <td className={`px-2 py-3 text-center ${
                              row.category === 'consumable' 
                                ? 'bg-gradient-to-r from-blue-500 to-indigo-500' 
                                : 'bg-gradient-to-r from-green-500 to-emerald-500'
                            }`}>
                              <div className="text-sm font-bold uppercase text-white tracking-wide">
                                Chênh lệch
                              </div>
                            </td>
                          </>
                        ) : row.type === 'material' ? (
                          // Material row
                          <>
                            {/* Estimate Material Name */}
                            <td className="px-4 py-2 border-r border-gray-200">
                              <div className="text-sm text-gray-900 break-words">
                                {row.data.estimate?.name || '-'}
                              </div>
                            </td>
                            
                            {/* Estimate Material Unit */}
                            <td className="px-2 py-2 text-center border-r border-gray-200">
                              <div className="text-sm text-gray-900">
                                {row.data.estimate?.unit || '-'}
                              </div>
                            </td>
                            
                            {/* Estimate Material Quantity */}
                            <td className="px-2 py-2 text-center border-r border-gray-200">
                              <div className="text-sm text-gray-900 font-medium">
                                {row.data.estimate?.quantity || '-'}
                              </div>
                            </td>
                            
                            {/* Reality Material Name */}
                            <td className="px-4 py-2 border-r border-gray-200">
                              <div className="text-sm text-gray-900 break-words">
                                {row.data.reality?.name || '-'}
                              </div>
                            </td>
                            
                            {/* Reality Material Unit */}
                            <td className="px-2 py-2 text-center border-r border-gray-200">
                              <div className="text-sm text-gray-900">
                                {row.data.reality?.unit || '-'}
                              </div>
                            </td>
                            
                            {/* Reality Material Quantity */}
                            <td className="px-2 py-2 text-center border-r border-gray-200">
                              <div className="text-sm text-gray-900 font-medium">
                                {row.data.reality?.quantity || '-'}
                              </div>
                            </td>
                            
                            {/* Difference */}
                            <td className="px-2 py-2 text-center">
                              {(() => {
                                const estimateQty = row.data.estimate?.quantity || 0;
                                const realityQty = row.data.reality?.quantity || 0;
                                const diff = estimateQty - realityQty;
                                const diffColor =
                                  diff > 0
                                    ? 'text-green-600 bg-green-50'
                                    : diff < 0
                                    ? 'text-orange-600 bg-orange-50'
                                    : 'text-gray-500 bg-gray-50';
                                return (
                                  <div className={`text-sm font-bold ${diffColor} px-2 py-1 rounded-lg inline-block`}>
                                    {diff !== 0
                                      ? diff > 0
                                        ? `+${diff}`
                                        : diff
                                      : '-'}
                                  </div>
                                );
                              })()}
                            </td>
                          </>
                        ) : null}
                      </tr>
                    )) : (
                      // Empty equipment case
                      <tr key={material.id} className="hover:bg-gray-50 border-b border-gray-200 transition-colors">
                        <td className="px-3 py-4 text-center border-r border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100">
                          <div className="text-sm font-bold text-gray-900">
                            {material.index_path}
                          </div>
                        </td>
                        <td className="px-6 py-4 border-r border-gray-200 bg-gradient-to-br from-blue-50 to-cyan-50">
                          <div>
                            <div className="text-sm font-bold text-gray-900">
                              {material.equipment_machinery}
                            </div>
                          </div>
                        </td>
                        <td colSpan={7} className="px-4 py-4 text-center">
                          <span className="text-gray-400 italic text-sm">Chưa có vật tư</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
