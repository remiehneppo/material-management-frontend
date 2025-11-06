"use client";

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

interface RequestDetailModalProps {
  request: Request | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function RequestDetailModal({ request, isOpen, onClose }: RequestDetailModalProps) {
  if (!isOpen || !request) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Chi tiết yêu cầu vật tư</h2>
            <p className="text-sm text-gray-500 mt-1">
              #{`${request.project}/${request.maintenance_tier}/${request.sector}/${request.year}/${request.num_of_request > 0 ? request.num_of_request : ""}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-6">
          {/* Status and Basic Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Thông tin chung</h3>
              <span className={`px-3 py-1 text-sm rounded-full ${
                request.num_of_request === 0 
                  ? "bg-yellow-100 text-yellow-800"
                  : request.num_of_request > 0
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}>
                {request.num_of_request === 0 ? "Chờ duyệt" : request.num_of_request > 0 ? "Đã duyệt" : "Từ chối"}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Dự án</p>
                <p className="font-medium text-gray-900">{request.project}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Bậc SCCN</p>
                <p className="font-medium text-gray-900">{request.maintenance_tier}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Ngành</p>
                <p className="font-medium text-gray-900">{request.sector}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Năm</p>
                <p className="font-medium text-gray-900">{request.year}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Người yêu cầu</p>
                <p className="font-medium text-gray-900">{request.requested_by}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Ngày tạo</p>
                <p className="font-medium text-gray-900">{new Date(request.requested_at * 1000).toLocaleString('vi-VN')}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Nội dung yêu cầu</h3>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <p className="text-gray-900 whitespace-pre-wrap">{request.description}</p>
            </div>
          </div>

          {/* Equipment and Materials */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Danh sách thiết bị và vật tư</h3>
            <div className="space-y-4">
              {Object.entries(request.materials_for_equipment).map(([equipmentId, equipment]) => (
                <div key={equipmentId} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  {/* Equipment Header */}
                  <div className="bg-gradient-to-r from-cyan-50 to-blue-50 px-4 py-3 border-b border-gray-200">
                    <h4 className="font-semibold text-gray-900 text-lg">{equipment.equipment_machinery_name}</h4>
                    <div className="flex gap-4 mt-2 text-sm">
                      <span className="text-blue-600">
                        <span className="font-medium">VT tiêu hao:</span> {Object.keys(equipment.consumable_supplies).length}
                      </span>
                      <span className="text-green-600">
                        <span className="font-medium">VT thay thế:</span> {Object.keys(equipment.replacement_materials).length}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    {/* Consumable Supplies */}
                    {Object.keys(equipment.consumable_supplies).length > 0 && (
                      <div className="mb-4">
                        <h5 className="font-medium text-gray-700 mb-3 flex items-center">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                          Vật tư tiêu hao
                        </h5>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-16">STT</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên vật tư</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Đơn vị</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Số lượng</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {Object.values(equipment.consumable_supplies).map((material, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                  <td className="px-4 py-3 text-sm text-gray-900 text-center">{index + 1}</td>
                                  <td className="px-4 py-3 text-sm text-gray-900">{material.name}</td>
                                  <td className="px-4 py-3 text-sm text-gray-600 text-center">{material.unit}</td>
                                  <td className="px-4 py-3 text-sm text-gray-900 text-center font-medium">{material.quantity.toLocaleString()}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Replacement Materials */}
                    {Object.keys(equipment.replacement_materials).length > 0 && (
                      <div>
                        <h5 className="font-medium text-gray-700 mb-3 flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                          Vật tư thay thế
                        </h5>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-16">STT</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên vật tư</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Đơn vị</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Số lượng</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {Object.values(equipment.replacement_materials).map((material, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                  <td className="px-4 py-3 text-sm text-gray-900 text-center">{index + 1}</td>
                                  <td className="px-4 py-3 text-sm text-gray-900">{material.name}</td>
                                  <td className="px-4 py-3 text-sm text-gray-600 text-center">{material.unit}</td>
                                  <td className="px-4 py-3 text-sm text-gray-900 text-center font-medium">{material.quantity.toLocaleString()}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex space-x-2">
            {request.num_of_request === 0 && (
              <>
                <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Duyệt yêu cầu
                </button>
                <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Hủy yêu cầu
                </button>
              </>
            )}
            {/* {request.num_of_request > 0 && (
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                Xuất kho
              </button>
            )} */}
          </div>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
