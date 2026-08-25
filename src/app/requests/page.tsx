"use client";

import { useState, useEffect, useRef } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Header from "@/components/layout/Header";
import RequestDetailModal from "@/components/requests/RequestDetailModal";
import CreateMaterialRequestModal from "@/components/requests/CreateMaterialRequestModal";
import { materialRequestService, maintenanceService } from "@/services";
import { MaterialRequest, Maintenance } from "@/types/api";

export default function RequestsPage() {
  const [selectedRequest, setSelectedRequest] = useState<MaterialRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [requests, setRequests] = useState<MaterialRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<MaterialRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [processingRequest, setProcessingRequest] = useState<MaterialRequest | null>(null);
  
  // Ref to track if this is the initial mount
  const isInitialMount = useRef(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // Filter states
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [selectedMaintenanceId, setSelectedMaintenanceId] = useState<string>("");
  const [selectedSector, setSelectedSector] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const loadMaintenances = async () => {
    try {
      const response = await maintenanceService.getAll();
      if (response.data) {
        setMaintenances(response.data);
      }
    } catch (error) {
      console.error("Error loading maintenances:", error);
    }
  };

  const loadRequests = async (page: number = 1) => {
    try {
      setLoading(true);
      
      // Build filter request based on current filter states
      const filterRequest: {
        maintenance_instance_id?: string;
        sector?: string;
        num_of_request?: number;
      } = {};

      if (selectedMaintenanceId) {
        filterRequest.maintenance_instance_id = selectedMaintenanceId;
      }
      if (selectedSector) {
        filterRequest.sector = selectedSector;
      }
      // Only send num_of_request filter to API for "pending" status
      // API supports filtering by num_of_request = 0 for pending requests
      if (selectedStatus === "pending") {
        filterRequest.num_of_request = 0;
      }
      // For "approved" status, we get all requests and filter client-side
      // because API may not support num_of_request > 0 directly
      // For "all" status (empty), we get all requests without num_of_request filter

      const response = await materialRequestService.filter(filterRequest, page, pageSize);
      if (response.data) {
        setRequests(response.data.items);
        setTotalItems(response.data.total);
        setTotalPages(Math.ceil(response.data.total / pageSize));
        setCurrentPage(response.data.page);
      }
    } catch (error) {
      console.error("Error loading material requests:", error);
      alert("Không thể tải danh sách yêu cầu vật tư");
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...requests];

    // Client-side filter by status
    if (selectedStatus === "pending") {
      // Only show requests with num_of_request === 0 (pending approval)
      filtered = filtered.filter(r => r.num_of_request === 0);
    } else if (selectedStatus === "approved") {
      // Only show requests with num_of_request > 0 (approved)
      filtered = filtered.filter(r => r.num_of_request > 0);
    }
    // If selectedStatus is empty, show all requests

    // Filter by search term (client-side)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(r => 
        r.project.toLowerCase().includes(term) ||
        r.sector.toLowerCase().includes(term) ||
        r.requested_by.toLowerCase().includes(term) ||
        r.description?.toLowerCase().includes(term)
      );
    }

    // Sort by time (client-side)
    filtered.sort((a, b) => {
      if (sortOrder === "desc") {
        return b.requested_at - a.requested_at;
      } else {
        return a.requested_at - b.requested_at;
      }
    });

    setFilteredRequests(filtered);
  };

  // Initial load
  useEffect(() => {
    loadMaintenances();
    loadRequests(1); // Load initial data
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reload data when server-side filters or pageSize change
  useEffect(() => {
    // Skip the initial mount (already loaded above)
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    setCurrentPage(1); // Reset to page 1 when filters change
    loadRequests(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMaintenanceId, selectedSector, selectedStatus, pageSize]);

  // Reload when page changes
  useEffect(() => {
    if (currentPage > 1) {
      loadRequests(currentPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  // Apply client-side filters (search and sort) whenever data or these filters change
  useEffect(() => {
    applyFiltersAndSort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortOrder, searchTerm, requests, selectedStatus]);

  const handleViewDetail = (request: MaterialRequest) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
  };

  const handleCreateSuccess = () => {
    loadRequests();
  };

  const handleOpenApproveModal = (request: MaterialRequest) => {
    setProcessingRequest(request);
    setShowApproveModal(true);
  };

  const handleOpenCancelModal = (request: MaterialRequest) => {
    setProcessingRequest(request);
    setShowCancelModal(true);
  };

  const handleApproveRequest = async () => {
    if (!processingRequest) return;

    try {
      setLoading(true);
      const response = await materialRequestService.issue(processingRequest.id);
      alert(`Đã ban hành yêu cầu vật tư số ${response.data?.request_number}.`);
      setShowApproveModal(false);
      setProcessingRequest(null);
      loadRequests();
    } catch (error) {
      console.error("Error approving material request:", error);
      alert("Không thể ban hành yêu cầu vật tư. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRequest = async () => {
    if (!processingRequest) return;

    try {
      setLoading(true);
      await materialRequestService.cancelMaterialRequest(processingRequest.id);
      alert("Đã hủy yêu cầu vật tư.");
      setShowCancelModal(false);
      setProcessingRequest(null);
      loadRequests();
    } catch (error) {
      console.error("Error canceling material request:", error);
      alert("Không thể hủy yêu cầu vật tư. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleExportRequest = async (request: MaterialRequest) => {
    try {
      setLoading(true);
      const filename = `YCVT-${request.project}-${request.maintenance_tier}-${request.sector}-${request.year}${request.num_of_request > 0 ? `-${request.num_of_request}` : ""}.docx`;
      await materialRequestService.downloadExport(request.id, filename);
      alert("Đã xuất tệp yêu cầu vật tư.");
    } catch (error) {
      console.error("Error exporting material request:", error);
      alert("Không thể xuất tệp yêu cầu vật tư. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <Header title="YÊU CẦU VẬT TƯ" />
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Action Bar */}
        <div className="flex justify-between items-center">
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] font-semibold"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Tạo yêu cầu mới</span>
          </button>
        </div>

        {/* Filter Section */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900">Bộ lọc và tìm kiếm</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-6">
            {/* Search */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                🔍 Tìm kiếm
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm theo dự án, ngành..."
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 text-gray-900 transition-all duration-200 bg-white hover:border-cyan-300"
                />
              </div>
            </div>

            {/* Project Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                📋 Dự án
              </label>
              <select
                value={selectedMaintenanceId}
                onChange={(e) => setSelectedMaintenanceId(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 text-gray-900 font-medium transition-all duration-200 bg-white hover:border-cyan-300"
              >
                <option value="">Tất cả dự án</option>
                {maintenances.map((maintenance) => (
                  <option key={maintenance.id} value={maintenance.id}>
                    {maintenance.project} - {maintenance.maintenance_tier}/{maintenance.maintenance_number}
                  </option>
                ))}
              </select>
            </div>

            {/* Sector Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                🏭 Ngành
              </label>
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 text-gray-900 font-medium transition-all duration-200 bg-white hover:border-cyan-300"
              >
                <option value="">Tất cả ngành</option>
                <option value="Cơ khí">Cơ khí</option>
                <option value="Vũ khí">Vũ khí</option>
                <option value="Vỏ Tàu">Vỏ Tàu</option>
                <option value="Đà đốc">Đà đốc</option>
                <option value="Điện tàu">Điện tàu</option>
                <option value="Động lực">Động lực</option>
                <option value="Van ống">Van ống</option>
                <option value="KT-ĐT">KT-ĐT</option>
                <option value="Trang trí">Trang trí</option>
                <option value="Cơ điện">Cơ điện</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                📊 Trạng thái
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 text-gray-900 font-medium transition-all duration-200 bg-white hover:border-cyan-300"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="pending">Chờ ban hành</option>
                <option value="approved">Đã ban hành</option>
              </select>
            </div>

            {/* Sort Order */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                🕒 Sắp xếp
              </label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 text-gray-900 font-medium transition-all duration-200 bg-white hover:border-cyan-300"
              >
                <option value="desc">Mới nhất</option>
                <option value="asc">Cũ nhất</option>
              </select>
            </div>
          </div>

          {/* Clear Filter Button */}
          {(selectedMaintenanceId || selectedSector || selectedStatus || searchTerm) && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setSelectedMaintenanceId("");
                  setSelectedSector("");
                  setSelectedStatus("");
                  setSearchTerm("");
                }}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 shadow-md hover:shadow-lg font-semibold"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Xóa bộ lọc</span>
              </button>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl shadow-xl p-6 text-white transform hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-90 mb-1">Tổng yêu cầu</p>
                <p className="text-4xl font-bold">{totalItems}</p>
              </div>
              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-xl">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl shadow-xl p-6 text-white transform hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-90 mb-1">Chờ ban hành</p>
                <p className="text-4xl font-bold">
                  {requests.filter(r => r.num_of_request === 0).length}
                </p>
              </div>
              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-xl">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl shadow-xl p-6 text-white transform hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-90 mb-1">Đã ban hành</p>
                <p className="text-4xl font-bold">
                  {requests.filter(r => r.num_of_request > 0).length}
                </p>
              </div>
              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-xl">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl shadow-xl p-6 text-white transform hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-90 mb-1">Hiển thị</p>
                <p className="text-4xl font-bold">
                  {filteredRequests.length}
                </p>
              </div>
              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-xl">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Requests List */}
        <div className="space-y-4 lg:space-y-6">
          {loading ? (
            <div className="flex flex-col justify-center items-center py-20 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border border-gray-100">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-cyan-200"></div>
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-cyan-500 absolute top-0 left-0"></div>
              </div>
              <span className="mt-6 text-lg font-semibold text-gray-700">Đang tải dữ liệu...</span>
              <span className="mt-2 text-sm text-gray-500">Vui lòng chờ trong giây lát</span>
            </div>
          ) : requests.length === 0 ? (
            <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl border-2 border-blue-200 p-12 text-center">
              <div className="p-4 bg-blue-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-700 text-xl font-bold mb-2">Chưa có yêu cầu vật tư nào</p>
              <p className="text-gray-500">Tạo yêu cầu đầu tiên để bắt đầu</p>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border-2 border-gray-200 p-12 text-center">
              <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-gray-700 text-xl font-bold mb-2">Không tìm thấy yêu cầu nào</p>
              <p className="text-gray-500">Thử điều chỉnh bộ lọc hoặc tìm kiếm với từ khóa khác</p>
            </div>
          ) : (
            filteredRequests.map((request) => (
            <div key={request.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-2xl transition-all duration-300 overflow-hidden">
              <div className="p-6 lg:p-8">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 mb-6">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <h3 className="text-lg lg:text-xl font-bold text-gray-900">
                        #{`${request.project}/${request.maintenance_tier}/${request.sector}/${request.year}/${request.num_of_request > 0 ? request.num_of_request : ""}`}
                      </h3>
                      <span className={`px-4 py-1.5 text-sm font-semibold rounded-full ${
                        request.num_of_request === 0 
                          ? "bg-gradient-to-r from-orange-100 to-pink-100 text-orange-800"
                          : request.num_of_request > 0
                          ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800"
                          : "bg-gradient-to-r from-red-100 to-pink-100 text-red-800"
                      }`}>
                        {request.num_of_request === 0 ? "⏳ Chờ ban hành" : request.num_of_request > 0 ? "✅ Đã ban hành" : "❌ Đã hủy"}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 text-sm">
                      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-3">
                        <span className="text-gray-600 text-xs font-medium">Dự án</span>
                        <p className="font-bold text-gray-900 mt-1">{request.project}</p>
                      </div>
                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-3">
                        <span className="text-gray-600 text-xs font-medium">Ngành</span>
                        <p className="font-bold text-gray-900 mt-1">{request.sector}</p>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-3">
                        <span className="text-gray-600 text-xs font-medium">Người yêu cầu</span>
                        <p className="font-bold text-gray-900 mt-1">{request.requested_by}</p>
                      </div>
                      <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg p-3">
                        <span className="text-gray-600 text-xs font-medium">Ngày tạo</span>
                        <p className="font-bold text-gray-900 mt-1">{new Date(request.requested_at * 1000).toLocaleString('vi-VN')}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {request.num_of_request === 0 && (
                      <>
                        <button 
                          onClick={() => handleOpenApproveModal(request)}
                          className="flex items-center gap-1.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Ban hành
                        </button>
                        <button 
                          onClick={() => handleOpenCancelModal(request)}
                          className="flex items-center gap-1.5 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Hủy
                        </button>
                      </>
                    )}
                    <button 
                      onClick={() => handleExportRequest(request)}
                      disabled={loading}
                      className="flex items-center gap-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Xuất tệp
                    </button>
                    <button 
                      onClick={() => handleViewDetail(request)}
                      className="flex items-center gap-1.5 bg-gradient-to-r from-gray-600 to-gray-700 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Chi tiết
                    </button>
                  </div>
                </div>
                
                <div className="border-t-2 border-gray-100 pt-6 space-y-6">
                  <div>
                    <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                      <svg className="w-4 h-4 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Nội dung
                    </h4>
                    <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3 border border-gray-200">{request.description}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                      <svg className="w-4 h-4 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      Danh sách hạng mục ({Object.keys(request.materials_for_equipment).length})
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {Object.entries(request.materials_for_equipment).map(([id, item]) => (
                        <div key={id} className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-4 border-2 border-gray-200 hover:border-cyan-300 transition-all duration-200 hover:shadow-md">
                          <p className="font-bold text-gray-900 mb-3 text-sm">{item.equipment_machinery_name}</p>
                          <div className="flex justify-between text-xs">
                            <div className="flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                              <span className="text-gray-600">VT tiêu hao:</span>
                              <span className="font-bold text-blue-600">{Object.keys(item.consumable_supplies || {}).length}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-green-500"></span>
                              <span className="text-gray-600">VT thay thế:</span>
                              <span className="font-bold text-green-600">{Object.keys(item.replacement_materials || {}).length}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            ))
          )}
        </div>

        {/* Pagination Controls */}
        {!loading && filteredRequests.length > 0 && (
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border border-gray-100 p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Page size selector */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-700">Hiển thị:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-cyan-100 focus:border-cyan-500 text-gray-900 font-semibold transition-all duration-200 bg-white hover:border-cyan-300"
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select>
                <span className="text-sm text-gray-600">
                  Tổng: <span className="font-bold text-cyan-600">{totalItems}</span> yêu cầu
                </span>
              </div>

              {/* Page navigation */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="p-2 border-2 border-gray-200 rounded-xl hover:bg-cyan-50 hover:border-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  title="Trang đầu"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                  </svg>
                </button>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-2 border-2 border-gray-200 rounded-xl hover:bg-cyan-50 hover:border-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  title="Trang trước"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <div className="flex items-center gap-1.5">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`min-w-[40px] px-3 py-2 rounded-xl font-bold transition-all duration-200 ${
                          currentPage === pageNum
                            ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg scale-110"
                            : "border-2 border-gray-200 text-gray-700 hover:bg-cyan-50 hover:border-cyan-300 hover:scale-105"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 border-2 border-gray-200 rounded-xl hover:bg-cyan-50 hover:border-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  title="Trang sau"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="p-2 border-2 border-gray-200 rounded-xl hover:bg-cyan-50 hover:border-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  title="Trang cuối"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty State - Removed as we now handle it inline */}
        {false && requests.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có yêu cầu nào</h3>
            <p className="text-gray-500 mb-4">Tạo yêu cầu vật tư đầu tiên cho dự án của bạn</p>
            <button className="bg-cyan-500 text-white px-4 py-2 rounded-lg hover:bg-cyan-600 transition-colors">
              Tạo yêu cầu mới
            </button>
          </div>
        )}
      </div>

      {/* Request Detail Modal */}
      <RequestDetailModal
        request={selectedRequest}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onUpdate={loadRequests}
      />

      {/* Create Material Request Modal */}
      <CreateMaterialRequestModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      {/* Approve Modal */}
      {showApproveModal && processingRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Ban hành yêu cầu vật tư</h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-blue-800">
                  <span className="font-semibold">Đợt sửa chữa:</span> {processingRequest.project} - {processingRequest.maintenance_tier}/{processingRequest.maintenance_number}
                </p>
                <p className="text-sm text-blue-800">
                  <span className="font-semibold">Ngành:</span> {processingRequest.sector}
                </p>
                <p className="text-sm text-blue-800">
                  <span className="font-semibold">Người lập yêu cầu:</span> {processingRequest.requested_by}
                </p>
              </div>
              <p className="text-sm text-gray-700">
                Khi ban hành, hệ thống sẽ cấp số phiếu tiếp theo và đồng thời ghi nhận số lượng vật tư vào thực tế.
              </p>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => {
                    setShowApproveModal(false);
                    setProcessingRequest(null);
                  }}
                  disabled={loading}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Hủy
                </button>
                <button
                  onClick={handleApproveRequest}
                  disabled={loading}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {loading ? "Đang ban hành..." : "Xác nhận ban hành"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && processingRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Xác nhận hủy yêu cầu</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    #{`${processingRequest.project}/${processingRequest.maintenance_tier}/${processingRequest.sector}/${processingRequest.year}`}
                  </p>
                </div>
              </div>
              <p className="text-gray-600 mb-6">
                Bạn có chắc chắn muốn hủy yêu cầu vật tư này? Hành động này không thể hoàn tác.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowCancelModal(false);
                    setProcessingRequest(null);
                  }}
                  disabled={loading}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Không, giữ lại
                </button>
                <button
                  onClick={handleCancelRequest}
                  disabled={loading}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  {loading ? "Đang hủy..." : "Có, hủy yêu cầu"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
