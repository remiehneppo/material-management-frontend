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
  const [requestNumber, setRequestNumber] = useState("");
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

    if (!requestNumber || requestNumber.trim() === "") {
      alert("Vui lòng nhập số yêu cầu vật tư");
      return;
    }

    const numOfRequest = parseInt(requestNumber);
    if (isNaN(numOfRequest) || numOfRequest <= 0) {
      alert("Số yêu cầu vật tư phải là số nguyên dương");
      return;
    }

    try {
      setLoading(true);
      await materialRequestService.updateNumber({
        material_request_id: processingRequest.id,
        num_of_request: numOfRequest
      });
      alert("Duyệt yêu cầu vật tư thành công!");
      setShowApproveModal(false);
      setRequestNumber("");
      setProcessingRequest(null);
      loadRequests();
    } catch (error) {
      console.error("Error approving material request:", error);
      alert("Có lỗi xảy ra khi duyệt yêu cầu vật tư");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRequest = async () => {
    if (!processingRequest) return;

    try {
      setLoading(true);
      await materialRequestService.cancelMaterialRequest(processingRequest.id);
      alert("Hủy yêu cầu vật tư thành công!");
      setShowCancelModal(false);
      setProcessingRequest(null);
      loadRequests();
    } catch (error) {
      console.error("Error canceling material request:", error);
      alert("Có lỗi xảy ra khi hủy yêu cầu vật tư");
    } finally {
      setLoading(false);
    }
  };

  const handleExportRequest = async (request: MaterialRequest) => {
    try {
      setLoading(true);
      const filename = `YCVT-${request.project}-${request.maintenance_tier}-${request.sector}-${request.year}${request.num_of_request > 0 ? `-${request.num_of_request}` : ""}.docx`;
      await materialRequestService.downloadExport(request.id, filename);
      alert("Xuất file thành công!");
    } catch (error) {
      console.error("Error exporting material request:", error);
      alert("Có lỗi xảy ra khi xuất file");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <Header title="YÊU CẦU VẬT TƯ" />
      <div className="p-6">
        {/* Action Bar */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-4">
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-cyan-500 text-white px-4 py-2 rounded-lg hover:bg-cyan-600 transition-colors"
            >
              + Tạo yêu cầu mới
            </button>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Bộ lọc và tìm kiếm</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tìm kiếm
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm theo dự án, ngành..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-900"
              />
            </div>

            {/* Project Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dự án
              </label>
              <select
                value={selectedMaintenanceId}
                onChange={(e) => setSelectedMaintenanceId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-900 font-medium"
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngành
              </label>
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-900 font-medium"
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-900 font-medium"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="pending">Chờ duyệt</option>
                <option value="approved">Đã duyệt</option>
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sắp xếp theo thời gian
              </label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-900 font-medium"
              >
                <option value="desc">Mới nhất</option>
                <option value="asc">Cũ nhất</option>
              </select>
            </div>
          </div>

          {/* Clear Filter Button */}
          {(selectedMaintenanceId || selectedSector || selectedStatus || searchTerm) && (
            <div className="mt-4">
              <button
                onClick={() => {
                  setSelectedMaintenanceId("");
                  setSelectedSector("");
                  setSelectedStatus("");
                  setSearchTerm("");
                }}
                className="text-sm text-cyan-600 hover:text-cyan-700 font-medium flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Xóa bộ lọc
              </button>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Tổng yêu cầu</p>
                <p className="text-xl font-semibold text-gray-900">{totalItems}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Chờ duyệt (trang này)</p>
                <p className="text-xl font-semibold text-gray-900">
                  {requests.filter(r => r.num_of_request === 0).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Đã duyệt (trang này)</p>
                <p className="text-xl font-semibold text-gray-900">
                  {requests.filter(r => r.num_of_request > 0).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="p-2 bg-cyan-100 rounded-lg">
                <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Trang hiện tại</p>
                <p className="text-xl font-semibold text-gray-900">
                  {filteredRequests.length}
                </p>
              </div>
            </div>
          </div>
          {/* <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Đã xuất</p>
                <p className="text-xl font-semibold text-gray-900">
                  {requests.filter(r => r.status === "Đã xuất").length}
                </p>
              </div>
            </div>
          </div> */}
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : requests.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <p className="text-gray-500">Chưa có yêu cầu vật tư nào</p>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-gray-500 text-lg font-medium mb-2">Không tìm thấy yêu cầu nào</p>
              <p className="text-gray-400 text-sm">Thử điều chỉnh bộ lọc hoặc tìm kiếm với từ khóa khác</p>
            </div>
          ) : (
            filteredRequests.map((request) => (
            <div key={request.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">#{`${request.project}/${request.maintenance_tier}/${request.sector}/${request.year}/${request.num_of_request > 0 ? request.num_of_request : ""}`}</h3>
                    <span className={`px-3 py-1 text-sm rounded-full ${
                      request.num_of_request === 0 
                        ? "bg-green-100 text-green-800"
                        : request.num_of_request > 0
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {request.num_of_request === 0 ? "Chờ duyệt" : request.num_of_request > 0 ? "Đã duyệt" : "Từ chối"}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Dự án:</span>
                      <p className="font-medium text-gray-900">{request.project}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Ngành:</span>
                      <p className="font-medium text-gray-900">{request.sector}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Người yêu cầu:</span>
                      <p className="font-medium text-gray-900">{request.requested_by}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Ngày tạo:</span>
                      <p className="font-medium text-gray-900">{new Date(request.requested_at * 1000).toLocaleString('vi-VN')}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  {request.num_of_request === 0 && (
                    <>
                      <button 
                        onClick={() => handleOpenApproveModal(request)}
                        className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition-colors"
                      >
                        Duyệt
                      </button>
                      <button 
                        onClick={() => handleOpenCancelModal(request)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                      >
                        Hủy
                      </button>
                    </>
                  )}
                  <button 
                    onClick={() => handleExportRequest(request)}
                    disabled={loading}
                    className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Xuất file</span>
                  </button>
                  <button 
                    onClick={() => handleViewDetail(request)}
                    className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600 transition-colors"
                  >
                    Chi tiết
                  </button>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-4">
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Nội dung:</h4>
                  <p className="text-sm text-gray-900">{request.description}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Danh sách hạng mục:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {Object.entries(request.materials_for_equipment).map(([id, item]) => (
                      <div key={id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <p className="font-medium text-gray-900 mb-2">{item.equipment_machinery_name}</p>
                        <div className="flex justify-between text-xs text-gray-600">
                          <span>VT tiêu hao: <span className="font-semibold text-blue-600">{Object.keys(item.consumable_supplies || {}).length}</span></span>
                          <span>VT thay thế: <span className="font-semibold text-green-600">{Object.keys(item.replacement_materials || {}).length}</span></span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            ))
          )}
        </div>

        {/* Pagination Controls */}
        {!loading && filteredRequests.length > 0 && (
          <div className="bg-white rounded-lg shadow p-4 mt-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Page size selector */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Hiển thị:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-900 font-medium"
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select>
                <span className="text-sm text-gray-600">
                  Tổng: <span className="font-semibold text-gray-900">{totalItems}</span> yêu cầu
                </span>
              </div>

              {/* Page navigation */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Trang đầu"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                  </svg>
                </button>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Trang trước"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <div className="flex items-center gap-1">
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
                        className={`px-3 py-1 rounded-lg transition-colors ${
                          currentPage === pageNum
                            ? "bg-cyan-500 text-white font-semibold"
                            : "border border-gray-300 text-gray-700 hover:bg-gray-50"
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
                  className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Trang sau"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
              <h3 className="text-xl font-bold text-gray-900 mb-4">Duyệt yêu cầu vật tư</h3>
              <p className="text-gray-600 mb-2">
                Yêu cầu: <span className="font-semibold">#{`${processingRequest.project}/${processingRequest.maintenance_tier}/${processingRequest.sector}/${processingRequest.year}`}</span>
              </p>
              <p className="text-gray-600 mb-4">
                Nhập số yêu cầu vật tư để xác nhận duyệt:
              </p>
              <input
                type="number"
                min="1"
                value={requestNumber}
                onChange={(e) => setRequestNumber(e.target.value)}
                placeholder="Nhập số yêu cầu (VD: 1, 2, 3...)"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg font-semibold text-gray-900"
                autoFocus
              />
              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => {
                    setShowApproveModal(false);
                    setRequestNumber("");
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
                  {loading ? "Đang duyệt..." : "Xác nhận duyệt"}
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