'use client';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Header from '@/components/layout/Header';
import React, { useEffect, useState } from 'react';
import { AlignedMaterial, MaterialsProfile, Maintenance, EquipmentMachinery, SECTORS } from '@/types/api';
import {
  materialsProfileService,
  MaterialsProfileFilterParams,
} from '@/services/materialsProfileService';
import { maintenanceService, equipmentMachineryService } from '@/services';
import UploadEstimateModal from '@/components/materials/UploadEstimateModal';
import CreateMaterialsProfileModal from '@/components/materials/CreateMaterialsProfileModal';



export default function MaterialsPage() {
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

  // Modal states
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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
    fetchData();
    loadMaintenances();
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

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if any filter is applied
      const hasFilters = 
        filters.sector || 
        (filters.maintenance_ids && filters.maintenance_ids.length > 0) || 
        (filters.equipment_machinery_ids && filters.equipment_machinery_ids.length > 0);

      if (hasFilters) {
        // Use filter API
        const response = await materialsProfileService.filter(filters);
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
    setFilters(prev => ({
      ...prev,
      maintenance_ids: selectedMaintenanceIds,
      equipment_machinery_ids: selectedEquipmentIds,
    }));
    setIsFiltering(true);
    setTimeout(() => fetchData(), 0);
  };

  const handleClearFilter = () => {
    setFilters({
      maintenance_ids: [],
      equipment_machinery_ids: [],
      sector: ''
    });
    setSelectedMaintenanceIds([]);
    setSelectedEquipmentIds([]);
    setIsFiltering(false);
    setTimeout(() => fetchData(), 0);
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
      <Header title="VẬT TƯ" />
      <div className="p-6">
        {/* Action Bar */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-4">
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="bg-cyan-500 text-white px-4 py-2 rounded-lg hover:bg-cyan-600 transition-colors flex items-center space-x-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <span>Cập nhật dự toán</span>
            </button>
            {/* <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
              Nhập kho
            </button> */}
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Tạo hồ sơ vật tư mới
            </button>
            <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span>Xuất báo cáo</span>
            </button>
          </div>
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
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Bộ lọc</h3>
            {isFiltering && (
              <span className="text-sm text-blue-600 flex items-center">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                    clipRule="evenodd"
                  />
                </svg>
                Đang lọc
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Sector Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngành
              </label>
              <select
                value={filters.sector}
                onChange={(e) => handleFilterChange('sector', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-900 font-medium"
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dự án
              </label>
              {loadingMaintenances ? (
                <div className="flex items-center text-gray-500 text-sm px-3 py-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cyan-500 mr-2"></div>
                  Đang tải...
                </div>
              ) : (
                <>
                  <select
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value && !selectedMaintenanceIds.includes(value)) {
                        handleMaintenanceToggle(value);
                        e.target.value = ''; // Reset select
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-900 font-medium"
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
                  {/* Selected maintenances */}
                  {selectedMaintenanceIds.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedMaintenanceIds.map((id) => {
                        const maintenance = maintenances.find(m => m.id === id);
                        if (!maintenance) return null;
                        return (
                          <div
                            key={id}
                            className="inline-flex items-center bg-cyan-100 text-cyan-800 text-xs font-medium px-2 py-1 rounded"
                          >
                            <span className="mr-1">
                              {maintenance.project} - {maintenance.maintenance_tier} - Lần {maintenance.maintenance_number}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleMaintenanceToggle(id)}
                              className="hover:text-cyan-900"
                            >
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thiết bị
              </label>
              {!filters.sector ? (
                <div className="px-3 py-2 text-sm text-gray-500 border border-gray-300 rounded-lg bg-gray-50">
                  Vui lòng chọn ngành trước
                </div>
              ) : loadingEquipments ? (
                <div className="flex items-center text-gray-500 text-sm px-3 py-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cyan-500 mr-2"></div>
                  Đang tải...
                </div>
              ) : (
                <>
                  <select
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value && !selectedEquipmentIds.includes(value)) {
                        handleEquipmentToggle(value);
                        e.target.value = ''; // Reset select
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-900 font-medium"
                  >
                    <option value="">Chọn thiết bị...</option>
                    {equipments
                      .filter(eq => !selectedEquipmentIds.includes(eq.id))
                      .map((equipment) => (
                        <option key={equipment.id} value={equipment.id}>
                          {equipment.name}
                        </option>
                      ))}
                  </select>
                  {/* Selected equipments */}
                  {selectedEquipmentIds.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedEquipmentIds.map((id) => {
                        const equipment = equipments.find(eq => eq.id === id);
                        if (!equipment) return null;
                        return (
                          <div
                            key={id}
                            className="inline-flex items-center bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded"
                          >
                            <span className="mr-1">{equipment.name}</span>
                            <button
                              type="button"
                              onClick={() => handleEquipmentToggle(id)}
                              className="hover:text-green-900"
                            >
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
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
          <div className="flex space-x-4 mt-4">
            <button
              onClick={handleApplyFilter}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              <span>Áp dụng</span>
            </button>
            <button
              onClick={handleClearFilter}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <span>Xóa bộ lọc</span>
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
            <span className="ml-3 text-gray-600">Đang tải dữ liệu...</span>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <svg
                className="w-6 h-6 text-red-500 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">
                    Tổng số trang thiết bị
                  </p>
                  <p className="text-xl font-semibold text-gray-900">
                    {materialProfiles?.length ?? 0}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">
                    Tổng số vật tư dự toán
                  </p>
                  <p className="text-xl font-semibold text-gray-900">
                    {materialProfiles?.reduce((sum, profile) => {
                      const consumableCount = profile.estimate
                        ?.consumable_supplies
                        ? Object.keys(profile.estimate.consumable_supplies)
                            .length
                        : 0;
                      const replacementCount = profile.estimate
                        ?.replacement_materials
                        ? Object.keys(profile.estimate.replacement_materials)
                            .length
                        : 0;
                      return sum + consumableCount + replacementCount;
                    }, 0)}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <svg
                    className="w-5 h-5 text-yellow-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">
                    Tổng số vật tư vượt dự toán
                  </p>
                  <p className="text-xl font-semibold text-gray-900">
                    {materialProfiles?.reduce((count, profile) => {
                      const alignedMaterials = alignMaterials(
                        profile.estimate,
                        profile.reality
                      );
                      const overBudgetCount = alignedMaterials.filter(
                        (item) => {
                          const estimateQty = item.estimate
                            ? item.estimate.quantity
                            : 0;
                          const realityQty = item.reality
                            ? item.reality.quantity
                            : 0;
                          return realityQty > estimateQty;
                        }
                      );
                      return count + overBudgetCount.length;
                    }, 0)}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <svg
                    className="w-5 h-5 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                </div>
                {/* <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">
                  Tổng giá trị
                </p>
                <p className="text-xl font-semibold text-gray-900">
                  {(
                    materials.reduce(
                      (sum, m) => sum + m.quantity * m.price,
                      0
                    ) / 1000000
                  ).toFixed(1)}
                  M
                </p>
              </div> */}
              </div>
            </div>
          </div>
        )}

        {/* Materials Table */}
        {!loading && !error && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto max-h-[calc(100vh-100px)] overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-500 sticky top-0 z-10">
                  <tr className="border-b border-gray-600">
                    <th
                      rowSpan={2}
                      className="px-3 py-3 text-center text-xs font-medium text-white uppercase tracking-wider border-r border-gray-600 w-12"
                    >
                      TT
                    </th>
                    <th
                      rowSpan={2}
                      className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider border-r border-gray-600 min-w-[200px]"
                    >
                      Thiết bị
                    </th>
                    <th
                      colSpan={3}
                      className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider border-r border-gray-600"
                    >
                      Vật tư dự toán
                    </th>
                    <th
                      colSpan={3}
                      className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider border-r border-gray-600"
                    >
                      Vật tư thực tế
                    </th>
                    <th
                      rowSpan={2}
                      className="px-3 py-3 text-center text-xs font-medium text-white uppercase tracking-wider w-24"
                    >
                      Trạng thái
                    </th>
                  </tr>
                  <tr className="border-b border-gray-600">
                    <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider border-r border-gray-600 min-w-[150px]">
                      Tên vật tư
                    </th>
                    <th className="px-2 py-3 text-center text-xs font-medium text-white uppercase tracking-wider border-r border-gray-600 w-16">
                      ĐVT
                    </th>
                    <th className="px-2 py-3 text-center text-xs font-medium text-white uppercase tracking-wider border-r border-gray-600 w-16">
                      SL
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider border-r border-gray-600 min-w-[150px]">
                      Tên vật tư
                    </th>
                    <th className="px-2 py-3 text-center text-xs font-medium text-white uppercase tracking-wider border-r border-gray-600 w-16">
                      ĐVT
                    </th>
                    <th className="px-2 py-3 text-center text-xs font-medium text-white uppercase tracking-wider border-r border-gray-600 w-16">
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

                    return (
                      <tr key={material.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {material.index_path}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {material.equipment_machinery}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {material.id}
                            </div>

                            <div className="text-sm text-gray-500">
                              Ngành: {material.sector}
                            </div>
                          </div>
                        </td>
                        {/* Estimate Materials Name */}
                        <td className="px-4 py-4 align-top">
                          <div className="space-y-2">
                            {/* Consumable Materials Section */}
                            {(consumableMaterials.length > 0 ||
                              replacementMaterials.length > 0) && (
                              <div className="text-sm font-bold uppercase text-white bg-blue-500 border border-blue-600 rounded px-2 py-1 min-h-[32px] flex items-center justify-center">
                                Vật tư tiêu hao
                              </div>
                            )}
                            {consumableMaterials.map((item, idx) => (
                              <div
                                key={`consumable-${idx}`}
                                className="text-sm text-gray-900 border-b border-gray-100 pb-1 min-h-[32px] flex items-center"
                              >
                                {item.estimate?.name || ''}
                              </div>
                            ))}
                            {consumableMaterials.length === 0 &&
                              (consumableMaterials.length > 0 ||
                                replacementMaterials.length > 0) && (
                                <div className="text-sm text-gray-400 border-b border-gray-100 pb-1 min-h-[32px] flex items-center italic">
                                  Không có
                                </div>
                              )}

                            {/* Replacement Materials Section */}
                            {(consumableMaterials.length > 0 ||
                              replacementMaterials.length > 0) && (
                              <div className="text-sm font-bold uppercase text-white bg-green-500 border border-green-600 rounded px-2 py-1 min-h-[32px] mt-2 flex items-center justify-center">
                                Vật tư thay thế
                              </div>
                            )}
                            {replacementMaterials.map((item, idx) => (
                              <div
                                key={`replacement-${idx}`}
                                className="text-sm text-gray-900 border-b border-gray-100 pb-1 min-h-[32px] flex items-center"
                              >
                                {item.estimate?.name || ''}
                              </div>
                            ))}
                            {replacementMaterials.length === 0 &&
                              (consumableMaterials.length > 0 ||
                                replacementMaterials.length > 0) && (
                                <div className="text-sm text-gray-400 border-b border-gray-100 pb-1 min-h-[32px] flex items-center italic">
                                  Không có
                                </div>
                              )}
                          </div>
                        </td>

                        {/* Estimate Materials Unit */}
                        <td className="px-2 py-4 text-center align-top">
                          <div className="space-y-2">
                            {/* Empty header space for consumables */}
                            {(consumableMaterials.length > 0 ||
                              replacementMaterials.length > 0) && (
                              <div className="text-sm font-bold text-transparent bg-blue-500 border border-blue-600 rounded px-2 py-1 min-h-[32px]">
                                .
                              </div>
                            )}
                            {consumableMaterials.map((item, idx) => (
                              <div
                                key={`consumable-${idx}`}
                                className="text-sm text-gray-900 border-b border-gray-100 pb-1 min-h-[32px] flex items-center justify-center"
                              >
                                {item.estimate?.unit || ''}
                              </div>
                            ))}
                            {consumableMaterials.length === 0 &&
                              (consumableMaterials.length > 0 ||
                                replacementMaterials.length > 0) && (
                                <div className="text-sm text-gray-400 border-b border-gray-100 pb-1 min-h-[32px]"></div>
                              )}

                            {/* Empty header space for replacements */}
                            {(consumableMaterials.length > 0 ||
                              replacementMaterials.length > 0) && (
                              <div className="text-sm font-bold text-transparent bg-green-500 border border-green-600 rounded px-2 py-1 min-h-[32px] mt-2">
                                .
                              </div>
                            )}
                            {replacementMaterials.map((item, idx) => (
                              <div
                                key={`replacement-${idx}`}
                                className="text-sm text-gray-900 border-b border-gray-100 pb-1 min-h-[32px] flex items-center justify-center"
                              >
                                {item.estimate?.unit || ''}
                              </div>
                            ))}
                            {replacementMaterials.length === 0 &&
                              (consumableMaterials.length > 0 ||
                                replacementMaterials.length > 0) && (
                                <div className="text-sm text-gray-400 border-b border-gray-100 pb-1 min-h-[32px]"></div>
                              )}
                          </div>
                        </td>

                        {/* Estimate Materials Quantity */}
                        <td className="px-2 py-4 text-center align-top">
                          <div className="space-y-2">
                            {/* Empty header space for consumables */}
                            {(consumableMaterials.length > 0 ||
                              replacementMaterials.length > 0) && (
                              <div className="text-sm font-bold text-transparent bg-blue-500 border border-blue-600 rounded px-2 py-1 min-h-[32px]">
                                .
                              </div>
                            )}
                            {consumableMaterials.map((item, idx) => (
                              <div
                                key={`consumable-${idx}`}
                                className="text-sm text-gray-900 border-b border-gray-100 pb-1 min-h-[32px] flex items-center justify-center"
                              >
                                {item.estimate?.quantity || ''}
                              </div>
                            ))}
                            {consumableMaterials.length === 0 &&
                              (consumableMaterials.length > 0 ||
                                replacementMaterials.length > 0) && (
                                <div className="text-sm text-gray-400 border-b border-gray-100 pb-1 min-h-[32px]"></div>
                              )}

                            {/* Empty header space for replacements */}
                            {(consumableMaterials.length > 0 ||
                              replacementMaterials.length > 0) && (
                              <div className="text-sm font-bold text-transparent bg-green-500 border border-green-600 rounded px-2 py-1 min-h-[32px] mt-2">
                                .
                              </div>
                            )}
                            {replacementMaterials.map((item, idx) => (
                              <div
                                key={`replacement-${idx}`}
                                className="text-sm text-gray-900 border-b border-gray-100 pb-1 min-h-[32px] flex items-center justify-center"
                              >
                                {item.estimate?.quantity || ''}
                              </div>
                            ))}
                            {replacementMaterials.length === 0 &&
                              (consumableMaterials.length > 0 ||
                                replacementMaterials.length > 0) && (
                                <div className="text-sm text-gray-400 border-b border-gray-100 pb-1 min-h-[32px]"></div>
                              )}
                          </div>
                        </td>

                        {/* Reality Materials Name */}
                        <td className="px-4 py-4 align-top">
                          <div className="space-y-2">
                            {/* Consumable Materials Section */}
                            {(consumableMaterials.length > 0 ||
                              replacementMaterials.length > 0) && (
                              <div className="text-sm font-bold uppercase text-white bg-blue-500 border border-blue-600 rounded px-2 py-1 min-h-[32px] flex items-center justify-center">
                                Vật tư tiêu hao
                              </div>
                            )}
                            {consumableMaterials.map((item, idx) => (
                              <div
                                key={`consumable-${idx}`}
                                className="text-sm text-gray-900 border-b border-gray-100 pb-1 min-h-[32px] flex items-center"
                              >
                                {item.reality?.name || ''}
                              </div>
                            ))}
                            {consumableMaterials.length === 0 &&
                              (consumableMaterials.length > 0 ||
                                replacementMaterials.length > 0) && (
                                <div className="text-sm text-gray-400 border-b border-gray-100 pb-1 min-h-[32px] flex items-center italic">
                                  Không có
                                </div>
                              )}

                            {/* Replacement Materials Section */}
                            {(consumableMaterials.length > 0 ||
                              replacementMaterials.length > 0) && (
                              <div className="text-sm font-bold uppercase text-white bg-green-500 border border-green-600 rounded px-2 py-1 min-h-[32px] mt-2 flex items-center justify-center">
                                Vật tư thay thế
                              </div>
                            )}
                            {replacementMaterials.map((item, idx) => (
                              <div
                                key={`replacement-${idx}`}
                                className="text-sm text-gray-900 border-b border-gray-100 pb-1 min-h-[32px] flex items-center"
                              >
                                {item.reality?.name || ''}
                              </div>
                            ))}
                            {replacementMaterials.length === 0 &&
                              (consumableMaterials.length > 0 ||
                                replacementMaterials.length > 0) && (
                                <div className="text-sm text-gray-400 border-b border-gray-100 pb-1 min-h-[32px] flex items-center italic">
                                  Không có
                                </div>
                              )}
                          </div>
                        </td>

                        {/* Reality Materials Unit */}
                        <td className="px-2 py-4 text-center align-top">
                          <div className="space-y-2">
                            {/* Empty header space for consumables */}
                            {(consumableMaterials.length > 0 ||
                              replacementMaterials.length > 0) && (
                              <div className="text-sm font-bold text-transparent bg-blue-500 border border-blue-600 rounded px-2 py-1 min-h-[32px]">
                                .
                              </div>
                            )}
                            {consumableMaterials.map((item, idx) => (
                              <div
                                key={`consumable-${idx}`}
                                className="text-sm text-gray-900 border-b border-gray-100 pb-1 min-h-[32px] flex items-center justify-center"
                              >
                                {item.reality?.unit || ''}
                              </div>
                            ))}
                            {consumableMaterials.length === 0 &&
                              (consumableMaterials.length > 0 ||
                                replacementMaterials.length > 0) && (
                                <div className="text-sm text-gray-400 border-b border-gray-100 pb-1 min-h-[32px]"></div>
                              )}

                            {/* Empty header space for replacements */}
                            {(consumableMaterials.length > 0 ||
                              replacementMaterials.length > 0) && (
                              <div className="text-sm font-bold text-transparent bg-green-500 border border-green-600 rounded px-2 py-1 min-h-[32px] mt-2">
                                .
                              </div>
                            )}
                            {replacementMaterials.map((item, idx) => (
                              <div
                                key={`replacement-${idx}`}
                                className="text-sm text-gray-900 border-b border-gray-100 pb-1 min-h-[32px] flex items-center justify-center"
                              >
                                {item.reality?.unit || ''}
                              </div>
                            ))}
                            {replacementMaterials.length === 0 &&
                              (consumableMaterials.length > 0 ||
                                replacementMaterials.length > 0) && (
                                <div className="text-sm text-gray-400 border-b border-gray-100 pb-1 min-h-[32px]"></div>
                              )}
                          </div>
                        </td>

                        {/* Reality Materials Quantity */}
                        <td className="px-2 py-4 text-center align-top">
                          <div className="space-y-2">
                            {/* Empty header space for consumables */}
                            {(consumableMaterials.length > 0 ||
                              replacementMaterials.length > 0) && (
                              <div className="text-sm font-bold text-transparent bg-blue-500 border border-blue-600 rounded px-2 py-1 min-h-[32px]">
                                .
                              </div>
                            )}
                            {consumableMaterials.map((item, idx) => (
                              <div
                                key={`consumable-${idx}`}
                                className="text-sm text-gray-900 border-b border-gray-100 pb-1 min-h-[32px] flex items-center justify-center"
                              >
                                {item.reality?.quantity || ''}
                              </div>
                            ))}
                            {consumableMaterials.length === 0 &&
                              (consumableMaterials.length > 0 ||
                                replacementMaterials.length > 0) && (
                                <div className="text-sm text-gray-400 border-b border-gray-100 pb-1 min-h-[32px]"></div>
                              )}

                            {/* Empty header space for replacements */}
                            {(consumableMaterials.length > 0 ||
                              replacementMaterials.length > 0) && (
                              <div className="text-sm font-bold text-transparent bg-green-500 border border-green-600 rounded px-2 py-1 min-h-[32px] mt-2">
                                .
                              </div>
                            )}
                            {replacementMaterials.map((item, idx) => (
                              <div
                                key={`replacement-${idx}`}
                                className="text-sm text-gray-900 border-b border-gray-100 pb-1 min-h-[32px] flex items-center justify-center"
                              >
                                {item.reality?.quantity || ''}
                              </div>
                            ))}
                            {replacementMaterials.length === 0 &&
                              (consumableMaterials.length > 0 ||
                                replacementMaterials.length > 0) && (
                                <div className="text-sm text-gray-400 border-b border-gray-100 pb-1 min-h-[32px]"></div>
                              )}
                          </div>
                        </td>

                        {/* Difference Column */}
                        <td className="px-2 py-4 text-center align-top">
                          <div className="space-y-2">
                            {/* Empty header space for consumables */}
                            {(consumableMaterials.length > 0 ||
                              replacementMaterials.length > 0) && (
                              <div className="text-sm font-bold text-transparent bg-blue-500 border border-blue-600 rounded px-2 py-1 min-h-[32px]">
                                .
                              </div>
                            )}
                            {consumableMaterials.map((item, idx) => {
                              const estimateQty = item.estimate?.quantity || 0;
                              const realityQty = item.reality?.quantity || 0;
                              const diff = estimateQty - realityQty;
                              const diffColor =
                                diff > 0
                                  ? 'text-green-600'
                                  : diff < 0
                                  ? 'text-orange-500'
                                  : 'text-gray-900';
                              return (
                                <div
                                  key={`consumable-${idx}`}
                                  className={`text-sm font-medium border-b border-gray-100 pb-1 min-h-[32px] flex items-center justify-center ${diffColor}`}
                                >
                                  {diff !== 0
                                    ? diff > 0
                                      ? `+${diff}`
                                      : diff
                                    : ''}
                                </div>
                              );
                            })}
                            {consumableMaterials.length === 0 &&
                              (consumableMaterials.length > 0 ||
                                replacementMaterials.length > 0) && (
                                <div className="text-sm text-gray-400 border-b border-gray-100 pb-1 min-h-[32px]"></div>
                              )}

                            {/* Empty header space for replacements */}
                            {(consumableMaterials.length > 0 ||
                              replacementMaterials.length > 0) && (
                              <div className="text-sm font-bold text-transparent bg-green-500 border border-green-600 rounded px-2 py-1 min-h-[32px] mt-2">
                                .
                              </div>
                            )}
                            {replacementMaterials.map((item, idx) => {
                              const estimateQty = item.estimate?.quantity || 0;
                              const realityQty = item.reality?.quantity || 0;
                              const diff = estimateQty - realityQty;
                              const diffColor =
                                diff > 0
                                  ? 'text-green-600'
                                  : diff < 0
                                  ? 'text-orange-500'
                                  : 'text-gray-900';
                              return (
                                <div
                                  key={`replacement-${idx}`}
                                  className={`text-sm font-medium border-b border-gray-100 pb-1 min-h-[32px] flex items-center justify-center ${diffColor}`}
                                >
                                  {diff !== 0
                                    ? diff > 0
                                      ? `+${diff}`
                                      : diff
                                    : ''}
                                </div>
                              );
                            })}
                            {replacementMaterials.length === 0 &&
                              (consumableMaterials.length > 0 ||
                                replacementMaterials.length > 0) && (
                                <div className="text-sm text-gray-400 border-b border-gray-100 pb-1 min-h-[32px]"></div>
                              )}
                          </div>
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
