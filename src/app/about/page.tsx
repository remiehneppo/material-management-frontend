"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import Header from "@/components/layout/Header";
import { 
  UserGroupIcon, 
  BookOpenIcon,
  CodeBracketIcon,
  RocketLaunchIcon
} from "@heroicons/react/24/outline";

export default function AboutPage() {
  return (
    <DashboardLayout>
      <Header title="GIỚI THIỆU" />
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto space-y-6">

        {/* Project Info */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <CodeBracketIcon className="w-8 h-8 text-cyan-600" />
            <h2 className="text-2xl font-bold text-gray-900">Thông tin dự án</h2>
          </div>
          <div className="space-y-4 text-gray-700">
            <div className="flex items-start">
              <span className="font-semibold min-w-[140px]">Tên dự án:</span>
              <span>Hệ thống quản lý vật tư</span>
            </div>
            <div className="flex items-start">
              <span className="font-semibold min-w-[140px]">Phiên bản:</span>
              <span>0.1.0</span>
            </div>
            <div className="flex items-start">
              <span className="font-semibold min-w-[140px]">Công nghệ:</span>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">Next.js 15</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">React 19</span>
                <span className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-sm font-medium">TypeScript</span>
                <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium">Tailwind CSS</span>
              </div>
            </div>
            <div className="flex items-start">
              <span className="font-semibold min-w-[140px]">Mô tả:</span>
              <span>Hệ thống quản lý vật tư, dự án, và yêu cầu vật tư cho các dự án sửa chữa. Giúp tối ưu hóa quy trình quản lý và theo dõi vật tư một cách hiệu quả.</span>
            </div>
          </div>
        </div>

        {/* Author Info */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <UserGroupIcon className="w-8 h-8 text-cyan-600" />
            <h2 className="text-2xl font-bold text-gray-900">Tác giả</h2>
          </div>
          <div className="space-y-4 text-gray-700">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                TBC
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">BaoTran</h3>
                <p className="text-gray-600">Developer</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="space-y-2">
                <p className="text-gray-600 font-semibold mb-3">GitHub Repositories:</p>
                <div className="flex items-center gap-2 ml-4">
                  <span className="text-gray-600">Backend:</span>
                  <a 
                    href="https://github.com/remiehneppo/material-management" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-cyan-600 hover:text-cyan-700 transition-colors font-medium hover:underline flex items-center gap-1"
                  >
                    material-management
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <span className="text-gray-600">Frontend:</span>
                  <a 
                    href="https://github.com/remiehneppo/material-management-frontend" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-cyan-600 hover:text-cyan-700 transition-colors font-medium hover:underline flex items-center gap-1"
                  >
                    material-management-frontend
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Guide */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <BookOpenIcon className="w-8 h-8 text-cyan-600" />
            <h2 className="text-2xl font-bold text-gray-900">Hướng dẫn sử dụng</h2>
          </div>
          <div className="space-y-6">
            {/* Tổng quan */}
            <div className="border-l-4 border-cyan-500 pl-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">1. Tổng quan</h3>
              <p className="text-gray-700">
                Trang chủ hiển thị thống kê tổng quan về hệ thống, bao gồm số lượng dự án, vật tư và yêu cầu đang hoạt động.
              </p>
            </div>

            {/* Dự án */}
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">2. Quản lý Dự án</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Xem danh sách tất cả các dự án đang triển khai</li>
                <li>Tạo dự án mới với thông tin chi tiết</li>
                <li>Cập nhật trạng thái và tiến độ dự án</li>
                <li>Theo dõi ngân sách và chi phí</li>
              </ul>
            </div>

            {/* Vật tư */}
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">3. Quản lý Vật tư</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Xem danh sách vật tư có sẵn trong kho</li>
                <li>Thêm mới vật tư với thông tin chi tiết</li>
                <li>Cập nhật số lượng tồn kho</li>
                <li>Nhập dự trù vật tư từ tệp Excel</li>
                <li>Quản lý thiết bị và máy móc</li>
              </ul>
            </div>

            {/* Yêu cầu vật tư */}
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">4. Yêu cầu vật tư</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Tạo yêu cầu vật tư mới cho dự án</li>
                <li>Theo dõi trạng thái yêu cầu (Chờ ban hành, Đã ban hành, Đã hủy)</li>
                <li>Xem chi tiết và lịch sử yêu cầu</li>
                <li>Ban hành hoặc hủy yêu cầu</li>
              </ul>
            </div>

            {/* Thông tin cá nhân */}
            <div className="border-l-4 border-orange-500 pl-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">5. Thông tin cá nhân</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Xem và cập nhật thông tin tài khoản</li>
                <li>Đổi mật khẩu</li>
                <li>Quản lý cài đặt cá nhân</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center space-x-3 mb-6">
            <RocketLaunchIcon className="w-8 h-8 text-cyan-600" />
            <h2 className="text-2xl font-bold text-gray-900">Tính năng nổi bật</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-2">🔐 Xác thực an toàn</h3>
              <p className="text-gray-700 text-sm">Hệ thống đăng nhập với JWT token và tự động refresh token</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-green-50 to-teal-50 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-2">📊 Quản lý dự án</h3>
              <p className="text-gray-700 text-sm">Theo dõi tiến độ, ngân sách và tài nguyên của từng dự án</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-2">📦 Quản lý kho vật tư</h3>
              <p className="text-gray-700 text-sm">Theo dõi tồn kho, nhập xuất vật tư tự động</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-2">📄 Nhập dữ liệu từ Excel</h3>
              <p className="text-gray-700 text-sm">Nhập nhanh dữ liệu dự trù vật tư từ tệp Excel</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-2">✅ Quy trình ban hành</h3>
              <p className="text-gray-700 text-sm">Quy trình ban hành yêu cầu vật tư rõ ràng, minh bạch</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-2">📱 Responsive Design</h3>
              <p className="text-gray-700 text-sm">Giao diện thân thiện, tương thích mọi thiết bị</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-600">
          <p className="text-sm">© 2025 Material Management System. All rights reserved.</p>
          <p className="text-xs mt-2">Phát triển bởi BaoTran - @remiehneppo</p>
        </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
