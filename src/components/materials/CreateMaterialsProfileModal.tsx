'use client';

import { useState, useEffect } from 'react';
import {
  materialsProfileService,
  maintenanceService,
  equipmentMachineryService,
} from '@/services';
import CreateEquipmentModal from './CreateEquipmentModal';
import type { Maintenance, EquipmentMachinery } from '@/types/api';

// Define sectors
const SECTORS = {
  MECHANICAL: 'Cơ khí',
  WEAPONS: 'Vũ khí',
  HULL: 'Vỏ Tàu',
  DOCK: 'Đà đốc',
  ELECTRONICS: 'Điện tàu',
  PROPULSION: 'Động lực',
  VALVE_PIPE: 'Van ống',
  ELECTRONICS_TACTICAL: 'KT-ĐT',
  DECORATIVE: 'Trang trí',
  ELECTRICAL: 'Cơ điện',
} as const;

interface CreateMaterialsProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

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
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">
              Tạo hồ sơ vật tư mới
            </h2>
            <button
              onClick={handleClose}
              disabled={creating || loadingMaintenances || loadingEquipments}
              className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              <svg
                className="w-6 h-6"
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
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="px-6 py-4">
            {/* Error Message */}
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-red-500 mr-2"
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
                  <span className="text-sm text-red-700">{error}</span>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {/* Project/Maintenance Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dự án <span className="text-red-500">*</span>
                </label>
                {loadingMaintenances ? (
                  <div className="flex items-center text-gray-500 text-sm">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cyan-500 mr-2"></div>
                    Đang tải dự án...
                  </div>
                ) : (
                  <select
                    value={formData.maintenance_id}
                    onChange={(e) =>
                      handleInputChange('maintenance_id', e.target.value)
                    }
                    disabled={creating || loadingMaintenances}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:bg-gray-100 text-gray-900 font-medium"
                  >
                    <option value="">Chọn dự án</option>
                    {maintenances.map((maintenance) => (
                      <option key={maintenance.id} value={maintenance.id}>
                        {maintenance.project} - {maintenance.maintenance_tier} -{' '}
                        Lần {maintenance.maintenance_number}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Display Maintenance Info */}
              {selectedMaintenance && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="text-sm text-blue-800 space-y-1">
                    <p>
                      <span className="font-medium">Mã dự án:</span>{' '}
                      {selectedMaintenance.project_code}
                    </p>
                    <p>
                      <span className="font-medium">Cấp sửa chữa:</span>{' '}
                      {selectedMaintenance.maintenance_tier}
                    </p>
                    <p>
                      <span className="font-medium">Lần sửa chữa:</span>{' '}
                      {selectedMaintenance.maintenance_number}
                    </p>
                    <p>
                      <span className="font-medium">Năm:</span>{' '}
                      {selectedMaintenance.year}
                    </p>
                  </div>
                </div>
              )}

              {/* Sector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:bg-gray-100 text-gray-900 font-medium"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thiết bị <span className="text-red-500">*</span>
                </label>
                <div className="flex space-x-2">
                  <div className="flex-1">
                    {loadingEquipments ? (
                      <div className="flex items-center text-gray-500 text-sm px-3 py-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cyan-500 mr-2"></div>
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:bg-gray-100 text-gray-900 font-medium"
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
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center space-x-2"
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
                  <p className="text-sm text-gray-500 mt-1">
                    Chưa có thiết bị nào cho ngành này. Vui lòng thêm mới.
                  </p>
                )}
              </div>

              {/* Index Path */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:bg-gray-100 text-gray-900 font-medium placeholder:text-gray-400 placeholder:font-normal"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Ví dụ: 1.2.3 hoặc A.B.C
                </p>
              </div>

              {/* Note about materials */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-start">
                  <svg
                    className="w-5 h-5 text-yellow-600 mr-2 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium mb-1">Lưu ý:</p>
                    <p>
                      Hồ sơ vật tư sẽ được tạo với danh sách vật tư trống. Bạn
                      có thể cập nhật vật tư sau bằng cách upload file dự toán.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={creating || loadingMaintenances || loadingEquipments}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={creating || loadingMaintenances || loadingEquipments}
              className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              {creating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Đang tạo...</span>
                </>
              ) : (
                <span>Tạo hồ sơ</span>
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
