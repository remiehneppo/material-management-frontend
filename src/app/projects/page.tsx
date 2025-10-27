import DashboardLayout from "@/components/layout/DashboardLayout";
import Header from "@/components/layout/Header";

export default function ProjectsPage() {
  const projects = [
    { id: 1, name: "Dự án xây dựng A", status: "Đang thực hiện", progress: 75, startDate: "2024-01-15", manager: "Nguyễn Văn A" },
    { id: 2, name: "Dự án xây dựng B", status: "Hoàn thành", progress: 100, startDate: "2023-12-01", manager: "Trần Thị B" },
    { id: 3, name: "Dự án xây dựng C", status: "Chuẩn bị", progress: 25, startDate: "2024-02-01", manager: "Lê Văn C" },
    { id: 4, name: "Dự án xây dựng D", status: "Tạm dừng", progress: 45, startDate: "2024-01-20", manager: "Phạm Thị D" },
  ];

  return (
    <DashboardLayout>
      <Header title="DỰ ÁN" />
      <div className="p-6">
        {/* Action Bar */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-4">
            <button className="bg-cyan-500 text-white px-4 py-2 rounded-lg hover:bg-cyan-600 transition-colors">
              + Thêm dự án mới
            </button>
            <button className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors">
              Xuất báo cáo
            </button>
          </div>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Tìm kiếm dự án..."
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500">
              <option>Tất cả trạng thái</option>
              <option>Đang thực hiện</option>
              <option>Hoàn thành</option>
              <option>Chuẩn bị</option>
              <option>Tạm dừng</option>
            </select>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  project.status === "Hoàn thành" 
                    ? "bg-green-100 text-green-800"
                    : project.status === "Đang thực hiện"
                    ? "bg-blue-100 text-blue-800"
                    : project.status === "Chuẩn bị"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}>
                  {project.status}
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Quản lý:</span>
                  <span className="text-gray-900">{project.manager}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Ngày bắt đầu:</span>
                  <span className="text-gray-900">{project.startDate}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tiến độ:</span>
                    <span className="text-gray-900">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-cyan-500 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
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