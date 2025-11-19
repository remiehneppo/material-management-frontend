'use client';

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Header from "@/components/layout/Header";
import { maintenanceService, materialRequestService } from "@/services";

export default function Dashboard() {
  const [projectCount, setProjectCount] = useState<number>(0);
  const [pendingRequestCount, setPendingRequestCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load projects count
      const projectsResponse = await maintenanceService.getAll();
      if (projectsResponse.status && projectsResponse.data) {
        setProjectCount(projectsResponse.data.length);
      }

      // Load material requests and count pending ones (num_of_request = 0)
      const requestsResponse = await materialRequestService.getAll();
      if (requestsResponse.status && requestsResponse.data) {
        // Filter requests with num_of_request = 0 (pending)
        const pendingRequests = requestsResponse.data.items.filter(
          (request) => request.num_of_request === 0
        );
        setPendingRequestCount(pendingRequests.length);
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <DashboardLayout>
      <Header title="TỔNG QUAN" />
      <div className="p-3 sm:p-4 lg:p-6 xl:p-8 space-y-4 sm:space-y-6 lg:space-y-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 xl:gap-8">
          {/* Total Projects Card */}
          <div className="group bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-4 sm:p-5 lg:p-6 xl:p-8 text-white transform hover:scale-[1.02]">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                  <div className="p-1.5 sm:p-2 bg-white/20 rounded-lg">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-xs sm:text-sm font-semibold text-blue-100 uppercase tracking-wide">Tổng số dự án</h3>
                </div>
                {loading ? (
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-2 sm:border-3 border-white/30 border-t-white"></div>
                    <span className="text-sm sm:text-base lg:text-lg">Đang tải...</span>
                  </div>
                ) : (
                  <div>
                    <p className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-1 sm:mb-2">{projectCount}</p>
                    <p className="text-xs sm:text-sm text-blue-100 font-medium">Dự án đang quản lý</p>
                  </div>
                )}
              </div>
              <div className="hidden sm:block p-3 lg:p-4 bg-white/10 backdrop-blur-sm rounded-xl lg:rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <svg className="w-12 h-12 lg:w-16 lg:h-16 xl:w-20 xl:h-20 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>

          {/* Pending Requests Card */}
          <div className="group bg-gradient-to-br from-orange-500 via-pink-500 to-red-500 rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-4 sm:p-5 lg:p-6 xl:p-8 text-white transform hover:scale-[1.02]">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                  <div className="p-1.5 sm:p-2 bg-white/20 rounded-lg">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xs sm:text-sm font-semibold text-orange-100 uppercase tracking-wide">Yêu cầu chờ duyệt</h3>
                </div>
                {loading ? (
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-2 sm:border-3 border-white/30 border-t-white"></div>
                    <span className="text-sm sm:text-base lg:text-lg">Đang tải...</span>
                  </div>
                ) : (
                  <div>
                    <p className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-1 sm:mb-2">{pendingRequestCount}</p>
                    <p className="text-xs sm:text-sm text-orange-100 font-medium">Yêu cầu cần xử lý</p>
                  </div>
                )}
              </div>
              <div className="hidden sm:block p-4 bg-white/10 backdrop-blur-sm rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <svg className="w-16 h-16 lg:w-20 lg:h-20 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Welcome Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-6 lg:p-8 xl:p-10">
          <div className="max-w-4xl">
            <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2 sm:mb-3">
              Chào mừng đến với Hệ thống Quản lý Vật tư
            </h2>
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed">
              Hệ thống cung cấp các công cụ để quản lý dự án, vật tư và yêu cầu vật tư một cách hiệu quả và chuyên nghiệp.
            </p>
          </div>
          
          {/* Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mt-5 sm:mt-6 lg:mt-8">
            <div className="group bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-lg sm:rounded-xl p-4 sm:p-5 lg:p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-start gap-3 sm:gap-4 mb-2 sm:mb-3">
                <div className="p-2 sm:p-3 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg sm:rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-1">Quản lý dự án</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Theo dõi và quản lý các dự án sửa chữa, bảo trì một cách chi tiết</p>
                </div>
              </div>
            </div>

            <div className="group bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg sm:rounded-xl p-4 sm:p-5 lg:p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-start gap-3 sm:gap-4 mb-2 sm:mb-3">
                <div className="p-2 sm:p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg sm:rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-1">Quản lý vật tư</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Kiểm soát kho vật tư, so sánh dự toán và thực tế chính xác</p>
                </div>
              </div>
            </div>

            <div className="group bg-gradient-to-br from-orange-50 to-pink-50 border-2 border-orange-200 rounded-lg sm:rounded-xl p-4 sm:p-5 lg:p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 sm:col-span-2 lg:col-span-1">
              <div className="flex items-start gap-3 sm:gap-4 mb-2 sm:mb-3">
                <div className="p-2 sm:p-3 bg-gradient-to-br from-orange-500 to-pink-500 rounded-lg sm:rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-1">Yêu cầu vật tư</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Tạo và quản lý các yêu cầu cấp vật tư nhanh chóng</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
