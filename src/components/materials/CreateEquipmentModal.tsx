'use client';

import { useState } from 'react';
import { equipmentMachineryService } from '@/services';
import { SECTORS } from '@/types/api';

interface CreateEquipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (equipmentId: string, equipmentName: string) => void;
  preSelectedSector?: string;
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

const ToolIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border-2 border-white/30">
                <ToolIcon />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white drop-shadow-md">
                  Thêm thiết bị mới
                </h2>
                <p className="text-white/90 text-sm mt-0.5">Tạo thiết bị cho ngành sửa chữa</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={creating}
              className="text-white/80 hover:text-white hover:bg-white/20 disabled:opacity-50 rounded-lg p-2 transition-all duration-300"
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        {/* Content */}
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
            {/* Equipment Name */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                <span className="text-xl">🔧</span>
                Tên thiết bị <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Nhập tên thiết bị..."
                disabled={creating}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-100 text-gray-900 font-medium placeholder:text-gray-400 placeholder:font-normal transition-all duration-300"
              />
            </div>

            {/* Sector */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                <span className="text-xl">🏭</span>
                Ngành <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.sector}
                onChange={(e) => handleInputChange('sector', e.target.value)}
                disabled={creating || !!preSelectedSector}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-100 text-gray-900 font-medium transition-all duration-300"
              >
                <option value="">Chọn ngành</option>
                {Object.values(SECTORS).map((sector) => (
                  <option key={sector} value={sector}>
                    {sector}
                  </option>
                ))}
              </select>
              {preSelectedSector && (
                <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Ngành đã được chọn trước
                </p>
              )}
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 flex flex-col sm:flex-row justify-end gap-3 border-t border-gray-200">
          <button
            type="button"
            onClick={handleClose}
            disabled={creating}
            className="px-5 py-2.5 border-2 border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-white transition-all duration-300 disabled:opacity-50 hover:scale-105"
          >
            Hủy
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={creating}
            className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl hover:scale-105"
          >
            {creating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span>Đang tạo...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Tạo thiết bị</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
