'use client';

import React, { useState } from 'react';
import { maintenanceService } from '@/services';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Tạo dự án mới</h2>
          <button
            onClick={handleClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {/* Project Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên dự án <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.project}
                onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                placeholder="Nhập tên dự án..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-900"
                disabled={loading}
              />
            </div>

            {/* Project Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mã hiệu <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.project_code}
                onChange={(e) => setFormData({ ...formData, project_code: e.target.value })}
                placeholder="Nhập mã hiệu dự án..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-900"
                disabled={loading}
              />
            </div>

            {/* Maintenance Tier */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cấp dự án <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.maintenance_tier}
                onChange={(e) => setFormData({ ...formData, maintenance_tier: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-900"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lần thứ
              </label>
              <input
                type="text"
                value={formData.maintenance_number}
                onChange={(e) => setFormData({ ...formData, maintenance_number: e.target.value })}
                placeholder="Nhập lần thứ (VD: 1, 2, 3...)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-900"
                disabled={loading}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-4 mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 disabled:opacity-50 flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Đang tạo...</span>
                </>
              ) : (
                <span>Tạo dự án</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
