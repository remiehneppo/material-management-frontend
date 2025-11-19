"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Header from "@/components/layout/Header";
import { maintenanceService } from "@/services";
import { Maintenance } from "@/types/api";
import CreateProjectModal from "@/components/projects/CreateProjectModal";

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Maintenance[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Maintenance[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTier, setSelectedTier] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const response = await maintenanceService.getAll();
      if (response.status && response.data) {
        setProjects(response.data);
      }
    } catch (error) {
      console.error("Error loading projects:", error);
      alert("Không thể tải danh sách dự án");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = [...projects];

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.project.toLowerCase().includes(term) ||
          p.project_code.toLowerCase().includes(term)
      );
    }

    // Filter by tier
    if (selectedTier) {
      filtered = filtered.filter((p) => p.maintenance_tier === selectedTier);
    }

    setFilteredProjects(filtered);
  }, [projects, searchTerm, selectedTier]);

  const handleViewDetail = (project: Maintenance) => {
    // Navigate to materials page with project filter
    router.push(`/materials?maintenance_id=${project.id}&project=${encodeURIComponent(project.project)}`);
  };

  return (
    <DashboardLayout>
      <Header title="DỰ ÁN" />
      <div className="p-6">
        {/* Action Bar */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-4">
            {/* <button className="bg-cyan-500 text-white px-4 py-2 rounded-lg hover:bg-cyan-600 transition-colors">
              + Thêm dự án mới
            </button>
            <button className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors">
              Xuất báo cáo
            </button> */}
          </div>
            <div className="flex space-x-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm dự án..."
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-900 font-medium placeholder:text-gray-500"
            />
            <select 
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-900 font-medium"
            >
              <option value="">Tất cả các cấp</option>
              <option value="SCCĐ">SCCĐ</option>
              <option value="SCCN">SCCN</option>
              <option value="SCCV">SCCV</option>
            </select>
            </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-gray-500 text-lg font-medium mb-2">Không tìm thấy dự án nào</p>
            <p className="text-gray-400 text-sm">Thử điều chỉnh bộ lọc hoặc tìm kiếm với từ khóa khác</p>
          </div>
        ) : (
          <>
            {/* Projects Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
            <div key={project.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{project.project}</h3>
                {/* <span className={`px-2 py-1 text-xs rounded-full ${
                  project.status === "Hoàn thành" 
                    ? "bg-green-100 text-green-800"
                    : project.status === "Đang thực hiện"
                    ? "bg-blue-100 text-blue-800"
                    : project.status === "Chuẩn bị"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}>
                  {project.status}
                </span> */}
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Mã hiệu:</span>
                  <span className="text-gray-900">{project.project_code}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Cấp dự án:</span>
                  <span className="text-gray-900">{project.maintenance_tier}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Lần thứ:</span>
                  <span className="text-gray-900">{project.maintenance_number}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Năm thực hiện:</span>
                  <span className="text-gray-900">{project.year}</span>
                </div>
              </div>
              
              <div className="flex space-x-2 mt-4 pt-4 border-t border-gray-100">
                <button 
                  onClick={() => handleViewDetail(project)}
                  className="flex-1 bg-cyan-500 text-white py-2 px-3 rounded text-sm hover:bg-cyan-600 transition-colors"
                >
                  Xem chi tiết
                </button>
                <button className="flex-1 bg-gray-500 text-white py-2 px-3 rounded text-sm hover:bg-gray-600 transition-colors">
                  Chỉnh sửa
                </button>
              </div>
            </div>
              ))}
            </div>

            {/* Add New Project Card */}
            <div className="mt-6">
              <div 
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-cyan-400 transition-colors cursor-pointer"
              >
                <div className="mx-auto w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Tạo dự án mới</h3>
                <p className="text-gray-500">Nhấp để thêm dự án mới vào hệ thống</p>
              </div>
            </div>
          </>
        )}

        {/* Create Project Modal */}
        <CreateProjectModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={() => {
            loadProjects(); // Reload projects after successful creation
          }}
        />
      </div>
    </DashboardLayout>
  );
}