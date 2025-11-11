"use client";

import { useState, useEffect } from "react";
import { materialRequestService } from "@/services";
import { MaterialRequest, MaterialsForEquipment } from "@/types/api";

interface RequestDetailModalProps {
  request: MaterialRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: () => void;
}

export default function RequestDetailModal({ request, isOpen, onClose, onUpdate }: RequestDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState("");
  const [editedMaterials, setEditedMaterials] = useState<Record<string, MaterialsForEquipment>>({});
  const [loading, setLoading] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [requestNumber, setRequestNumber] = useState("");

  useEffect(() => {
    if (request) {
      setEditedDescription(request.description || "");
      // Convert MaterialsForEquipmentRes to MaterialsForEquipment for editing
      const materials: Record<string, MaterialsForEquipment> = {};
      Object.entries(request.materials_for_equipment).forEach(([id, equipment]) => {
        materials[id] = {
          consumable_supplies: equipment.consumable_supplies,
          replacement_materials: equipment.replacement_materials
        };
      });
      setEditedMaterials(materials);
    }
  }, [request]);

  if (!isOpen || !request) return null;

  const handleSave = async () => {
    try {
      setLoading(true);
      await materialRequestService.updateMaterialRequest({
        id: request.id,
        description: editedDescription,
        materials_for_equipment: editedMaterials
      });
      alert("Cập nhật yêu cầu vật tư thành công!");
      setIsEditing(false);
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error("Error updating material request:", error);
      alert("Có lỗi xảy ra khi cập nhật yêu cầu vật tư");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedDescription(request.description || "");
    // Reset materials
    const materials: Record<string, MaterialsForEquipment> = {};
    Object.entries(request.materials_for_equipment).forEach(([id, equipment]) => {
      materials[id] = {
        consumable_supplies: equipment.consumable_supplies,
        replacement_materials: equipment.replacement_materials
      };
    });
    setEditedMaterials(materials);
    setIsEditing(false);
  };

  const handleQuantityChange = (equipmentId: string, materialType: 'consumable_supplies' | 'replacement_materials', materialName: string, newQuantity: number) => {
    setEditedMaterials(prev => {
      const updated = { ...prev };
      if (!updated[equipmentId]) {
        updated[equipmentId] = {};
      }
      if (!updated[equipmentId][materialType]) {
        updated[equipmentId][materialType] = {};
      }
      if (updated[equipmentId][materialType]![materialName]) {
        updated[equipmentId][materialType]![materialName] = {
          ...updated[equipmentId][materialType]![materialName],
          quantity: newQuantity
        };
      }
      return updated;
    });
  };

  const handleApproveRequest = async () => {
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
        material_request_id: request.id,
        num_of_request: numOfRequest
      });
      alert("Duyệt yêu cầu vật tư thành công!");
      setShowApproveModal(false);
      setRequestNumber("");
      if (onUpdate) {
        onUpdate();
      }
      onClose();
    } catch (error) {
      console.error("Error approving material request:", error);
      alert("Có lỗi xảy ra khi duyệt yêu cầu vật tư");
    } finally {
      setLoading(false);
    }
  };

  const canEdit = request.num_of_request === 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              Chi tiết yêu cầu vật tư
              {isEditing && <span className="text-base text-orange-600 font-normal">(Đang chỉnh sửa)</span>}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              #{`${request.project}/${request.maintenance_tier}/${request.sector}/${request.year}/${request.num_of_request > 0 ? request.num_of_request : ""}`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {canEdit && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Chỉnh sửa
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
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
              {isEditing ? (
                <textarea
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  className="w-full min-h-[100px] p-4 border-2 border-orange-400 bg-orange-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-600 hover:border-orange-500 transition-colors text-gray-900"
                  placeholder="Nhập nội dung yêu cầu..."
                />
              ) : (
                <p className="text-gray-900 whitespace-pre-wrap">{request.description}</p>
              )}
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
                        <span className="font-medium">VT tiêu hao:</span> {Object.keys(equipment.consumable_supplies || {}).length}
                      </span>
                      <span className="text-green-600">
                        <span className="font-medium">VT thay thế:</span> {Object.keys(equipment.replacement_materials || {}).length}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    {/* Consumable Supplies */}
                    {Object.keys(equipment.consumable_supplies || {}).length > 0 && (
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
                              {Object.entries(isEditing && editedMaterials[equipmentId]?.consumable_supplies 
                                ? editedMaterials[equipmentId].consumable_supplies! 
                                : equipment.consumable_supplies ?? {}).map(([materialName, material], index) => (
                                <tr key={materialName} className="hover:bg-gray-50">
                                  <td className="px-4 py-3 text-sm text-gray-900 text-center">{index + 1}</td>
                                  <td className="px-4 py-3 text-sm text-gray-900">{material.name}</td>
                                  <td className="px-4 py-3 text-sm text-gray-600 text-center">{material.unit}</td>
                                  <td className="px-4 py-3 text-sm text-gray-900 text-center font-medium">
                                    {isEditing ? (
                                      <input
                                        type="number"
                                        min="0"
                                        value={material.quantity}
                                        onChange={(e) => handleQuantityChange(equipmentId, 'consumable_supplies', materialName, parseInt(e.target.value) || 0)}
                                        className="w-24 px-3 py-2 border-2 border-blue-400 bg-blue-50 rounded-lg text-center font-semibold text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-600 hover:border-blue-500 transition-colors"
                                      />
                                    ) : (
                                      material.quantity.toLocaleString()
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Replacement Materials */}
                    {Object.keys(equipment.replacement_materials || {}).length > 0 && (
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
                              {Object.entries(isEditing && editedMaterials[equipmentId]?.replacement_materials 
                                ? editedMaterials[equipmentId].replacement_materials! 
                                : equipment.replacement_materials ?? {}).map(([materialName, material], index) => (
                                <tr key={materialName} className="hover:bg-gray-50">
                                  <td className="px-4 py-3 text-sm text-gray-900 text-center">{index + 1}</td>
                                  <td className="px-4 py-3 text-sm text-gray-900">{material.name}</td>
                                  <td className="px-4 py-3 text-sm text-gray-600 text-center">{material.unit}</td>
                                  <td className="px-4 py-3 text-sm text-gray-900 text-center font-medium">
                                    {isEditing ? (
                                      <input
                                        type="number"
                                        min="0"
                                        value={material.quantity}
                                        onChange={(e) => handleQuantityChange(equipmentId, 'replacement_materials', materialName, parseInt(e.target.value) || 0)}
                                        className="w-24 px-3 py-2 border-2 border-green-400 bg-green-50 rounded-lg text-center font-semibold text-green-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-600 hover:border-green-500 transition-colors"
                                      />
                                    ) : (
                                      material.quantity.toLocaleString()
                                    )}
                                  </td>
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
            {isEditing ? (
              <>
                <button 
                  onClick={handleSave}
                  disabled={loading}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {loading ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
                <button 
                  onClick={handleCancelEdit}
                  disabled={loading}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Hủy bỏ
                </button>
              </>
            ) : (
              <>
                {request.num_of_request === 0 && (
                  <>
                    <button 
                      onClick={() => setShowApproveModal(true)}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center"
                    >
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
              </>
            )}
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Đóng
          </button>
        </div>
      </div>

      {/* Approve Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Duyệt yêu cầu vật tư</h3>
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
    </div>
  );
}
