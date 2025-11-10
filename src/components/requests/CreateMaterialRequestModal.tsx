"use client";

import { useState, useEffect } from "react";
import { maintenanceService, materialsProfileService, materialRequestService } from "@/services";
import { Maintenance, MaterialsProfile, Material, SECTORS } from "@/types/api";

interface CreateMaterialRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface SelectedMaterial {
  name: string;
  quantity: number;
  unit: string;
}

interface SelectedEquipmentMaterials {
  equipment_machinery_id: string;
  equipment_machinery_name: string;
  consumable_supplies: Record<string, SelectedMaterial>;
  replacement_materials: Record<string, SelectedMaterial>;
}

export default function CreateMaterialRequestModal({ isOpen, onClose, onSuccess }: CreateMaterialRequestModalProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMaintenances, setLoadingMaintenances] = useState(false);
  const [loadingProfiles, setLoadingProfiles] = useState(false);
  
  // Form data
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [selectedMaintenance, setSelectedMaintenance] = useState<Maintenance | null>(null);
  const [selectedSector, setSelectedSector] = useState("");
  const [description, setDescription] = useState("");
  
  // Materials profiles and selection
  const [materialsProfiles, setMaterialsProfiles] = useState<MaterialsProfile[]>([]);
  const [selectedEquipments, setSelectedEquipments] = useState<Record<string, SelectedEquipmentMaterials>>({});
  
  // Modal for adding materials to selected equipment
  const [showAddMaterialModal, setShowAddMaterialModal] = useState(false);
  const [currentEquipmentId, setCurrentEquipmentId] = useState<string | null>(null);
  const [materialType, setMaterialType] = useState<"consumable" | "replacement">("consumable");
  
  // New material form
  const [newMaterialName, setNewMaterialName] = useState("");
  const [newMaterialQuantity, setNewMaterialQuantity] = useState("");
  const [newMaterialUnit, setNewMaterialUnit] = useState("");
  
  // For editing quantity from estimate
  const [editingEstimateMaterial, setEditingEstimateMaterial] = useState<Material | null>(null);
  const [editQuantity, setEditQuantity] = useState("");


  useEffect(() => {
    if (isOpen) {
      loadMaintenances();
    } else {
      resetForm();
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedMaintenance && selectedSector) {
      loadMaterialsProfiles();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMaintenance, selectedSector]);

  const resetForm = () => {
    setStep(1);
    setSelectedMaintenance(null);
    setSelectedSector("");
    setDescription("");
    setMaterialsProfiles([]);
    setSelectedEquipments({});
  };

  const loadMaintenances = async () => {
    try {
      setLoadingMaintenances(true);
      const response = await maintenanceService.getAll();
      if (response.data) {
        setMaintenances(response.data);
      }
    } catch (error) {
      console.error("Error loading maintenances:", error);
      alert("Không thể tải danh sách dự án");
    } finally {
      setLoadingMaintenances(false);
    }
  };

  const loadMaterialsProfiles = async () => {
    if (!selectedMaintenance || !selectedSector) return;
    
    try {
      setLoadingProfiles(true);
      const response = await materialsProfileService.filter({
        maintenance_ids: [selectedMaintenance.id],
        sector: selectedSector
      });
      if (response.data) {
        setMaterialsProfiles(response.data);
      }
    } catch (error) {
      console.error("Error loading materials profiles:", error);
      alert("Không thể tải danh sách hạng mục");
    } finally {
      setLoadingProfiles(false);
    }
  };

  const handleSelectProfile = (profile: MaterialsProfile) => {
    const equipmentId = profile.id;
    
    if (selectedEquipments[equipmentId]) {
      // Remove if already selected
      const newSelected = { ...selectedEquipments };
      delete newSelected[equipmentId];
      setSelectedEquipments(newSelected);
    } else {
      // Add with empty materials initially
      setSelectedEquipments({
        ...selectedEquipments,
        [equipmentId]: {
          equipment_machinery_id: equipmentId,
          equipment_machinery_name: profile.equipment_machinery,
          consumable_supplies: {},
          replacement_materials: {}
        }
      });
    }
  };

  const handleOpenAddMaterial = (equipmentId: string, type: "consumable" | "replacement") => {
    setCurrentEquipmentId(equipmentId);
    setMaterialType(type);
    setShowAddMaterialModal(true);
  };

  const handleSelectEstimateMaterial = (material: Material) => {
    setEditingEstimateMaterial(material);
    setEditQuantity(material.quantity.toString());
  };

  const handleAddMaterialFromEstimate = () => {
    if (!currentEquipmentId || !editingEstimateMaterial || !editQuantity) return;
    
    const equipment = selectedEquipments[currentEquipmentId];
    if (!equipment) return;

    const updatedEquipment = { ...equipment };
    const quantity = parseFloat(editQuantity);
    
    if (materialType === "consumable") {
      updatedEquipment.consumable_supplies = {
        ...updatedEquipment.consumable_supplies,
        [editingEstimateMaterial.name]: {
          name: editingEstimateMaterial.name,
          quantity: quantity,
          unit: editingEstimateMaterial.unit
        }
      };
    } else {
      updatedEquipment.replacement_materials = {
        ...updatedEquipment.replacement_materials,
        [editingEstimateMaterial.name]: {
          name: editingEstimateMaterial.name,
          quantity: quantity,
          unit: editingEstimateMaterial.unit
        }
      };
    }

    setSelectedEquipments({
      ...selectedEquipments,
      [currentEquipmentId]: updatedEquipment
    });
    
    // Reset
    setEditingEstimateMaterial(null);
    setEditQuantity("");
    setShowAddMaterialModal(false);
  };

  const handleAddNewMaterial = () => {
    if (!currentEquipmentId || !newMaterialName || !newMaterialQuantity || !newMaterialUnit) {
      alert("Vui lòng điền đầy đủ thông tin vật tư");
      return;
    }

    const equipment = selectedEquipments[currentEquipmentId];
    if (!equipment) return;

    const updatedEquipment = { ...equipment };
    const material: SelectedMaterial = {
      name: newMaterialName,
      quantity: parseFloat(newMaterialQuantity),
      unit: newMaterialUnit
    };

    if (materialType === "consumable") {
      updatedEquipment.consumable_supplies = {
        ...updatedEquipment.consumable_supplies,
        [material.name]: material
      };
    } else {
      updatedEquipment.replacement_materials = {
        ...updatedEquipment.replacement_materials,
        [material.name]: material
      };
    }

    setSelectedEquipments({
      ...selectedEquipments,
      [currentEquipmentId]: updatedEquipment
    });

    // Reset form
    setNewMaterialName("");
    setNewMaterialQuantity("");
    setNewMaterialUnit("");
    setShowAddMaterialModal(false);
  };

  const handleRemoveMaterial = (equipmentId: string, materialName: string, type: "consumable" | "replacement") => {
    const equipment = selectedEquipments[equipmentId];
    if (!equipment) return;

    const updatedEquipment = { ...equipment };
    
    if (type === "consumable") {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [materialName]: _, ...rest } = updatedEquipment.consumable_supplies;
      updatedEquipment.consumable_supplies = rest;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [materialName]: _, ...rest } = updatedEquipment.replacement_materials;
      updatedEquipment.replacement_materials = rest;
    }

    setSelectedEquipments({
      ...selectedEquipments,
      [equipmentId]: updatedEquipment
    });
  };

  const getCurrentProfileEstimate = (): Material[] => {
    if (!currentEquipmentId) return [];
    
    const profile = materialsProfiles.find(p => p.id === currentEquipmentId);
    if (!profile) return [];

    const materials: Material[] = [];
    
    if (materialType === "consumable" && profile.estimate.consumable_supplies) {
      Object.values(profile.estimate.consumable_supplies).forEach(m => materials.push(m));
    } else if (materialType === "replacement" && profile.estimate.replacement_materials) {
      Object.values(profile.estimate.replacement_materials).forEach(m => materials.push(m));
    }

    return materials;
  };

  const handleSubmit = async () => {
    if (!selectedMaintenance || !selectedSector || Object.keys(selectedEquipments).length === 0) {
      alert("Vui lòng điền đầy đủ thông tin và chọn ít nhất một hạng mục");
      return;
    }

    // Check if all selected equipments have at least one material
    const hasEmptyEquipment = Object.values(selectedEquipments).some(eq => 
      Object.keys(eq.consumable_supplies).length === 0 && 
      Object.keys(eq.replacement_materials).length === 0
    );

    if (hasEmptyEquipment) {
      alert("Mỗi hạng mục phải có ít nhất một vật tư");
      return;
    }

    try {
      setLoading(true);
      
      // Transform data to match API format
      const materials_for_equipment: Record<string, { consumable_supplies?: Record<string, SelectedMaterial>; replacement_materials?: Record<string, SelectedMaterial> }> = {};
      Object.entries(selectedEquipments).forEach(([id, equipment]) => {
        materials_for_equipment[id] = {
          consumable_supplies: equipment.consumable_supplies,
          replacement_materials: equipment.replacement_materials
        };
      });

      const requestData = {
        maintenance_instance_id: selectedMaintenance.id,
        sector: selectedSector,
        materials_for_equipment,
        description
      };
      console.log("Submitting request data:", requestData);
      await materialRequestService.create(requestData);
      
      alert("Tạo yêu cầu vật tư thành công!");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error creating material request:", error);
      alert("Có lỗi xảy ra khi tạo yêu cầu vật tư");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Tạo yêu cầu vật tư mới</h2>
              <p className="text-sm text-gray-500 mt-1">Bước {step}/3</p>
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
            {/* Step 1: Select Maintenance and Sector */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chọn dự án <span className="text-red-500">*</span>
                  </label>
                  {loadingMaintenances ? (
                    <p className="text-gray-500">Đang tải...</p>
                  ) : (
                    <select
                      value={selectedMaintenance?.id || ""}
                      onChange={(e) => {
                        const maintenance = maintenances.find(m => m.id === e.target.value);
                        setSelectedMaintenance(maintenance || null);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-900 font-medium"
                    >
                      <option value="">-- Chọn dự án --</option>
                      {maintenances.map((maintenance) => (
                        <option key={maintenance.id} value={maintenance.id}>
                          {maintenance.project} - {maintenance.maintenance_tier}/{maintenance.maintenance_number} ({maintenance.year})
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chọn ngành <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedSector}
                    onChange={(e) => setSelectedSector(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-900 font-medium"
                  >
                    <option value="">-- Chọn ngành --</option>
                    {Object.values(SECTORS).map((sector) => (
                      <option key={sector} value={sector}>
                        {sector}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nội dung yêu cầu
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-900 font-medium"
                    placeholder="Mô tả chi tiết về yêu cầu vật tư..."
                  />
                </div>
              </div>
            )}

            {/* Step 2: Select Equipment/Profiles */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-blue-800">
                    <span className="font-semibold">Dự án:</span> {selectedMaintenance?.project} - {selectedMaintenance?.maintenance_tier}/{selectedMaintenance?.maintenance_number}
                  </p>
                  <p className="text-sm text-blue-800">
                    <span className="font-semibold">Ngành:</span> {selectedSector}
                  </p>
                </div>

                <h3 className="text-lg font-semibold text-gray-900">Chọn hạng mục thiết bị</h3>
                
                {loadingProfiles ? (
                  <p className="text-gray-500">Đang tải danh sách hạng mục...</p>
                ) : materialsProfiles.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">Không có hạng mục nào cho dự án và ngành đã chọn</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {materialsProfiles.map((profile) => {
                      const isSelected = !!selectedEquipments[profile.id];
                      return (
                        <div
                          key={profile.id}
                          onClick={() => handleSelectProfile(profile)}
                          className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                            isSelected
                              ? "border-cyan-500 bg-cyan-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">{profile.equipment_machinery}</h4>
                              <p className="text-sm text-gray-600 mt-1">{profile.index_path}</p>
                              <div className="flex gap-4 mt-2 text-xs">
                                <span className="text-blue-600">
                                  VT tiêu hao: {Object.keys(profile.estimate.consumable_supplies || {}).length}
                                </span>
                                <span className="text-green-600">
                                  VT thay thế: {Object.keys(profile.estimate.replacement_materials || {}).length}
                                </span>
                              </div>
                            </div>
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                              isSelected ? "bg-cyan-500 border-cyan-500" : "border-gray-300"
                            }`}>
                              {isSelected && (
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Add Materials to Selected Equipments */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-blue-800">
                    <span className="font-semibold">Đã chọn {Object.keys(selectedEquipments).length} hạng mục</span>
                  </p>
                </div>

                <h3 className="text-lg font-semibold text-gray-900">Thêm vật tư cho từng hạng mục</h3>

                <div className="space-y-4">
                  {Object.entries(selectedEquipments).map(([equipmentId, equipment]) => (
                    <div key={equipmentId} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-3">{equipment.equipment_machinery_name}</h4>
                      
                      {/* Consumable Supplies */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="text-sm font-medium text-blue-700 flex items-center">
                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                            Vật tư tiêu hao ({Object.keys(equipment.consumable_supplies).length})
                          </h5>
                          <button
                            onClick={() => handleOpenAddMaterial(equipmentId, "consumable")}
                            className="text-xs bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                          >
                            + Thêm
                          </button>
                        </div>
                        {Object.keys(equipment.consumable_supplies).length === 0 ? (
                          <p className="text-xs text-gray-500 italic">Chưa có vật tư nào</p>
                        ) : (
                          <div className="space-y-1">
                            {Object.entries(equipment.consumable_supplies).map(([name, material]) => (
                              <div key={name} className="flex items-center justify-between text-sm bg-gray-50 px-3 py-2 rounded">
                                <span className="text-gray-900 flex-1">{material.name}</span>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="number"
                                    value={material.quantity}
                                    onChange={(e) => {
                                      const newQuantity = parseFloat(e.target.value) || 0;
                                      const updatedEquipment = { ...selectedEquipments[equipmentId] };
                                      updatedEquipment.consumable_supplies = {
                                        ...updatedEquipment.consumable_supplies,
                                        [name]: { ...material, quantity: newQuantity }
                                      };
                                      setSelectedEquipments({
                                        ...selectedEquipments,
                                        [equipmentId]: updatedEquipment
                                      });
                                    }}
                                    className="w-20 px-2 py-1 border border-gray-300 rounded text-center text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    min="0"
                                    step="0.01"
                                  />
                                  <span className="text-gray-600 w-12">{material.unit}</span>
                                  <button
                                    onClick={() => handleRemoveMaterial(equipmentId, name, "consumable")}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Replacement Materials */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="text-sm font-medium text-green-700 flex items-center">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                            Vật tư thay thế ({Object.keys(equipment.replacement_materials).length})
                          </h5>
                          <button
                            onClick={() => handleOpenAddMaterial(equipmentId, "replacement")}
                            className="text-xs bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                          >
                            + Thêm
                          </button>
                        </div>
                        {Object.keys(equipment.replacement_materials).length === 0 ? (
                          <p className="text-xs text-gray-500 italic">Chưa có vật tư nào</p>
                        ) : (
                          <div className="space-y-1">
                            {Object.entries(equipment.replacement_materials).map(([name, material]) => (
                              <div key={name} className="flex items-center justify-between text-sm bg-gray-50 px-3 py-2 rounded">
                                <span className="text-gray-900 flex-1">{material.name}</span>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="number"
                                    value={material.quantity}
                                    onChange={(e) => {
                                      const newQuantity = parseFloat(e.target.value) || 0;
                                      const updatedEquipment = { ...selectedEquipments[equipmentId] };
                                      updatedEquipment.replacement_materials = {
                                        ...updatedEquipment.replacement_materials,
                                        [name]: { ...material, quantity: newQuantity }
                                      };
                                      setSelectedEquipments({
                                        ...selectedEquipments,
                                        [equipmentId]: updatedEquipment
                                      });
                                    }}
                                    className="w-20 px-2 py-1 border border-gray-300 rounded text-center text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    min="0"
                                    step="0.01"
                                  />
                                  <span className="text-gray-600 w-12">{material.unit}</span>
                                  <button
                                    onClick={() => handleRemoveMaterial(equipmentId, name, "replacement")}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50">
            <button
              onClick={() => {
                if (step > 1) {
                  setStep(step - 1);
                } else {
                  onClose();
                }
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              {step === 1 ? "Hủy" : "Quay lại"}
            </button>
            
            <div className="flex space-x-2">
              {step < 3 ? (
                <button
                  onClick={() => {
                    if (step === 1) {
                      if (!selectedMaintenance || !selectedSector) {
                        alert("Vui lòng chọn dự án và ngành");
                        return;
                      }
                      setStep(2);
                    } else if (step === 2) {
                      if (Object.keys(selectedEquipments).length === 0) {
                        alert("Vui lòng chọn ít nhất một hạng mục");
                        return;
                      }
                      setStep(3);
                    }
                  }}
                  className="bg-cyan-500 text-white px-4 py-2 rounded-lg hover:bg-cyan-600 transition-colors"
                >
                  Tiếp tục
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-400"
                >
                  {loading ? "Đang tạo..." : "Tạo yêu cầu"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Material Modal */}
      {showAddMaterialModal && currentEquipmentId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">
                Thêm {materialType === "consumable" ? "vật tư tiêu hao" : "vật tư thay thế"}
              </h3>
              <button
                onClick={() => {
                  setShowAddMaterialModal(false);
                  setNewMaterialName("");
                  setNewMaterialQuantity("");
                  setNewMaterialUnit("");
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-4">
              {/* From Estimate */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Chọn từ dự toán</h4>
                {getCurrentProfileEstimate().length === 0 ? (
                  <p className="text-sm text-gray-500 italic">Không có vật tư trong dự toán</p>
                ) : editingEstimateMaterial ? (
                  // Editing quantity for selected estimate material
                  <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium text-gray-900">{editingEstimateMaterial.name}</h5>
                      <button
                        onClick={() => {
                          setEditingEstimateMaterial(null);
                          setEditQuantity("");
                        }}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Số lượng yêu cầu <span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={editQuantity}
                            onChange={(e) => setEditQuantity(e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-900 font-medium"
                            placeholder="0"
                            min="0"
                            step="0.01"
                          />
                          <span className="text-gray-700 font-medium">{editingEstimateMaterial.unit}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Dự toán: {editingEstimateMaterial.quantity} {editingEstimateMaterial.unit}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleAddMaterialFromEstimate}
                      disabled={!editQuantity || parseFloat(editQuantity) <= 0}
                      className="w-full bg-cyan-500 text-white px-4 py-2 rounded-lg hover:bg-cyan-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      Thêm vật tư
                    </button>
                  </div>
                ) : (
                  // List of estimate materials to select
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {getCurrentProfileEstimate().map((material, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleSelectEstimateMaterial(material)}
                      >
                        <span className="text-sm text-gray-900">{material.name}</span>
                        <span className="text-sm text-gray-600">{material.quantity} {material.unit}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add New */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Hoặc nhập vật tư mới</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tên vật tư <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newMaterialName}
                      onChange={(e) => setNewMaterialName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-900 font-medium"
                      placeholder="Nhập tên vật tư"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Số lượng <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={newMaterialQuantity}
                        onChange={(e) => setNewMaterialQuantity(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-900 font-medium"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Đơn vị <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={newMaterialUnit}
                        onChange={(e) => setNewMaterialUnit(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-900 font-medium"
                        placeholder="cái, kg, m..."
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleAddNewMaterial}
                    className="w-full bg-cyan-500 text-white px-4 py-2 rounded-lg hover:bg-cyan-600 transition-colors"
                  >
                    Thêm vật tư
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
