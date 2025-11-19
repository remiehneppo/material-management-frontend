'use client';

import React, { useState } from 'react';
import { maintenanceService } from '@/services';

interface CreateProjectModalProps {
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

const ProjectIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const SaveIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

export default function CreateProjectModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateProjectModalProps) {
  const [formData, setFormData] = useState({
    project: '',
    project_code: '',
    maintenance_tier: '',
    maintenance_number: '1',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.project.trim()) {
      setError('Vui lòng nhập tên dự án');
      return;
    }
    if (!formData.project_code.trim()) {
      setError('Vui lòng nhập mã hiệu dự án');
      return;
    }
    if (!formData.maintenance_tier) {
      setError('Vui lòng chọn cấp dự án');
      return;
    }

    try {
      setLoading(true);
      const response = await maintenanceService.create(formData);
      
      if (response.status) {
        alert('Tạo dự án thành công!');
        // Reset form
        setFormData({
          project: '',
          project_code: '',
          maintenance_tier: '',
          maintenance_number: '1',
        });
        onSuccess();
        onClose();
      } else {
        setError(response.message || 'Không thể tạo dự án');
      }
    } catch (err) {
      console.error('Error creating project:', err);
      setError('Đã xảy ra lỗi khi tạo dự án');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        project: '',
        project_code: '',
        maintenance_tier: '',
        maintenance_number: '1',
      });
      setError(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-slideUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full -mr-20 -mt-20"></div>
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                <ProjectIcon />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl sm:text-2xl font-bold break-words">Tạo dự án mới</h2>
                <p className="text-white/80 text-sm mt-1">Thêm dự án vào hệ thống</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={loading}
              className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-all duration-300 disabled:opacity-50 flex-shrink-0 self-start sm:self-auto"
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 overflow-y-auto flex-1">
          {error && (
            <div className="mb-6 bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 rounded-xl p-4 animate-shake">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <AlertIcon />
                </div>
                <div>
                  <h4 className="font-bold text-red-900 mb-1">Lỗi</h4>
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {/* Project Name */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                🏗️ Tên dự án <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.project}
                onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                placeholder="Nhập tên dự án..."
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-gray-900 font-medium transition-all duration-300 hover:border-cyan-400"
                disabled={loading}
              />
            </div>

            {/* Project Code */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                🔖 Mã hiệu <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.project_code}
                onChange={(e) => setFormData({ ...formData, project_code: e.target.value })}
                placeholder="Nhập mã hiệu dự án..."
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-gray-900 font-medium transition-all duration-300 hover:border-cyan-400"
                disabled={loading}
              />
            </div>

            {/* Maintenance Tier */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                📊 Cấp dự án <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.maintenance_tier}
                onChange={(e) => setFormData({ ...formData, maintenance_tier: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-gray-900 font-medium transition-all duration-300 hover:border-cyan-400 cursor-pointer"
                disabled={loading}
              >
                <option value="">Chọn cấp dự án...</option>
                <option value="SCCĐ">SCCĐ</option>
                <option value="SCCN">SCCN</option>
                <option value="SCCV">SCCV</option>
              </select>
            </div>

            {/* Maintenance Number */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                🔢 Lần thứ
              </label>
              <input
                type="text"
                value={formData.maintenance_number}
                onChange={(e) => setFormData({ ...formData, maintenance_number: e.target.value })}
                placeholder="Nhập lần thứ (VD: 1, 2, 3...)"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-gray-900 font-medium transition-all duration-300 hover:border-cyan-400"
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-2">💡 Mặc định là lần thứ 1</p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8 pt-6 border-t-2 border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-bold shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="relative">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  </div>
                  <span>Đang tạo...</span>
                </>
              ) : (
                <>
                  <SaveIcon />
                  <span>Tạo dự án</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
