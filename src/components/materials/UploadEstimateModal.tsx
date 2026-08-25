'use client';

import React, { useState, useEffect } from 'react';
import { materialsProfileService } from '@/services/materialsProfileService';
import { maintenanceService } from '@/services';
import { SECTORS, Maintenance } from '@/types/api';

interface UploadEstimateModalProps {
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

const UploadIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

const InfoIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default function UploadEstimateModal({
  isOpen,
  onClose,
  onSuccess,
}: UploadEstimateModalProps) {
  const [formData, setFormData] = useState({
    maintenance_id: '',
    sheet_name: '',
    sector: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [loadingMaintenances, setLoadingMaintenances] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] =
    useState<Maintenance | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadMaintenances();
    }
  }, [isOpen]);

  const loadMaintenances = async () => {
    setLoadingMaintenances(true);
    try {
      const response = await maintenanceService.getAll();
      if (response.status && response.data) {
        setMaintenances(response.data);
      }
    } catch (err) {
      console.error('Error loading maintenances:', err);
      setError('Không thể tải danh sách dự án');
    } finally {
      setLoadingMaintenances(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleMaintenanceChange = (maintenanceId: string) => {
    const maintenance = maintenances.find((m) => m.id === maintenanceId);
    setSelectedMaintenance(maintenance || null);
    setFormData((prev) => ({
      ...prev,
      maintenance_id: maintenanceId,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      // Validate file type
      if (!selectedFile.name.endsWith('.xlsx')) {
        setError('Chỉ chấp nhận tệp Excel định dạng .xlsx');
        return;
      }

      setFile(selectedFile);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!file) {
      setError('Vui lòng chọn tệp Excel cần tải lên');
      return;
    }

    if (!formData.maintenance_id || !formData.sheet_name || !formData.sector) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (!selectedMaintenance) {
      setError('Vui lòng chọn dự án');
      return;
    }

    try {
      setUploading(true);
      setError(null);

      // Build request data with maintenance instance id
      const uploadData = {
        maintenance_instance_id: selectedMaintenance.id,
        sheet_name: formData.sheet_name,
        sector: formData.sector,
      };

      await materialsProfileService.uploadEstimate(file, uploadData);

      // Success
      alert('Đã tải tệp dự toán lên hệ thống.');
      handleClose();
      onSuccess();
    } catch (err) {
      console.error('Upload failed:', err);
      setError('Không thể tải tệp dự toán lên. Vui lòng kiểm tra tệp và thông tin đã nhập.');
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    if (!uploading) {
      setFormData({
        maintenance_id: '',
        sheet_name: '',
        sector: '',
      });
      setFile(null);
      setError(null);
      setSelectedMaintenance(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 animate-fadeIn">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      ></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col animate-slideUp">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 px-4 sm:px-6 py-4 sm:py-6 rounded-t-2xl flex-shrink-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border-2 border-white/30 flex-shrink-0">
                  <UploadIcon />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl sm:text-2xl font-bold text-white drop-shadow-md break-words">
                    Tải tệp dự toán
                  </h3>
                  <p className="text-white/90 text-sm mt-0.5">Nhập dữ liệu dự toán từ tệp Excel</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                disabled={uploading}
                className="text-white/80 hover:text-white hover:bg-white/20 disabled:opacity-50 rounded-lg p-2 transition-all duration-300 flex-shrink-0 self-start sm:self-auto"
              >
                <CloseIcon />
              </button>
            </div>
          </div>

          {/* Body - Scrollable */}
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
            <div className="overflow-y-auto flex-1 p-6">
            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 rounded-xl p-4 shadow-md animate-shake">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <AlertIcon />
                  </div>
                  <div>
                    <h4 className="font-bold text-red-900 mb-1">Lỗi</h4>
                    <span className="text-red-700 text-sm">{error}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-5">
              {/* File Upload */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                  <span className="text-xl">📄</span>
                  Tệp Excel <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center">
                  <label className="flex-1 flex items-center justify-center px-6 py-8 border-3 border-dashed border-gray-300 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 cursor-pointer transition-all duration-300 group">
                    <div className="text-center">
                      <div className="mx-auto w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <svg
                          className="h-10 w-10 text-indigo-500"
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
                      </div>
                      <p className="mt-2 text-sm font-medium text-gray-700">
                        {file ? (
                          <span className="text-indigo-600 font-bold">✓ {file.name}</span>
                        ) : (
                          'Chọn tệp hoặc kéo thả vào đây'
                        )}
                      </p>
                      <p className="text-xs text-gray-500 mt-2 flex items-center justify-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Chỉ chấp nhận tệp .xlsx
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept=".xlsx"
                      onChange={handleFileChange}
                      disabled={uploading}
                    />
                  </label>
                </div>
              </div>

              {/* Sheet Name */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                  <span className="text-xl">📊</span>
                  Tên trang tính <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.sheet_name}
                  onChange={(e) =>
                    handleInputChange('sheet_name', e.target.value)
                  }
                  placeholder="Nhập tên trang tính trong tệp Excel..."
                  disabled={uploading}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 text-gray-900 font-medium placeholder:text-gray-400 placeholder:font-normal transition-all duration-300"
                />
              </div>
              {/* Maintenance (Project) Selection */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                  <span className="text-xl">📁</span>
                  Chọn dự án <span className="text-red-500">*</span>
                </label>
                {loadingMaintenances ? (
                  <div className="flex items-center text-gray-500 text-sm px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-indigo-500 border-t-transparent mr-2"></div>
                    Đang tải danh sách dự án...
                  </div>
                ) : (
                  <select
                    value={formData.maintenance_id}
                    onChange={(e) => handleMaintenanceChange(e.target.value)}
                    disabled={uploading}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 text-gray-900 font-medium transition-all duration-300"
                  >
                    <option value="">-- Chọn dự án --</option>
                    {maintenances.map((maintenance) => (
                      <option key={maintenance.id} value={maintenance.id}>
                        {maintenance.project} - {maintenance.maintenance_tier} -
                        Lần {maintenance.maintenance_number} ({maintenance.year})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Display selected maintenance info */}
              {selectedMaintenance && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-5 shadow-md">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                      <InfoIcon />
                    </div>
                    <h4 className="font-bold text-blue-900 text-lg">Thông tin dự án</h4>
                  </div>
                  <div className="text-sm text-blue-800 space-y-2 ml-11">
                    <p className="flex items-center gap-2">
                      <span className="font-semibold min-w-[100px]">Dự án:</span>
                      <span className="font-medium">{selectedMaintenance.project}</span>
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
                  Ngành <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.sector}
                  onChange={(e) => handleInputChange('sector', e.target.value)}
                  disabled={uploading}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 text-gray-900 font-medium transition-all duration-300"
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

            </div>

            {/* Footer - Fixed at bottom */}
            <div className="flex-shrink-0 flex flex-col sm:flex-row justify-end gap-3 px-6 py-4 border-t-2 border-gray-200 bg-gray-50">
              <button
                type="button"
                onClick={handleClose}
                disabled={uploading}
                className="px-5 py-2.5 border-2 border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={uploading}
                className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl hover:scale-105"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Đang tải lên...</span>
                  </>
                ) : (
                  <>
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
                    <span>Tải lên</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
