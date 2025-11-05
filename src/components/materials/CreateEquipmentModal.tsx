'use client';

import { useState } from 'react';
import { equipmentMachineryService } from '@/services';

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

interface CreateEquipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (equipmentId: string, equipmentName: string) => void;
  preSelectedSector?: string;
}

export default function CreateEquipmentModal({
  isOpen,
  onClose,
  onSuccess,
  preSelectedSector,
}: CreateEquipmentModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    sector: preSelectedSector || '',
  });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.name.trim()) {
      setError('Vui lòng nhập tên thiết bị');
      return;
    }
    if (!formData.sector) {
      setError('Vui lòng chọn ngành');
      return;
    }

    setCreating(true);

    try {
      const response = await equipmentMachineryService.create({
        name: formData.name.trim(),
        sector: formData.sector,
      });

      if (response.status && response.data) {
        // Success callback with the new equipment ID
        onSuccess(response.data, formData.name.trim());
        // Reset form
        setFormData({ name: '', sector: preSelectedSector || '' });
        onClose();
      } else {
        setError(response.message || 'Tạo thiết bị thất bại');
      }
    } catch (err: unknown) {
      console.error('Error creating equipment:', err);
      setError(
        err instanceof Error ? err.message : 'Có lỗi xảy ra khi tạo thiết bị'
      );
    } finally {
      setCreating(false);
    }
  };

  const handleClose = () => {
    if (!creating) {
      setFormData({ name: '', sector: preSelectedSector || '' });
      setError(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            Thêm thiết bị mới
          </h2>
          <button
            onClick={handleClose}
            disabled={creating}
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
            {/* Equipment Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên thiết bị <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Nhập tên thiết bị..."
                disabled={creating}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:bg-gray-100 text-gray-900 font-medium placeholder:text-gray-400 placeholder:font-normal"
              />
            </div>

            {/* Sector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngành <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.sector}
                onChange={(e) => handleInputChange('sector', e.target.value)}
                disabled={creating || !!preSelectedSector}
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
          </div>
        </form>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t border-gray-200">
          <button
            type="button"
            onClick={handleClose}
            disabled={creating}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={creating}
            className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors disabled:opacity-50 flex items-center space-x-2"
          >
            {creating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Đang tạo...</span>
              </>
            ) : (
              <span>Tạo thiết bị</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
