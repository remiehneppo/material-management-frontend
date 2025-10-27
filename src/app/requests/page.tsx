import DashboardLayout from "@/components/layout/DashboardLayout";
import Header from "@/components/layout/Header";

export default function RequestsPage() {
  const requests = [
    { 
      id: "REQ001", 
      project: "Dự án xây dựng A", 
      requester: "Nguyễn Văn A", 
      date: "2024-10-20", 
      status: "Chờ duyệt",
      items: [
        { name: "Xi măng PCB30", quantity: 50, unit: "bao" },
        { name: "Thép CT3", quantity: 100, unit: "kg" }
      ]
    },
    { 
      id: "REQ002", 
      project: "Dự án xây dựng B", 
      requester: "Trần Thị B", 
      date: "2024-10-19", 
      status: "Đã duyệt",
      items: [
        { name: "Gạch nung đỏ", quantity: 1000, unit: "viên" },
        { name: "Cát xây dựng", quantity: 5, unit: "m³" }
      ]
    },
    { 
      id: "REQ003", 
      project: "Dự án xây dựng C", 
      requester: "Lê Văn C", 
      date: "2024-10-18", 
      status: "Từ chối",
      items: [
        { name: "Đá 1x2", quantity: 10, unit: "m³" }
      ]
    },
    { 
      id: "REQ004", 
      project: "Dự án xây dựng D", 
      requester: "Phạm Thị D", 
      date: "2024-10-17", 
      status: "Đã xuất",
      items: [
        { name: "Sơn nước ngoại thất", quantity: 5, unit: "thùng" },
        { name: "Xi măng PCB30", quantity: 30, unit: "bao" }
      ]
    },
  ];

  return (
    <DashboardLayout>
      <Header title="YÊU CẦU VẬT TƯ" />
      <div className="p-6">
        {/* Action Bar */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-4">
            <button className="bg-cyan-500 text-white px-4 py-2 rounded-lg hover:bg-cyan-600 transition-colors">
              + Tạo yêu cầu mới
            </button>
            <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
              Duyệt hàng loạt
            </button>
            <button className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors">
              Xuất báo cáo
            </button>
          </div>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Tìm kiếm yêu cầu..."
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500">
              <option>Tất cả trạng thái</option>
              <option>Chờ duyệt</option>
              <option>Đã duyệt</option>
              <option>Từ chối</option>
              <option>Đã xuất</option>
            </select>
          </div>
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
                <p className="text-xl font-semibold text-gray-900">{requests.length}</p>
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
                <p className="text-sm font-medium text-gray-500">Chờ duyệt</p>
                <p className="text-xl font-semibold text-gray-900">
                  {requests.filter(r => r.status === "Chờ duyệt").length}
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
                <p className="text-sm font-medium text-gray-500">Đã duyệt</p>
                <p className="text-xl font-semibold text-gray-900">
                  {requests.filter(r => r.status === "Đã duyệt").length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
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
          </div>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {requests.map((request) => (
            <div key={request.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">#{request.id}</h3>
                    <span className={`px-3 py-1 text-sm rounded-full ${
                      request.status === "Đã duyệt" 
                        ? "bg-green-100 text-green-800"
                        : request.status === "Chờ duyệt"
                        ? "bg-yellow-100 text-yellow-800"
                        : request.status === "Đã xuất"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {request.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Dự án:</span>
                      <p className="font-medium text-gray-900">{request.project}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Người yêu cầu:</span>
                      <p className="font-medium text-gray-900">{request.requester}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Ngày tạo:</span>
                      <p className="font-medium text-gray-900">{request.date}</p>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {request.status === "Chờ duyệt" && (
                    <>
                      <button className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition-colors">
                        Duyệt
                      </button>
                      <button className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors">
                        Từ chối
                      </button>
                    </>
                  )}
                  {request.status === "Đã duyệt" && (
                    <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors">
                      Xuất kho
                    </button>
                  )}
                  <button className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600 transition-colors">
                    Chi tiết
                  </button>
                </div>
              </div>
              
              <div className="border-t border-gray-100 pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Danh sách vật tư:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {request.items.map((item, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-3">
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        Số lượng: {item.quantity.toLocaleString()} {item.unit}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {requests.length === 0 && (
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
    </DashboardLayout>
  );
}