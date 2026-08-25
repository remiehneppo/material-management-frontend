'use client';

import { useState, useEffect } from 'react';
import { userService } from '@/services';
import type { User } from '@/types/api';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  UserIcon,
  EnvelopeIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  XCircleIcon,
  CheckIcon,
  LockClosedIcon,
  KeyIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

// Icon Components
const SaveIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const EditIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const RefreshIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<User>>({});

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userService.getProfile();
      console.log('User profile response:', response);
      
      if (response.status && response.data) {
        setUser(response.data);
        setEditForm(response.data);
      } else {
        setError(response.message || 'Không thể tải thông tin người dùng');
      }
    } catch (err: unknown) {
      console.error('Error fetching user profile:', err);
      const errorMessage = err instanceof Error ? err.message : 'Không thể tải thông tin người dùng. Vui lòng thử lại.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      console.log('Submitting form data:', editForm);
      const response = await userService.updateProfile(editForm);
      console.log('Update profile response:', response);
      
      if (response.status && response.data) {
        console.log('Profile updated successfully:', response);
        setUser(response.data);
        setIsEditing(false);
        setError(null);
      } else if (response.status && !response.data) {
        // Handle case where update was successful but no data returned
        console.log('Profile updated successfully (no data returned)');
        // Refetch user profile to get updated data
        await fetchUserProfile();
        setIsEditing(false);
        setError(null);
      } else {
        console.error('Error updating profile:', response);
        setError(response.message || 'Không thể cập nhật thông tin');
      }
    } catch (err: unknown) {
      console.error('Error updating profile:', err);
      const errorMessage = err instanceof Error ? err.message : 'Không thể cập nhật thông tin. Vui lòng thử lại.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !user) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200"></div>
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-cyan-500 border-r-blue-500 absolute top-0 left-0"></div>
            </div>
            <p className="mt-6 text-gray-600 font-medium text-lg">Đang tải thông tin...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error && !user) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="text-center max-w-md">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mb-6">
              <XCircleIcon className="h-12 w-12 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent mb-3">
              Không thể tải thông tin
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={fetchUserProfile}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 font-medium shadow-lg hover:shadow-xl hover:scale-105 inline-flex items-center gap-2"
            >
              <RefreshIcon />
              Thử lại
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!user) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mb-6">
              <UserIcon className="h-12 w-12 text-gray-400" />
            </div>
            <p className="text-gray-600 text-lg font-medium">Không tìm thấy thông tin người dùng</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24 pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/40 shadow-2xl">
                  <UserIcon className="h-14 w-14 text-white drop-shadow-lg" />
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold mb-2 drop-shadow-md">{user.full_name}</h1>
                  <p className="text-white text-lg font-medium drop-shadow-md">@{user.username}</p>
                  <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-white/25 backdrop-blur-md rounded-full text-sm font-bold shadow-lg border border-white/30">
                    <div className="w-2.5 h-2.5 bg-green-300 rounded-full animate-pulse shadow-lg"></div>
                    Tài khoản hoạt động
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 rounded-2xl p-6 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                <XCircleIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-red-900 mb-1">Không thể cập nhật thông tin</h3>
                <p className="text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Profile Information Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-8 py-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                  Thông tin cá nhân
                </h2>
                <p className="text-gray-600 mt-1">Quản lý và cập nhật thông tin tài khoản của bạn</p>
              </div>
              
              <button
                onClick={() => {
                  setIsEditing(!isEditing);
                  if (isEditing) {
                    setEditForm(user);
                    setError(null);
                  }
                }}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 ${
                  isEditing 
                    ? 'bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700' 
                    : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600'
                }`}
              >
                {isEditing ? (
                  <>
                    <XCircleIcon className="h-5 w-5" />
                    Hủy chỉnh sửa
                  </>
                ) : (
                  <>
                    <EditIcon />
                    Chỉnh sửa
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-8">
            {isEditing ? (
              /* Edit Form */
              <form onSubmit={handleEditSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                      <UserIcon className="h-5 w-5 text-cyan-500" />
                      Tên đầy đủ
                    </label>
                    <input
                      type="text"
                      value={editForm.full_name || ''}
                      onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                      className="w-full text-gray-700 px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300 font-medium"
                      placeholder="Nhập tên đầy đủ"
                      required
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                      <BuildingOfficeIcon className="h-5 w-5 text-cyan-500" />
                      Chức vụ
                    </label>
                    <input
                      type="text"
                      value={editForm.workspace_role || ''}
                      onChange={(e) => setEditForm({ ...editForm, workspace_role: e.target.value })}
                      className="w-full text-gray-700 px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300 font-medium"
                      placeholder="Nhập chức vụ"
                      required
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                      <BuildingOfficeIcon className="h-5 w-5 text-cyan-500" />
                      Phòng ban
                    </label>
                    <input
                      type="text"
                      value={editForm.workspace || ''}
                      onChange={(e) => setEditForm({ ...editForm, workspace: e.target.value })}
                      className="w-full text-gray-700 px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300 font-medium"
                      placeholder="Nhập phòng ban"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setEditForm(user);
                      setError(null);
                    }}
                    className="px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-all duration-300 hover:scale-105"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <SaveIcon />
                        Lưu thay đổi
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              /* Display Mode */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 border border-blue-100 hover:shadow-md transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                        <EnvelopeIcon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-600 mb-1">📧 Email</p>
                        <p className="text-gray-900 font-medium break-all">{user.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-5 border border-emerald-100 hover:shadow-md transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                        <BuildingOfficeIcon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-600 mb-1">🏢 Phòng ban</p>
                        <p className="text-gray-900 font-medium">{user.workspace || 'Chưa cung cấp'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-100 hover:shadow-md transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                        <UserIcon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-600 mb-1">👔 Chức vụ</p>
                        <p className="text-gray-900 font-medium">{user.workspace_role}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-5 border border-purple-100 hover:shadow-md transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                        <CalendarIcon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-600 mb-1">📅 Ngày tạo</p>
                        <p className="text-gray-900 font-medium">
                          {new Date(user.created_at * 1000).toLocaleDateString('vi-VN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-5 border border-pink-100 hover:shadow-md transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center shadow-lg">
                        <CalendarIcon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-600 mb-1">🔄 Cập nhật lần cuối</p>
                        <p className="text-gray-900 font-medium">
                          {new Date(user.updated_at * 1000).toLocaleDateString('vi-VN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-5 border border-gray-200 hover:shadow-md transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-gray-500 to-slate-500 rounded-xl flex items-center justify-center shadow-lg">
                        <UserIcon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-600 mb-1">🆔 Tên đăng nhập</p>
                        <p className="text-gray-900 font-medium">@{user.username}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Change Password Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-50 to-red-50 px-8 py-6 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                <LockClosedIcon className="h-7 w-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  Đổi mật khẩu
                </h3>
                <p className="text-gray-600 font-medium mt-1">Cập nhật mật khẩu để bảo mật tài khoản của bạn</p>
              </div>
            </div>
          </div>
          
          <div className="p-8">
            <ChangePasswordForm />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function ChangePasswordForm() {
  const [formData, setFormData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.new_password !== formData.confirm_password) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    if (formData.new_password.length < 6) {
      setError('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const response = await userService.changePassword({
        old_password: formData.current_password,
        new_password: formData.new_password,
      });
      
      if (response.status) {
        setSuccess(true);
        setFormData({
          current_password: '',
          new_password: '',
          confirm_password: ''
        });
      } else {
        setError(response.message || 'Không thể đổi mật khẩu');
      }
    } catch (err: unknown) {
      console.error('Error changing password:', err);
      const errorMessage = err instanceof Error ? err.message : 'Không thể đổi mật khẩu. Vui lòng thử lại.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <div className="bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 rounded-xl p-4 shadow-md">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <XCircleIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-red-900 mb-1">Lỗi</h4>
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-100 border-2 border-green-200 rounded-xl p-4 shadow-md">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <CheckIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-green-900 mb-1">Thành công!</h4>
              <p className="text-green-800 text-sm">Mật khẩu của bạn đã được cập nhật</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
            <KeyIcon className="h-5 w-5 text-orange-500" />
            🔒 Mật khẩu hiện tại
          </label>
          <input
            type="password"
            value={formData.current_password}
            onChange={(e) => setFormData({ ...formData, current_password: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 font-medium"
            placeholder="Nhập mật khẩu hiện tại"
            required
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
            <ShieldCheckIcon className="h-5 w-5 text-orange-500" />
            🆕 Mật khẩu mới
          </label>
          <input
            type="password"
            value={formData.new_password}
            onChange={(e) => setFormData({ ...formData, new_password: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 font-medium"
            placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
            required
            minLength={6}
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
            <ShieldCheckIcon className="h-5 w-5 text-orange-500" />
            ✅ Xác nhận mật khẩu
          </label>
          <input
            type="password"
            value={formData.confirm_password}
            onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 font-medium"
            placeholder="Nhập lại mật khẩu mới"
            required
            minLength={6}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 px-6 rounded-xl hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] flex items-center justify-center gap-2 text-lg"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
            Đang đổi mật khẩu...
          </>
        ) : (
          <>
            <KeyIcon className="h-6 w-6" />
            Đổi mật khẩu
          </>
        )}
      </button>
    </form>
  );
}
