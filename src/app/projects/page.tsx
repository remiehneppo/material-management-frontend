import DashboardLayout from "@/components/layout/DashboardLayout";
import Header from "@/components/layout/Header";

export default function ProjectsPage() {
  const projects = [
    { id: 1, project: "Dự án A", project_code: "P001", maintenance_number: "1", maintenance_tier: "SCCN", year: 2024 },
    { id: 2, project: "Dự án B", project_code: "P002", maintenance_number: "2", maintenance_tier: "SCCN", year: 2024 },
    { id: 3, project: "Dự án C", project_code: "P003", maintenance_number: "3", maintenance_tier: "SCCV", year: 2024 },
    { id: 4, project: "Dự án D", project_code: "P004", maintenance_number: "4", maintenance_tier: "SCCN", year: 2024 },
  ];

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
              placeholder="Tìm kiếm dự án..."
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-900 font-medium placeholder:text-gray-500"
            />
            <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-900 font-medium">
              <option>Tất cả các cấp</option>
              <option>SCCĐ</option>
              <option>SCCN</option>
              <option>SCCV</option>
            </select>
            </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map((project) => (
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
                <button className="flex-1 bg-cyan-500 text-white py-2 px-3 rounded text-sm hover:bg-cyan-600 transition-colors">
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
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-cyan-400 transition-colors cursor-pointer">
            <div className="mx-auto w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Tạo dự án mới</h3>
            <p className="text-gray-500">Nhấp để thêm dự án mới vào hệ thống</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}