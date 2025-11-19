'use client';

import { useState, useEffect } from 'react';
import {
  materialsProfileService,
  maintenanceService,
  equipmentMachineryService,
} from '@/services';
import CreateEquipmentModal from './CreateEquipmentModal';
import type { Maintenance, EquipmentMachinery } from '@/types/api';
import { SECTORS } from '@/types/api';

interface CreateMaterialsProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// Icon Components
const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const AlertIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const FolderIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
  </svg>
);

const InfoIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default function CreateMaterialsProfileModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateMaterialsProfileModalProps) {
  const [formData, setFormData] = useState({
    maintenance_id: '',
    equipment_machinery_id: '',
    index_path: '',
    sector: '',
  });
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [equipments, setEquipments] = useState<EquipmentMachinery[]>([]);
  const [loadingMaintenances, setLoadingMaintenances] = useState(false);
  const [loadingEquipments, setLoadingEquipments] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCreateEquipmentModalOpen, setIsCreateEquipmentModalOpen] =
    useState(false);

  // Load maintenances on mount
  useEffect(() => {
    if (isOpen) {
      loadMaintenances();
    }
  }, [isOpen]);

  // Load equipments when sector changes
  useEffect(() => {
    if (formData.sector) {
      loadEquipments(formData.sector);
    } else {
      setEquipments([]);
    }
  }, [formData.sector]);

  const loadMaintenances = async () => {
    setLoadingMaintenances(true);
    try {
      const response = await maintenanceService.getAll();
      if (response.status && response.data) {
        setMaintenances(response.data);
      } else {
        setError('Không thể tải danh sách dự án');
      }
    } catch (err) {
      console.error('Error loading maintenances:', err);
      setError('Có lỗi xảy ra khi tải danh sách dự án');
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
      } else {
        setError('Không thể tải danh sách thiết bị');
      }
    } catch (err) {
      console.error('Error loading equipments:', err);
      setError('Có lỗi xảy ra khi tải danh sách thiết bị');
    } finally {
      setLoadingEquipments(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.maintenance_id) {
      setError('Vui lòng chọn dự án');
      return;
    }
    if (!formData.sector) {
      setError('Vui lòng chọn ngành');
      return;
    }
    if (!formData.equipment_machinery_id) {
      setError('Vui lòng chọn thiết bị');
      return;
    }
    if (!formData.index_path.trim()) {
      setError('Vui lòng nhập index path');
      return;
    }

    setCreating(true);

    try {
      const response = await materialsProfileService.create({
        maintenance_instance_id: formData.maintenance_id,
        equipment_machinery_id: formData.equipment_machinery_id,
        index_path: formData.index_path.trim(),
        sector: formData.sector,
        estimate: {}, // Empty estimate as per requirement
      });

      if (response.status) {
        // Success
        onSuccess();
        // Reset form
        setFormData({
          maintenance_id: '',
          equipment_machinery_id: '',
          index_path: '',
          sector: '',
        });
        onClose();
      } else {
        setError(response.message || 'Tạo hồ sơ vật tư thất bại');
      }
    } catch (err: unknown) {
      console.error('Error creating materials profile:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Có lỗi xảy ra khi tạo hồ sơ vật tư'
      );
    } finally {
      setCreating(false);
    }
  };

  const handleClose = () => {
    if (!creating && !loadingMaintenances && !loadingEquipments) {
      setFormData({
        maintenance_id: '',
        equipment_machinery_id: '',
        index_path: '',
        sector: '',
      });
      setError(null);
      onClose();
    }
  };

  const handleEquipmentCreated = (equipmentId: string, equipmentName: string) => {
    // Add the new equipment to the list
    setEquipments((prev) => [
      ...prev,
      { id: equipmentId, name: equipmentName, sector: formData.sector },
    ]);
    // Select the newly created equipment
    setFormData((prev) => ({ ...prev, equipment_machinery_id: equipmentId }));
  };

  if (!isOpen) return null;

  const selectedMaintenance = maintenances.find(
    (m) => m.id === formData.maintenance_id
  );

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
        <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden animate-slideUp">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 px-4 sm:px-6 py-6 sm:py-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border-2 border-white/30 flex-shrink-0">
                  <FolderIcon />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl sm:text-2xl font-bold text-white drop-shadow-md break-words">
                    Tạo hồ sơ vật tư mới
                  </h2>
                  <p className="text-white/90 text-sm mt-0.5">Thêm hồ sơ quản lý vật tư cho dự án</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                disabled={creating || loadingMaintenances || loadingEquipments}
                className="text-white/80 hover:text-white hover:bg-white/20 disabled:opacity-50 rounded-lg p-2 transition-all duration-300 flex-shrink-0 self-start sm:self-auto"
              >
                <CloseIcon />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
            <form onSubmit={handleSubmit} className="px-6 py-6">
              {/* Error Message */}
              {error && (
                <div className="mb-6 bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 rounded-xl p-4 shadow-md animate-shake">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                      <AlertIcon />
                    </div>
                    <div>
                      <h4 className="font-bold text-red-900 mb-1">Lỗi</h4>
                      <span className="text-sm text-red-700">{error}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-5">
                {/* Project/Maintenance Selection */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                    <span className="text-xl">📁</span>
                    Dự án <span className="text-red-500">*</span>
                  </label>
                  {loadingMaintenances ? (
                    <div className="flex items-center text-gray-500 text-sm px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-cyan-500 border-t-transparent mr-2"></div>
                      Đang tải dự án...
                    </div>
                  ) : (
                    <select
                      value={formData.maintenance_id}
                      onChange={(e) =>
                        handleInputChange('maintenance_id', e.target.value)
                      }
                      disabled={creating || loadingMaintenances}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 disabled:bg-gray-100 text-gray-900 font-medium transition-all duration-300"
                    >
                      <option value="">Chọn dự án</option>
                      {maintenances.map((maintenance) => (
                        <option key={maintenance.id} value={maintenance.id}>
                          {maintenance.project} - {maintenance.maintenance_tier} - Lần {maintenance.maintenance_number}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Display Maintenance Info */}
                {selectedMaintenance && (
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-5 shadow-md">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                        <InfoIcon />
                      </div>
                      <h4 className="font-bold text-blue-900 text-lg">Thông tin dự án</h4>
                    </div>
                    <div className="text-sm text-blue-800 space-y-2 ml-11">
                      <p className="flex items-center gap-2">
                        <span className="font-semibold min-w-[100px]">Mã dự án:</span>
                        <span className="font-medium">{selectedMaintenance.project_code}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="font-semibold min-w-[100px]">Cấp sửa chữa:</span>
                        <span className="font-medium">{selectedMaintenance.maintenance_tier}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="font-semibold min-w-[100px]">Lần sửa chữa:</span>
                        <span className="font-medium">{selectedMaintenance.maintenance_number}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="font-semibold min-w-[100px]">Năm:</span>
                        <span className="font-medium">{selectedMaintenance.year}</span>
                      </p>
                    </div>
                  </div>
                )}

                {/* Sector */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                    <span className="text-xl">🏭</span>
                    Ngành sửa chữa <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.sector}
                    onChange={(e) => {
                      handleInputChange('sector', e.target.value);
                      // Reset equipment selection when sector changes
                      setFormData((prev) => ({
                        ...prev,
                        sector: e.target.value,
                        equipment_machinery_id: '',
                      }));
                    }}
                    disabled={creating}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 disabled:bg-gray-100 text-gray-900 font-medium transition-all duration-300"
                  >
                    <option value="">Chọn ngành</option>
                    {Object.values(SECTORS).map((sector) => (
                      <option key={sector} value={sector}>
                        {sector}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Equipment Selection */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                    <span className="text-xl">⚙️</span>
                    Thiết bị <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      {loadingEquipments ? (
                        <div className="flex items-center text-gray-500 text-sm px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50">
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-cyan-500 border-t-transparent mr-2"></div>
                          Đang tải thiết bị...
                        </div>
                      ) : (
                        <select
                          value={formData.equipment_machinery_id}
                          onChange={(e) =>
                            handleInputChange('equipment_machinery_id', e.target.value)
                          }
                          disabled={
                            creating || !formData.sector || loadingEquipments
                          }
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 disabled:bg-gray-100 text-gray-900 font-medium transition-all duration-300"
                        >
                          <option value="">
                            {formData.sector
                              ? 'Chọn thiết bị'
                              : 'Vui lòng chọn ngành trước'}
                          </option>
                          {equipments.map((equipment) => (
                            <option key={equipment.id} value={equipment.id}>
                              {equipment.name}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsCreateEquipmentModalOpen(true)}
                      disabled={creating || !formData.sector || loadingEquipments}
                      className="px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 disabled:opacity-50 flex items-center gap-2 font-medium shadow-md hover:shadow-lg hover:scale-105 whitespace-nowrap"
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
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      <span>Thêm mới</span>
                    </button>
                  </div>
                  {formData.sector && equipments.length === 0 && !loadingEquipments && (
                    <p className="text-sm text-amber-600 mt-2 flex items-center gap-1 bg-amber-50 px-3 py-2 rounded-lg">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Chưa có thiết bị nào cho ngành này. Vui lòng thêm mới.
                    </p>
                  )}
                </div>

                {/* Index Path */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                    <span className="text-xl">🔢</span>
                    Index Path <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.index_path}
                    onChange={(e) =>
                      handleInputChange('index_path', e.target.value)
                    }
                    placeholder="Nhập index path..."
                    disabled={creating}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 disabled:bg-gray-100 text-gray-900 font-medium placeholder:text-gray-400 placeholder:font-normal transition-all duration-300"
                  />
                  <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Ví dụ: 1.2.3 hoặc A.B.C
                  </p>
                </div>

                {/* Note about materials */}
                <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-xl p-5 shadow-md">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="text-sm text-amber-900">
                      <p className="font-bold mb-2">💡 Lưu ý quan trọng</p>
                      <p className="leading-relaxed">
                        Hồ sơ vật tư sẽ được tạo với danh sách vật tư trống. Bạn có thể cập nhật vật tư sau bằng cách upload file dự toán.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 flex flex-col sm:flex-row justify-end gap-3 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={creating || loadingMaintenances || loadingEquipments}
              className="px-5 py-2.5 border-2 border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-white transition-all duration-300 disabled:opacity-50 hover:scale-105"
            >
              Hủy
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={creating || loadingMaintenances || loadingEquipments}
              className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl hover:scale-105"
            >
              {creating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>Đang tạo...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Tạo hồ sơ</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Create Equipment Modal */}
      <CreateEquipmentModal
        isOpen={isCreateEquipmentModalOpen}
        onClose={() => setIsCreateEquipmentModalOpen(false)}
        onSuccess={handleEquipmentCreated}
        preSelectedSector={formData.sector}
      />
    </>
  );
}
