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
        setError('Chỉ chấp nhận file Excel (.xlsx)');
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
      setError('Vui lòng chọn file để upload');
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
      alert('Upload file dự toán thành công!');
      handleClose();
      onSuccess();
    } catch (err) {
      console.error('Upload failed:', err);
      setError('Upload thất bại. Vui lòng kiểm tra lại file và thông tin.');
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
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
      ></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">
              Upload File Dự Toán
            </h3>
            <button
              onClick={handleClose}
              disabled={uploading}
              className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
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

          {/* Body */}
          <form onSubmit={handleSubmit} className="p-6">
            {/* Error Message */}
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
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
                  <span className="text-red-700 text-sm">{error}</span>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  File Excel <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center space-x-4">
                  <label className="flex-1 flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-cyan-500 cursor-pointer transition-colors">
                    <div className="text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
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
                      <p className="mt-2 text-sm text-gray-600">
                        {file ? file.name : 'Chọn file hoặc kéo thả vào đây'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Định dạng: .xlsx
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên Sheet <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.sheet_name}
                  onChange={(e) =>
                    handleInputChange('sheet_name', e.target.value)
                  }
                  placeholder="Nhập tên sheet trong file Excel..."
                  disabled={uploading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:bg-gray-100 text-gray-900 font-medium placeholder:text-gray-400 placeholder:font-normal"
                />
              </div>
              {/* Maintenance (Project) Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chọn dự án <span className="text-red-500">*</span>
                </label>
                {loadingMaintenances ? (
                  <div className="flex items-center text-gray-500 text-sm px-3 py-2 border border-gray-300 rounded-lg">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cyan-500 mr-2"></div>
                    Đang tải danh sách dự án...
                  </div>
                ) : (
                  <select
                    value={formData.maintenance_id}
                    onChange={(e) => handleMaintenanceChange(e.target.value)}
                    disabled={uploading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:bg-gray-100 text-gray-900 font-medium"
                  >
                    <option value="">-- Chọn dự án --</option>
                    {maintenances.map((maintenance) => (
                      <option key={maintenance.id} value={maintenance.id}>
                        {maintenance.project} - {maintenance.maintenance_tier} -
                        Lần {maintenance.maintenance_number} ({maintenance.year}
                        )
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Display selected maintenance info */}
              {selectedMaintenance && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    <span className="font-semibold">Dự án:</span>{' '}
                    {selectedMaintenance.project}
                  </p>
                  <p className="text-sm text-blue-800">
                    <span className="font-semibold">Cấp sửa chữa:</span>{' '}
                    {selectedMaintenance.maintenance_tier}
                  </p>
                  <p className="text-sm text-blue-800">
                    <span className="font-semibold">Lần sửa chữa:</span>{' '}
                    {selectedMaintenance.maintenance_number}
                  </p>
                  <p className="text-sm text-blue-800">
                    <span className="font-semibold">Năm:</span>{' '}
                    {selectedMaintenance.year}
                  </p>
                </div>
              )}

              {/* Sector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngành <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.sector}
                  onChange={(e) => handleInputChange('sector', e.target.value)}
                  disabled={uploading}
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

            {/* Footer */}
            <div className="flex justify-end space-x-4 mt-6 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleClose}
                disabled={uploading}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={uploading}
                className="px-6 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {uploading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Đang upload...</span>
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
                    <span>Upload</span>
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
