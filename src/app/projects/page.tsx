"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Header from "@/components/layout/Header";
import { maintenanceService } from "@/services";
import { Maintenance } from "@/types/api";
import CreateProjectModal from "@/components/projects/CreateProjectModal";
import { WrenchIcon, WrenchScrewdriverIcon, RocketLaunchIcon, CircleStackIcon } from "@heroicons/react/24/outline";

// Icon Components
const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const FilterIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

const EyeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EmptyIcon = () => (
  <svg className="w-20 h-20 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
  </svg>
);

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

  // Get project statistics
  const stats = {
    total: projects.length,
    sccd: projects.filter(p => p.maintenance_tier === 'SCCĐ').length,
    sccn: projects.filter(p => p.maintenance_tier === 'SCCN').length,
    sccv: projects.filter(p => p.maintenance_tier === 'SCCV').length,
  };

  return (
    <DashboardLayout>
      <Header title="DỰ ÁN" />
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <div className="bg-gradient-to-br from-blue-500 via-blue-400 to-indigo-500 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-100 text-sm font-medium">Tổng số</span>
              <CircleStackIcon className="w-6 h-6" />
            </div>
            <p className="text-3xl font-bold">{stats.total}</p>
            <p className="text-blue-100 text-sm mt-1">Dự án</p>
          </div>
          
          <div className="bg-gradient-to-br from-emerald-500 via-green-400 to-teal-500 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-emerald-100 text-sm font-medium">SCCĐ</span>
              <WrenchIcon className="w-6 h-6" />
            </div>
            <p className="text-3xl font-bold">{stats.sccd}</p>
            <p className="text-emerald-100 text-sm mt-1">Dự án</p>
          </div>
          
          <div className="bg-gradient-to-br from-amber-500 via-orange-400 to-red-500 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-amber-100 text-sm font-medium">SCCN</span>
              <WrenchScrewdriverIcon className="w-6 h-6" />
            </div>
            <p className="text-3xl font-bold">{stats.sccn}</p>
            <p className="text-amber-100 text-sm mt-1">Dự án</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500 via-violet-400 to-indigo-500 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-purple-100 text-sm font-medium">SCCV</span>
              <RocketLaunchIcon className="w-6 h-6" />
            </div>
            <p className="text-3xl font-bold">{stats.sccv}</p>
            <p className="text-purple-100 text-sm mt-1">Dự án</p>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg text-white">
                <FilterIcon />
              </div>
              <h3 className="text-lg font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                Bộ lọc & Tìm kiếm
              </h3>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 sm:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <SearchIcon />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="🔍 Tìm kiếm dự án..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 font-medium placeholder:text-gray-400 transition-all duration-300"
                />
              </div>
              
              <select 
                value={selectedTier}
                onChange={(e) => setSelectedTier(e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 font-medium bg-white hover:border-cyan-400 transition-all duration-300 cursor-pointer"
              >
                <option value="">Tất cả các cấp</option>
                <option value="SCCĐ">SCCĐ</option>
                <option value="SCCN">SCCN</option>
                <option value="SCCV">SCCV</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-20">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200"></div>
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-cyan-500 border-r-blue-500 absolute top-0 left-0"></div>
            </div>
            <p className="mt-4 text-gray-500 font-medium">Đang tải dự án...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl shadow-lg border border-gray-200 p-16 text-center">
            <div className="mx-auto mb-6 w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
              <EmptyIcon />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Không tìm thấy dự án nào</h3>
            <p className="text-gray-500 mb-6">Thử điều chỉnh bộ lọc hoặc tìm kiếm với từ khóa khác</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedTier("");
              }}
              className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 font-medium shadow-lg hover:shadow-xl hover:scale-105"
            >
              Xóa bộ lọc
            </button>
          </div>
        ) : (
          <>
            {/* Projects Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              {filteredProjects.map((project) => {
                // Determine tier color scheme
                const getTierColors = (tier: string) => {
                  switch(tier) {
                    case 'SCCĐ':
                      return {
                        gradient: 'from-emerald-500 to-teal-500',
                        bg: 'bg-emerald-50',
                        text: 'text-emerald-700',
                        badge: 'bg-emerald-100 text-emerald-700'
                      };
                    case 'SCCN':
                      return {
                        gradient: 'from-amber-500 to-orange-500',
                        bg: 'bg-amber-50',
                        text: 'text-amber-700',
                        badge: 'bg-amber-100 text-amber-700'
                      };
                    case 'SCCV':
                      return {
                        gradient: 'from-purple-500 to-indigo-500',
                        bg: 'bg-purple-50',
                        text: 'text-purple-700',
                        badge: 'bg-purple-100 text-purple-700'
                      };
                    default:
                      return {
                        gradient: 'from-gray-500 to-gray-600',
                        bg: 'bg-gray-50',
                        text: 'text-gray-700',
                        badge: 'bg-gray-100 text-gray-700'
                      };
                  }
                };

                const colors = getTierColors(project.maintenance_tier);

                return (
                  <div 
                    key={project.id} 
                    className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] group"
                  >
                    {/* Project Header with Gradient */}
                    <div className={`bg-gradient-to-r ${colors.gradient} p-6 text-white relative overflow-hidden`}>
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-3">
                          <span className={`px-3 py-1 ${colors.badge} rounded-full text-xs font-bold backdrop-blur-sm`}>
                            {project.maintenance_tier}
                          </span>
                          <span className={`px-3 py-1 ${colors.gradient} bg-opacity-20 rounded-full text-xs font-semibold backdrop-blur-sm`}>
                            {project.year}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold mb-1 line-clamp-2 min-h-[3.5rem]">
                          {project.project}
                        </h3>
                        <p className="text-white text-opacity-90 text-sm font-mono">
                          {project.project_code}
                        </p>
                      </div>
                    </div>

                    {/* Project Details */}
                    <div className="p-6 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className={`${colors.bg} rounded-xl p-4 border border-gray-100`}>
                          <p className="text-xs text-gray-500 mb-1 font-medium">Lần thứ</p>
                          <p className={`text-2xl font-bold ${colors.text}`}>{project.maintenance_number}</p>
                        </div>
                        
                        <div className={`${colors.bg} rounded-xl p-4 border border-gray-100`}>
                          <p className="text-xs text-gray-500 mb-1 font-medium">Năm</p>
                          <p className={`text-2xl font-bold ${colors.text}`}>{project.year}</p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        <button 
                          onClick={() => handleViewDetail(project)}
                          className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 px-4 rounded-xl font-medium hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 flex items-center justify-center gap-2 group"
                        >
                          <EyeIcon />
                          <span>Xem chi tiết</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add New Project Card */}
            <div className="mt-8">
              <div 
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-gradient-to-br from-gray-50 to-blue-50 border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-cyan-500 hover:from-cyan-50 hover:to-blue-50 transition-all duration-300 cursor-pointer group hover:shadow-xl"
              >
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <PlusIcon />
                </div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  Tạo dự án mới
                </h3>
                <p className="text-gray-500 font-medium">Nhấp để thêm dự án mới vào hệ thống</p>
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