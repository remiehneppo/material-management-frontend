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
  PencilIcon
} from '@heroicons/react/24/outline';

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
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải thông tin người dùng';
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
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi cập nhật thông tin';
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
            <p className="mt-4 text-gray-600">Đang tải thông tin...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error && !user) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <XCircleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Có lỗi xảy ra</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={fetchUserProfile}
              className="bg-cyan-500 text-white px-4 py-2 rounded-lg hover:bg-cyan-600 transition-colors"
            >
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
            <UserIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Không tìm thấy thông tin người dùng</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Thông tin cá nhân</h1>
          <p className="text-gray-600 mt-2">Quản lý thông tin tài khoản của bạn</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <XCircleIcon className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <p className="text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Card Header */}
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center">
                  <UserIcon className="h-6 w-6 text-cyan-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{user.full_name}</h2>
                  <p className="text-gray-500">@{user.username}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {/* {user.is_active ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircleIcon className="h-3 w-3 mr-1" />
                    Hoạt động
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <XCircleIcon className="h-3 w-3 mr-1" />
                    Không hoạt động
                  </span>
                )} */}
                
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  <PencilIcon className="h-4 w-4 mr-2" />
                  {isEditing ? 'Hủy' : 'Chỉnh sửa'}
                </button>
              </div>
            </div>
          </div>

          {/* Card Body */}
          <div className="px-6 py-6">
            {isEditing ? (
              /* Edit Form */
              <form onSubmit={handleEditSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên đầy đủ
                    </label>
                    <input
                      type="text"
                      value={editForm.full_name || ''}
                      onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                      className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Chức vụ
                    </label>
                    <input
                      type="text"
                      value={editForm.workspace_role || ''}
                      onChange={(e) => setEditForm({ ...editForm, workspace_role: e.target.value })}
                      className="w-full text-gray-700 text-gray-700 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      value={editForm.phone || ''}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    />
                  </div> */}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phòng ban
                    </label>
                    <input
                      type="text"
                      value={editForm.workspace || ''}
                      onChange={(e) => setEditForm({ ...editForm, workspace: e.target.value })}
                      className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setEditForm(user);
                      setError(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </button>
                </div>
              </form>
            ) : (
              /* Display Mode */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-gray-900">{user.email}</p>
                    </div>
                  </div>

                  {/* <div className="flex items-center space-x-3">
                    <PhoneIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Số điện thoại</p>
                      <p className="text-gray-900">{user.phone || 'Chưa cung cấp'}</p>
                    </div>
                  </div> */}

                  <div className="flex items-center space-x-3">
                    <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Phòng ban</p>
                      <p className="text-gray-900">{user.workspace || 'Chưa cung cấp'}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Chức vụ</p>
                      <p className="text-gray-900">{user.workspace_role}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Ngày tạo</p>
                      <p className="text-gray-900">
                        {new Date(user.created_at * 1000).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Cập nhật lần cuối</p>
                      <p className="text-gray-900">
                        {new Date(user.updated_at * 1000).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Change Password Section */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200 px-6 py-4">
            <h3 className="text-lg font-semibold text-gray-900">Đổi mật khẩu</h3>
            <p className="text-gray-600 text-sm mt-1">Cập nhật mật khẩu để bảo mật tài khoản</p>
          </div>
          
          <div className="px-6 py-6">
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
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi đổi mật khẩu';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-green-800 text-sm">Đổi mật khẩu thành công!</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Mật khẩu hiện tại
        </label>
        <input
          type="password"
          value={formData.current_password}
          onChange={(e) => setFormData({ ...formData, current_password: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Mật khẩu mới
        </label>
        <input
          type="password"
          value={formData.new_password}
          onChange={(e) => setFormData({ ...formData, new_password: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          required
          minLength={6}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Xác nhận mật khẩu mới
        </label>
        <input
          type="password"
          value={formData.confirm_password}
          onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          required
          minLength={6}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-cyan-500 text-white py-2 px-4 rounded-lg hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Đang đổi mật khẩu...' : 'Đổi mật khẩu'}
      </button>
    </form>
  );
}