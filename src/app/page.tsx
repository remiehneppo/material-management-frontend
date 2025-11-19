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
      <div className="p-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Total Projects Card */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-blue-100 mb-2">Tổng số dự án</h3>
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  </div>
                ) : (
                  <p className="text-4xl font-bold">{projectCount}</p>
                )}
                <p className="text-sm text-blue-100 mt-2">Dự án đang quản lý</p>
              </div>
              {/* <div className="p-4 bg-white bg-opacity-20 rounded-lg">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div> */}
            </div>
          </div>

          {/* Pending Requests Card */}
          <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-yellow-100 mb-2">Yêu cầu chờ duyệt</h3>
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  </div>
                ) : (
                  <p className="text-4xl font-bold">{pendingRequestCount}</p>
                )}
                <p className="text-sm text-yellow-100 mt-2">Yêu cầu cần xử lý</p>
              </div>
              {/* <div className="p-4 bg-white bg-opacity-20 rounded-lg">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div> */}
            </div>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Chào mừng đến với Hệ thống Quản lý Vật tư</h2>
          <p className="text-gray-600">
            Hệ thống cung cấp các công cụ để quản lý dự án, vật tư và yêu cầu vật tư một cách hiệu quả.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-2">
                <div className="p-2 bg-cyan-100 rounded-lg mr-3">
                  <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">Quản lý dự án</h3>
              </div>
              <p className="text-sm text-gray-600">Theo dõi và quản lý các dự án sửa chữa, bảo trì</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-2">
                <div className="p-2 bg-green-100 rounded-lg mr-3">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">Quản lý vật tư</h3>
              </div>
              <p className="text-sm text-gray-600">Kiểm soát kho vật tư, dự toán và thực tế</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-2">
                <div className="p-2 bg-orange-100 rounded-lg mr-3">
                  <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">Yêu cầu vật tư</h3>
              </div>
              <p className="text-sm text-gray-600">Tạo và quản lý các yêu cầu cấp vật tư</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
