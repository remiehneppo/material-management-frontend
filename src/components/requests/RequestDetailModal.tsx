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

// Icon Components
const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const EditIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const SaveIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const DownloadIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const CancelIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const WarningIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

export default function RequestDetailModal({ request, isOpen, onClose, onUpdate }: RequestDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState("");
  const [editedMaterials, setEditedMaterials] = useState<Record<string, MaterialsForEquipment>>({});
  const [loading, setLoading] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [requestNumber, setRequestNumber] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);

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

  const handleCancelRequest = async () => {
    try {
      setLoading(true);
      await materialRequestService.cancelMaterialRequest(request.id);
      alert("Hủy yêu cầu vật tư thành công!");
      setShowCancelModal(false);
      if (onUpdate) {
        onUpdate();
      }
      onClose();
    } catch (error) {
      console.error("Error canceling material request:", error);
      alert("Có lỗi xảy ra khi hủy yêu cầu vật tư");
    } finally {
      setLoading(false);
    }
  };

  const handleExportRequest = async () => {
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

  const canEdit = request.num_of_request === 0;

  // Get status badge color
  const getStatusBadge = () => {
    if (request.num_of_request === 0) {
      return {
        bg: 'bg-gradient-to-r from-yellow-100 to-amber-100',
        text: 'text-yellow-800',
        border: 'border-yellow-200',
        icon: '⏳',
        label: 'Chờ duyệt'
      };
    } else if (request.num_of_request > 0) {
      return {
        bg: 'bg-gradient-to-r from-green-100 to-emerald-100',
        text: 'text-green-800',
        border: 'border-green-200',
        icon: '✅',
        label: 'Đã duyệt'
      };
    } else {
      return {
        bg: 'bg-gradient-to-r from-red-100 to-rose-100',
        text: 'text-red-800',
        border: 'border-red-200',
        icon: '❌',
        label: 'Từ chối'
      };
    }
  };

  const statusBadge = getStatusBadge();

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-slideUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 px-8 py-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24"></div>
          
          <div className="relative z-10">
            <div className="flex items-start justify-between gap-6">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold flex flex-wrap items-center gap-3">
                      Chi tiết yêu cầu vật tư
                      {isEditing && (
                        <span className="text-sm bg-orange-500/90 backdrop-blur-sm px-3 py-1 rounded-full font-medium animate-pulse">
                          ✏️ Đang chỉnh sửa
                        </span>
                      )}
                    </h2>
                    <p className="text-white/90 text-sm mt-2 font-mono break-all">
                      #{`${request.project}/${request.maintenance_tier}/${request.sector}/${request.year}${request.num_of_request > 0 ? `/${request.num_of_request}` : ""}`}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-3 flex-shrink-0">
                {canEdit && !isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2.5 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all duration-300 flex items-center gap-2 font-medium border border-white/30 hover:scale-105 whitespace-nowrap"
                  >
                    <EditIcon />
                    Chỉnh sửa
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="text-white/80 hover:text-white hover:bg-white/20 p-2.5 rounded-xl transition-all duration-300 flex-shrink-0"
                >
                  <CloseIcon />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-8">
          {/* Status and Basic Info */}
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 mb-6 border border-gray-200 shadow-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                📋 Thông tin chung
              </h3>
              <div className={`${statusBadge.bg} ${statusBadge.text} px-4 py-2 rounded-xl font-bold text-sm border-2 ${statusBadge.border} shadow-md flex items-center gap-2`}>
                <span className="text-lg">{statusBadge.icon}</span>
                {statusBadge.label}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-4 border border-blue-100 hover:shadow-md transition-all duration-300">
                <p className="text-xs font-bold text-gray-500 mb-2">🏗️ Dự án</p>
                <p className="font-bold text-gray-900 text-lg">{request.project}</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-blue-100 hover:shadow-md transition-all duration-300">
                <p className="text-xs font-bold text-gray-500 mb-2">📊 Cấp Sửa chữa</p>
                <p className="font-bold text-gray-900 text-lg">{request.maintenance_tier}</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-blue-100 hover:shadow-md transition-all duration-300">
                <p className="text-xs font-bold text-gray-500 mb-2">🏭 Ngành</p>
                <p className="font-bold text-gray-900 text-lg">{request.sector}</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-blue-100 hover:shadow-md transition-all duration-300">
                <p className="text-xs font-bold text-gray-500 mb-2">📅 Năm</p>
                <p className="font-bold text-gray-900 text-lg">{request.year}</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-blue-100 hover:shadow-md transition-all duration-300">
                <p className="text-xs font-bold text-gray-500 mb-2">👤 Người yêu cầu</p>
                <p className="font-bold text-gray-900 text-lg">{request.requested_by}</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-blue-100 hover:shadow-md transition-all duration-300">
                <p className="text-xs font-bold text-gray-500 mb-2">🕒 Ngày tạo</p>
                <p className="font-bold text-gray-900">{new Date(request.requested_at * 1000).toLocaleString('vi-VN')}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              📝 Nội dung yêu cầu
            </h3>
            <div className={`rounded-2xl p-6 border-2 shadow-md ${isEditing ? 'bg-gradient-to-br from-orange-50 to-amber-50 border-orange-300' : 'bg-white border-gray-200'}`}>
              {isEditing ? (
                <textarea
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  className="w-full min-h-[120px] p-4 border-2 border-orange-400 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-600 hover:border-orange-500 transition-all duration-300 text-gray-900 font-medium resize-none"
                  placeholder="Nhập nội dung yêu cầu..."
                />
              ) : (
                <p className="text-gray-900 whitespace-pre-wrap">{request.description}</p>
              )}
            </div>
          </div>

          {/* Equipment and Materials */}
          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              🔧 Danh sách thiết bị và vật tư
            </h3>
            <div className="space-y-5">
              {Object.entries(request.materials_for_equipment).map(([equipmentId, equipment]) => (
                <div key={equipmentId} className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                  {/* Equipment Header */}
                  <div className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 px-6 py-4">
                    <h4 className="font-bold text-white text-xl mb-2">{equipment.equipment_machinery_name}</h4>
                    <div className="flex gap-6 text-sm">
                      <span className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-white">
                        <span className="text-lg">💧</span>
                        <span className="font-semibold">VT tiêu hao:</span> 
                        <span className="font-bold">{Object.keys(equipment.consumable_supplies || {}).length}</span>
                      </span>
                      <span className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-white">
                        <span className="text-lg">🔧</span>
                        <span className="font-semibold">VT thay thế:</span> 
                        <span className="font-bold">{Object.keys(equipment.replacement_materials || {}).length}</span>
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Consumable Supplies */}
                    {Object.keys(equipment.consumable_supplies || {}).length > 0 && (
                      <div className="mb-6">
                        <h5 className="font-bold text-gray-800 mb-3 flex items-center text-lg">
                          <span className="text-xl mr-2">💧</span>
                          Vật tư tiêu hao
                        </h5>
                        <div className="overflow-x-auto rounded-xl border-2 border-blue-100">
                          <table className="min-w-full divide-y divide-blue-100">
                            <thead className="bg-gradient-to-r from-blue-50 to-cyan-50">
                              <tr>
                                <th className="px-4 py-3 text-center text-xs font-bold text-blue-700 uppercase tracking-wider w-16">STT</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Tên vật tư</th>
                                <th className="px-4 py-3 text-center text-xs font-bold text-blue-700 uppercase tracking-wider w-32">Đơn vị</th>
                                <th className="px-4 py-3 text-center text-xs font-bold text-blue-700 uppercase tracking-wider w-32">Số lượng</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-blue-50">
                              {Object.entries(isEditing && editedMaterials[equipmentId]?.consumable_supplies 
                                ? editedMaterials[equipmentId].consumable_supplies! 
                                : equipment.consumable_supplies ?? {}).map(([materialName, material], index) => (
                                <tr key={materialName} className="hover:bg-blue-50 transition-colors duration-200">
                                  <td className="px-4 py-3.5 text-sm font-bold text-blue-600 text-center">{index + 1}</td>
                                  <td className="px-4 py-3.5 text-sm font-medium text-gray-900">{material.name}</td>
                                  <td className="px-4 py-3.5 text-sm text-gray-600 text-center font-medium">{material.unit}</td>
                                  <td className="px-4 py-3.5 text-sm text-gray-900 text-center font-bold">
                                    {isEditing ? (
                                      <input
                                        type="number"
                                        min="0"
                                        value={material.quantity}
                                        onChange={(e) => handleQuantityChange(equipmentId, 'consumable_supplies', materialName, parseInt(e.target.value) || 0)}
                                        className="w-24 px-3 py-2 border-2 border-blue-400 bg-blue-50 rounded-lg text-center font-bold text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-600 hover:border-blue-500 transition-all duration-300"
                                      />
                                    ) : (
                                      <span className="text-blue-700">{material.quantity.toLocaleString()}</span>
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
                        <h5 className="font-bold text-gray-800 mb-3 flex items-center text-lg">
                          <span className="text-xl mr-2">🔧</span>
                          Vật tư thay thế
                        </h5>
                        <div className="overflow-x-auto rounded-xl border-2 border-green-100">
                          <table className="min-w-full divide-y divide-green-100">
                            <thead className="bg-gradient-to-r from-green-50 to-emerald-50">
                              <tr>
                                <th className="px-4 py-3 text-center text-xs font-bold text-green-700 uppercase tracking-wider w-16">STT</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-green-700 uppercase tracking-wider">Tên vật tư</th>
                                <th className="px-4 py-3 text-center text-xs font-bold text-green-700 uppercase tracking-wider w-32">Đơn vị</th>
                                <th className="px-4 py-3 text-center text-xs font-bold text-green-700 uppercase tracking-wider w-32">Số lượng</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-green-50">
                              {Object.entries(isEditing && editedMaterials[equipmentId]?.replacement_materials 
                                ? editedMaterials[equipmentId].replacement_materials! 
                                : equipment.replacement_materials ?? {}).map(([materialName, material], index) => (
                                <tr key={materialName} className="hover:bg-green-50 transition-colors duration-200">
                                  <td className="px-4 py-3.5 text-sm font-bold text-green-600 text-center">{index + 1}</td>
                                  <td className="px-4 py-3.5 text-sm font-medium text-gray-900">{material.name}</td>
                                  <td className="px-4 py-3.5 text-sm text-gray-600 text-center font-medium">{material.unit}</td>
                                  <td className="px-4 py-3.5 text-sm text-gray-900 text-center font-bold">
                                    {isEditing ? (
                                      <input
                                        type="number"
                                        min="0"
                                        value={material.quantity}
                                        onChange={(e) => handleQuantityChange(equipmentId, 'replacement_materials', materialName, parseInt(e.target.value) || 0)}
                                        className="w-24 px-3 py-2 border-2 border-green-400 bg-green-50 rounded-lg text-center font-bold text-green-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-600 hover:border-green-500 transition-all duration-300"
                                      />
                                    ) : (
                                      <span className="text-green-700">{material.quantity.toLocaleString()}</span>
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
        <div className="flex justify-between items-center p-6 border-t-2 border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
          <div className="flex flex-wrap gap-3">
            {isEditing ? (
              <>
                <button 
                  onClick={handleSave}
                  disabled={loading}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl font-bold transform hover:scale-105"
                >
                  <SaveIcon />
                  {loading ? "Đang lưu..." : "💾 Lưu thay đổi"}
                </button>
                <button 
                  onClick={handleCancelEdit}
                  disabled={loading}
                  className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl font-bold transform hover:scale-105"
                >
                  <CancelIcon />
                  Hủy bỏ
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={handleExportRequest}
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl font-bold transform hover:scale-105"
                >
                  <DownloadIcon />
                  {loading ? "Đang xuất..." : "📄 Xuất file DOCX"}
                </button>
                {request.num_of_request === 0 && (
                  <>
                    <button 
                      onClick={() => setShowApproveModal(true)}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl font-bold transform hover:scale-105"
                    >
                      <CheckIcon />
                      ✅ Duyệt yêu cầu
                    </button>
                    <button 
                      onClick={() => setShowCancelModal(true)}
                      className="bg-gradient-to-r from-red-500 to-rose-500 text-white px-6 py-3 rounded-xl hover:from-red-600 hover:to-rose-600 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl font-bold transform hover:scale-105"
                    >
                      <CancelIcon />
                      ❌ Hủy yêu cầu
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
            className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl font-bold transform hover:scale-105"
          >
            Đóng
          </button>
        </div>
      </div>

      {/* Approve Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-slideUp">
            {/* Gradient Header */}
            <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
              <h3 className="text-2xl font-bold text-white relative z-10 flex items-center gap-3">
                <CheckIcon />
                ✅ Duyệt yêu cầu vật tư
              </h3>
            </div>

            <div className="p-6">
              <p className="text-gray-700 mb-6 font-medium text-lg">
                Nhập số yêu cầu vật tư để xác nhận duyệt:
              </p>
              <input
                type="number"
                min="1"
                value={requestNumber}
                onChange={(e) => setRequestNumber(e.target.value)}
                placeholder="Nhập số yêu cầu (VD: 1, 2, 3...)"
                className="w-full px-5 py-4 border-2 border-green-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-green-50 text-xl font-bold text-gray-900 transition-all duration-300"
                autoFocus
              />
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowApproveModal(false);
                    setRequestNumber("");
                  }}
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-bold shadow-lg transform hover:scale-105"
                >
                  Hủy
                </button>
                <button
                  onClick={handleApproveRequest}
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-bold shadow-lg transform hover:scale-105"
                >
                  <CheckIcon />
                  {loading ? "Đang duyệt..." : "Xác nhận duyệt"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-slideUp">
            {/* Gradient Warning Header */}
            <div className="bg-gradient-to-r from-red-500 via-rose-500 to-pink-500 p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <WarningIcon />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">⚠️ Xác nhận hủy yêu cầu</h3>
                  <p className="text-sm text-white/80 mt-1 font-mono">
                    #{`${request.project}/${request.maintenance_tier}/${request.sector}/${request.year}`}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <p className="text-gray-700 mb-6 font-medium text-lg">
                Bạn có chắc chắn muốn hủy yêu cầu vật tư này? Hành động này không thể hoàn tác.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-bold shadow-lg transform hover:scale-105"
                >
                  Không, giữ lại
                </button>
                <button
                  onClick={handleCancelRequest}
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl hover:from-red-600 hover:to-rose-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-bold shadow-lg transform hover:scale-105"
                >
                  <CancelIcon />
                  {loading ? "Đang hủy..." : "Có, hủy yêu cầu"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
