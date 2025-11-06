"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Header from "@/components/layout/Header";
import RequestDetailModal from "@/components/requests/RequestDetailModal";

interface Material {
  name: string;
  unit: string;
  quantity: number;
}

interface EquipmentMaterials {
  equipment_machinery_name: string;
  consumable_supplies: Record<string, Material>;
  replacement_materials: Record<string, Material>;
}

interface Request {
  id: string;
  project: string;
  maintenance_tier: string;
  maintenance_number: string;
  year: number;
  sector: string;
  description: string;
  materials_for_equipment: Record<string, EquipmentMaterials>;
  requested_by: string;
  requested_at: number;
  num_of_request: number;
}

export default function RequestsPage() {
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetail = (request: Request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
  };
  const requests: Request[] = [
    { 
      id: "690b51613fc7e1236bdb63e4", 
      project: "T5",
      maintenance_tier: "SCCN", 
      maintenance_number: "1",
      year: 2025,
      sector: "Vũ khí", 
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi vitae eros leo. Nulla a ornare mauris. Integer ornare ligula arcu.",
      materials_for_equipment: {
        "68ff87babb369dc54f8cdcdb": {
          equipment_machinery_name: "Thiết bị Тest 1",
          consumable_supplies: {
            "Băng keo giấy 5cm": {
              "name": "Băng keo giấy 5cm",
              "unit": "cuộn",
              "quantity": 10
            },
            "Khẩu trang hoạt tính": {
              "name": "Khẩu trang hoạt tính",
              "unit": "cái",
              "quantity": 10
            }
          },
          replacement_materials: {
            "Cầu chì 27B, 3A": {
              "name": "Cầu chì 27B, 3A",
              "unit": "cái",
              "quantity": 3
            },
            "Đầu cos tròn Ø6": {
              "name": "Đầu cos tròn Ø6",
              "unit": "bịch",
              "quantity": 1
            }
          }
        }
      },
      requested_by: "tranbao",
      requested_at: 1729238400,
      num_of_request: 1
    },
    { 
      id: "690b51613fc7e1236bdb3364", 
      project: "T5",
      maintenance_tier: "SCCN", 
      maintenance_number: "1",
      year: 2025,
      sector: "Vũ khí", 
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tincidunt lectus vitae viverra elementum. Aenean iaculis fringilla leo non tempor. Nam a efficitur massa. Etiam sed commodo libero, at sollicitudin ligula. Nam et varius lorem, ac viverra velit. Proin pellentesque urna odio, ut facilisis arcu viverra vel. Quisque quis lacus sagittis, faucibus velit vitae, porttitor diam. ",
      materials_for_equipment: {
        "68ff87babb369dc54f8cdcdb": {
          equipment_machinery_name: "Thiết bị Тest",
          consumable_supplies: {
            "Băng keo giấy 5cm": {
              "name": "Băng keo giấy 5cm",
              "unit": "cuộn",
              "quantity": 10
            },
            "Khẩu trang hoạt tính": {
              "name": "Khẩu trang hoạt tính",
              "unit": "cái",
              "quantity": 10
            }
          },
          replacement_materials: {
            "Cầu chì 27B, 3A": {
              "name": "Cầu chì 27B, 3A",
              "unit": "cái",
              "quantity": 3
            },
            "Đầu cos tròn Ø6": {
              "name": "Đầu cos tròn Ø6",
              "unit": "bịch",
              "quantity": 1
            }
          }
        },
         "68ff87babb369dc54f8cd2cdb": {
          equipment_machinery_name: "Thiết bị Тest 3",
          consumable_supplies: {
            "Băng keo giấy 5cm": {
              "name": "Băng keo giấy 5cm",
              "unit": "cuộn",
              "quantity": 10
            },
            "Khẩu trang hoạt tính": {
              "name": "Khẩu trang hoạt tính",
              "unit": "cái",
              "quantity": 10
            }
          },
          replacement_materials: {
            "Cầu chì 27B, 3A": {
              "name": "Cầu chì 27B, 3A",
              "unit": "cái",
              "quantity": 3
            },
            "Đầu cos tròn Ø6": {
              "name": "Đầu cos tròn Ø6",
              "unit": "bịch",
              "quantity": 1
            },
            "Đầu cos tròn Ø2": {
              "name": "Đầu cos tròn Ø2",
              "unit": "bịch",
              "quantity": 1
            }
          }
        }
      },
      requested_by: "tranbao",
      requested_at: 1729238400,
      num_of_request: 0
    }
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
                <p className="text-sm font-medium text-gray-500">Đã duyệt</p>
                <p className="text-xl font-semibold text-gray-900">
                  {requests.filter(r => r.num_of_request > 0).length}
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
          {requests.map((request) => (
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
                      <button className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition-colors">
                        Duyệt
                      </button>
                      <button className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors">
                        Hủy
                      </button>
                    </>
                  )}
                  {/* {request.status === "Đã duyệt" && (
                    <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors">
                      Xuất kho
                    </button>
                  )} */}
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
                          <span>VT tiêu hao: <span className="font-semibold text-blue-600">{Object.keys(item.consumable_supplies).length}</span></span>
                          <span>VT thay thế: <span className="font-semibold text-green-600">{Object.keys(item.replacement_materials).length}</span></span>
                        </div>
                      </div>
                    ))}
                  </div>
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

      {/* Request Detail Modal */}
      <RequestDetailModal
        request={selectedRequest}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </DashboardLayout>
  );
}