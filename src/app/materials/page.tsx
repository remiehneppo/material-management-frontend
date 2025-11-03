'use client';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Header from '@/components/layout/Header';
import React, { useEffect, useState } from 'react';
import { AlignedMaterial, Material, MaterialsProfile } from '@/types/api';
import {materialsProfileService} from '@/services/materialsProfileService';



export default function MaterialsPage() {
  const [materialProfiles, setMaterialProfiles] = useState<MaterialsProfile[] | null>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Function to align materials for comparison
  const alignMaterials = (estimate: any, reality: any): AlignedMaterial[] => {
    const allMaterials = new Set([
      ...Object.keys(estimate.consumable_supplies),
      ...Object.keys(estimate.replacement_materials),
      ...Object.keys(reality.consumable_supplies),
      ...Object.keys(reality.replacement_materials),
    ]);

    return Array.from(allMaterials).map(materialName => {
      const estimateConsumable = estimate.consumable_supplies[materialName];
      const estimateReplacement = estimate.replacement_materials[materialName];
      const realityConsumable = reality.consumable_supplies[materialName];
      const realityReplacement = reality.replacement_materials[materialName];

      const estimateItem = estimateConsumable || estimateReplacement;
      const realityItem = realityConsumable || realityReplacement;

      return {
        name: materialName,
        estimate: estimateItem || null,
        reality: realityItem || null,
      };
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

    const fetchData = async () => {
    try {
      // Fetch material profiles here
      setLoading(true);
      const response = await materialsProfileService.paginate(1, 10);
      console.log('Fetched material profiles:', response.data.items);
      setMaterialProfiles(response.data.items ? response.data.items : null);
    } catch (e) {
      setError('Failed to load material profiles.');
    }
  }


  return (
    <DashboardLayout>
      <Header title="VẬT TƯ" />
      <div className="p-6">
        {/* Action Bar */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-4">
            <button className="bg-cyan-500 text-white px-4 py-2 rounded-lg hover:bg-cyan-600 transition-colors">
              + Thêm vật tư
            </button>
            <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
              Nhập kho
            </button>
            <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
              Xuất kho
            </button>
            <button className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors">
              Xuất báo cáo
            </button>
          </div>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Tìm kiếm vật tư..."
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500">
              <option>Tất cả danh mục</option>
              <option>Xi măng</option>
              <option>Thép</option>
              <option>Gạch</option>
              <option>Cát</option>
              <option>Đá</option>
              <option>Sơn</option>
            </select>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Tổng vật tư</p>
                <p className="text-xl font-semibold text-gray-900">
                  {materialProfiles?.length ?? 0}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              {/* <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Đủ tồn kho</p>
                <p className="text-xl font-semibold text-gray-900">
                  {materials.filter((m) => m.quantity > m.minStock).length}
                </p>
              </div> */}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg
                  className="w-5 h-5 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              {/* <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">
                  Cần nhập thêm
                </p>
                <p className="text-xl font-semibold text-gray-900">
                  {materials.filter((m) => m.quantity <= m.minStock).length}
                </p>
              </div> */}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg
                  className="w-5 h-5 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
              {/* <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">
                  Tổng giá trị
                </p>
                <p className="text-xl font-semibold text-gray-900">
                  {(
                    materials.reduce(
                      (sum, m) => sum + m.quantity * m.price,
                      0
                    ) / 1000000
                  ).toFixed(1)}
                  M
                </p>
              </div> */}
            </div>
          </div>
        </div>

        {/* Materials Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto max-h-[calc(100vh-100px)] overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-500 sticky top-0 z-10">
                  <tr className="border-b border-gray-600">
                    <th
                      rowSpan={2}
                      className="px-3 py-3 text-center text-xs font-medium text-white uppercase tracking-wider border-r border-gray-600 w-12"
                    >
                      TT
                    </th>
                    <th
                      rowSpan={2}
                      className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider border-r border-gray-600 min-w-[200px]"
                    >
                      Thiết bị
                    </th>
                    <th
                      colSpan={3}
                      className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider border-r border-gray-600"
                    >
                      Vật tư dự toán
                    </th>
                    <th
                      colSpan={3}
                      className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider border-r border-gray-600"
                    >
                      Vật tư thực tế
                    </th>
                    <th
                      rowSpan={2}
                      className="px-3 py-3 text-center text-xs font-medium text-white uppercase tracking-wider w-24"
                    >
                      Trạng thái
                    </th>
                  </tr>
                  <tr className="border-b border-gray-600">
                    <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider border-r border-gray-600 min-w-[150px]">
                      Tên vật tư
                    </th>
                    <th className="px-2 py-3 text-center text-xs font-medium text-white uppercase tracking-wider border-r border-gray-600 w-16">
                      ĐVT
                    </th>
                    <th className="px-2 py-3 text-center text-xs font-medium text-white uppercase tracking-wider border-r border-gray-600 w-16">
                      SL
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider border-r border-gray-600 min-w-[150px]">
                      Tên vật tư
                    </th>
                    <th className="px-2 py-3 text-center text-xs font-medium text-white uppercase tracking-wider border-r border-gray-600 w-16">
                      ĐVT
                    </th>
                    <th className="px-2 py-3 text-center text-xs font-medium text-white uppercase tracking-wider border-r border-gray-600 w-16">
                      SL
                    </th>
                  </tr>
                </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                
                {materialProfiles?.map((material) => {
                  const alignedMaterials = alignMaterials(material.estimate, material.reality);
                  
                  // Separate consumable and replacement materials
                  const consumableMaterials = alignedMaterials.filter(item => 
                  (item.estimate && material.estimate?.consumable_supplies?.[item.name]) ||
                  (item.reality && material.reality?.consumable_supplies?.[item.name])
                  );
                  
                  const replacementMaterials = alignedMaterials.filter(item => 
                  (item.estimate && material.estimate?.replacement_materials?.[item.name]) ||
                  (item.reality && material.reality?.replacement_materials?.[item.name])
                  );
                  
                  return (
                  <tr key={material.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                      {material.index_path}
                      </div>
                    </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                      {material.equipment_machinery}
                      </div>
                      <div className="text-sm text-gray-500">
                      ID: {material.id}
                      </div>
                      
                      <div className="text-sm text-gray-500">
                      Ngành: {material.sector}
                      </div>
                    </div>
                    </td>
                    {/* Estimate Materials Name */}
                    <td className="px-4 py-4 align-top">
                      <div className="space-y-2">
                        {/* Consumable Materials Section */}
                        {(consumableMaterials.length > 0 || replacementMaterials.length > 0) && (
                          <div className="text-sm font-bold uppercase text-white bg-blue-500 border border-blue-600 rounded px-2 py-1 min-h-[32px] flex items-center justify-center">
                            Vật tư tiêu hao
                          </div>
                        )}
                        {consumableMaterials.map((item, idx) => (
                          <div key={`consumable-${idx}`} className="text-sm text-gray-900 border-b border-gray-100 pb-1 min-h-[32px] flex items-center">
                            {item.estimate?.name || ''}
                          </div>
                        ))}
                        {consumableMaterials.length === 0 && (consumableMaterials.length > 0 || replacementMaterials.length > 0) && (
                          <div className="text-sm text-gray-400 border-b border-gray-100 pb-1 min-h-[32px] flex items-center italic">
                            Không có
                          </div>
                        )}
                        
                        {/* Replacement Materials Section */}
                        {(consumableMaterials.length > 0 || replacementMaterials.length > 0) && (
                          <div className="text-sm font-bold uppercase text-white bg-green-500 border border-green-600 rounded px-2 py-1 min-h-[32px] mt-2 flex items-center justify-center">
                            Vật tư thay thế
                          </div>
                        )}
                        {replacementMaterials.map((item, idx) => (
                          <div key={`replacement-${idx}`} className="text-sm text-gray-900 border-b border-gray-100 pb-1 min-h-[32px] flex items-center">
                            {item.estimate?.name || ''}
                          </div>
                        ))}
                        {replacementMaterials.length === 0 && (consumableMaterials.length > 0 || replacementMaterials.length > 0) && (
                          <div className="text-sm text-gray-400 border-b border-gray-100 pb-1 min-h-[32px] flex items-center italic">
                            Không có
                          </div>
                        )}
                      </div>
                    </td>
                    
                    {/* Estimate Materials Unit */}
                    <td className="px-2 py-4 text-center align-top">
                      <div className="space-y-2">
                        {/* Empty header space for consumables */}
                        {(consumableMaterials.length > 0 || replacementMaterials.length > 0) && (
                          <div className="text-sm font-bold text-transparent bg-blue-500 border border-blue-600 rounded px-2 py-1 min-h-[32px]">.</div>
                        )}
                        {consumableMaterials.map((item, idx) => (
                          <div key={`consumable-${idx}`} className="text-sm text-gray-900 border-b border-gray-100 pb-1 min-h-[32px] flex items-center justify-center">
                            {item.estimate?.unit || ''}
                          </div>
                        ))}
                        {consumableMaterials.length === 0 && (consumableMaterials.length > 0 || replacementMaterials.length > 0) && (
                          <div className="text-sm text-gray-400 border-b border-gray-100 pb-1 min-h-[32px]"></div>
                        )}
                        
                        {/* Empty header space for replacements */}
                        {(consumableMaterials.length > 0 || replacementMaterials.length > 0) && (
                          <div className="text-sm font-bold text-transparent bg-green-500 border border-green-600 rounded px-2 py-1 min-h-[32px] mt-2">.</div>
                        )}
                        {replacementMaterials.map((item, idx) => (
                          <div key={`replacement-${idx}`} className="text-sm text-gray-900 border-b border-gray-100 pb-1 min-h-[32px] flex items-center justify-center">
                            {item.estimate?.unit || ''}
                          </div>
                        ))}
                        {replacementMaterials.length === 0 && (consumableMaterials.length > 0 || replacementMaterials.length > 0) && (
                          <div className="text-sm text-gray-400 border-b border-gray-100 pb-1 min-h-[32px]"></div>
                        )}
                      </div>
                    </td>
                    
                    {/* Estimate Materials Quantity */}
                    <td className="px-2 py-4 text-center align-top">
                      <div className="space-y-2">
                        {/* Empty header space for consumables */}
                        {(consumableMaterials.length > 0 || replacementMaterials.length > 0) && (
                          <div className="text-sm font-bold text-transparent bg-blue-500 border border-blue-600 rounded px-2 py-1 min-h-[32px]">.</div>
                        )}
                        {consumableMaterials.map((item, idx) => (
                          <div key={`consumable-${idx}`} className="text-sm text-gray-900 border-b border-gray-100 pb-1 min-h-[32px] flex items-center justify-center">
                            {item.estimate?.quantity || ''}
                          </div>
                        ))}
                        {consumableMaterials.length === 0 && (consumableMaterials.length > 0 || replacementMaterials.length > 0) && (
                          <div className="text-sm text-gray-400 border-b border-gray-100 pb-1 min-h-[32px]"></div>
                        )}
                        
                        {/* Empty header space for replacements */}
                        {(consumableMaterials.length > 0 || replacementMaterials.length > 0) && (
                          <div className="text-sm font-bold text-transparent bg-green-500 border border-green-600 rounded px-2 py-1 min-h-[32px] mt-2">.</div>
                        )}
                        {replacementMaterials.map((item, idx) => (
                          <div key={`replacement-${idx}`} className="text-sm text-gray-900 border-b border-gray-100 pb-1 min-h-[32px] flex items-center justify-center">
                            {item.estimate?.quantity || ''}
                          </div>
                        ))}
                        {replacementMaterials.length === 0 && (consumableMaterials.length > 0 || replacementMaterials.length > 0) && (
                          <div className="text-sm text-gray-400 border-b border-gray-100 pb-1 min-h-[32px]"></div>
                        )}
                      </div>
                    </td>
                    
                    {/* Reality Materials Name */}
                    <td className="px-4 py-4 align-top">
                      <div className="space-y-2">
                        {/* Consumable Materials Section */}
                        {(consumableMaterials.length > 0 || replacementMaterials.length > 0) && (
                          <div className="text-sm font-bold uppercase text-white bg-blue-500 border border-blue-600 rounded px-2 py-1 min-h-[32px] flex items-center justify-center">
                            Vật tư tiêu hao
                          </div>
                        )}
                        {consumableMaterials.map((item, idx) => (
                          <div key={`consumable-${idx}`} className="text-sm text-gray-900 border-b border-gray-100 pb-1 min-h-[32px] flex items-center">
                            {item.reality?.name || ''}
                          </div>
                        ))}
                        {consumableMaterials.length === 0 && (consumableMaterials.length > 0 || replacementMaterials.length > 0) && (
                          <div className="text-sm text-gray-400 border-b border-gray-100 pb-1 min-h-[32px] flex items-center italic">
                            Không có
                          </div>
                        )}
                        
                        {/* Replacement Materials Section */}
                        {(consumableMaterials.length > 0 || replacementMaterials.length > 0) && (
                          <div className="text-sm font-bold uppercase text-white bg-green-500 border border-green-600 rounded px-2 py-1 min-h-[32px] mt-2 flex items-center justify-center">
                            Vật tư thay thế
                          </div>
                        )}
                        {replacementMaterials.map((item, idx) => (
                          <div key={`replacement-${idx}`} className="text-sm text-gray-900 border-b border-gray-100 pb-1 min-h-[32px] flex items-center">
                            {item.reality?.name || ''}
                          </div>
                        ))}
                        {replacementMaterials.length === 0 && (consumableMaterials.length > 0 || replacementMaterials.length > 0) && (
                          <div className="text-sm text-gray-400 border-b border-gray-100 pb-1 min-h-[32px] flex items-center italic">
                            Không có
                          </div>
                        )}
                      </div>
                    </td>
                    
                    {/* Reality Materials Unit */}
                    <td className="px-2 py-4 text-center align-top">
                      <div className="space-y-2">
                        {/* Empty header space for consumables */}
                        {(consumableMaterials.length > 0 || replacementMaterials.length > 0) && (
                          <div className="text-sm font-bold text-transparent bg-blue-500 border border-blue-600 rounded px-2 py-1 min-h-[32px]">.</div>
                        )}
                        {consumableMaterials.map((item, idx) => (
                          <div key={`consumable-${idx}`} className="text-sm text-gray-900 border-b border-gray-100 pb-1 min-h-[32px] flex items-center justify-center">
                            {item.reality?.unit || ''}
                          </div>
                        ))}
                        {consumableMaterials.length === 0 && (consumableMaterials.length > 0 || replacementMaterials.length > 0) && (
                          <div className="text-sm text-gray-400 border-b border-gray-100 pb-1 min-h-[32px]"></div>
                        )}
                        
                        {/* Empty header space for replacements */}
                        {(consumableMaterials.length > 0 || replacementMaterials.length > 0) && (
                          <div className="text-sm font-bold text-transparent bg-green-500 border border-green-600 rounded px-2 py-1 min-h-[32px] mt-2">.</div>
                        )}
                        {replacementMaterials.map((item, idx) => (
                          <div key={`replacement-${idx}`} className="text-sm text-gray-900 border-b border-gray-100 pb-1 min-h-[32px] flex items-center justify-center">
                            {item.reality?.unit || ''}
                          </div>
                        ))}
                        {replacementMaterials.length === 0 && (consumableMaterials.length > 0 || replacementMaterials.length > 0) && (
                          <div className="text-sm text-gray-400 border-b border-gray-100 pb-1 min-h-[32px]"></div>
                        )}
                      </div>
                    </td>
                    
                    {/* Reality Materials Quantity */}
                    <td className="px-2 py-4 text-center align-top">
                      <div className="space-y-2">
                        {/* Empty header space for consumables */}
                        {(consumableMaterials.length > 0 || replacementMaterials.length > 0) && (
                          <div className="text-sm font-bold text-transparent bg-blue-500 border border-blue-600 rounded px-2 py-1 min-h-[32px]">.</div>
                        )}
                        {consumableMaterials.map((item, idx) => (
                          <div key={`consumable-${idx}`} className="text-sm text-gray-900 border-b border-gray-100 pb-1 min-h-[32px] flex items-center justify-center">
                            {item.reality?.quantity || ''}
                          </div>
                        ))}
                        {consumableMaterials.length === 0 && (consumableMaterials.length > 0 || replacementMaterials.length > 0) && (
                          <div className="text-sm text-gray-400 border-b border-gray-100 pb-1 min-h-[32px]"></div>
                        )}
                        
                        {/* Empty header space for replacements */}
                        {(consumableMaterials.length > 0 || replacementMaterials.length > 0) && (
                          <div className="text-sm font-bold text-transparent bg-green-500 border border-green-600 rounded px-2 py-1 min-h-[32px] mt-2">.</div>
                        )}
                        {replacementMaterials.map((item, idx) => (
                          <div key={`replacement-${idx}`} className="text-sm text-gray-900 border-b border-gray-100 pb-1 min-h-[32px] flex items-center justify-center">
                            {item.reality?.quantity || ''}
                          </div>
                        ))}
                        {replacementMaterials.length === 0 && (consumableMaterials.length > 0 || replacementMaterials.length > 0) && (
                          <div className="text-sm text-gray-400 border-b border-gray-100 pb-1 min-h-[32px]"></div>
                        )}
                      </div>
                    </td>
                    
                    {/* Difference Column */}
                    <td className="px-2 py-4 text-center align-top">
                      <div className="space-y-2">
                        {/* Empty header space for consumables */}
                        {(consumableMaterials.length > 0 || replacementMaterials.length > 0) && (
                          <div className="text-sm font-bold text-transparent bg-blue-500 border border-blue-600 rounded px-2 py-1 min-h-[32px]">.</div>
                        )}
                        {consumableMaterials.map((item, idx) => {
                          const estimateQty = item.estimate?.quantity || 0;
                          const realityQty = item.reality?.quantity || 0;
                          const diff = estimateQty - realityQty;
                          const diffColor = diff > 0 ? 'text-green-600' : diff < 0 ? 'text-orange-500' : 'text-gray-900';
                          return (
                            <div key={`consumable-${idx}`} className={`text-sm font-medium border-b border-gray-100 pb-1 min-h-[32px] flex items-center justify-center ${diffColor}`}>
                              {diff !== 0 ? (diff > 0 ? `+${diff}` : diff) : ''}
                            </div>
                          );
                        })}
                        {consumableMaterials.length === 0 && (consumableMaterials.length > 0 || replacementMaterials.length > 0) && (
                          <div className="text-sm text-gray-400 border-b border-gray-100 pb-1 min-h-[32px]"></div>
                        )}
                        
                        {/* Empty header space for replacements */}
                        {(consumableMaterials.length > 0 || replacementMaterials.length > 0) && (
                          <div className="text-sm font-bold text-transparent bg-green-500 border border-green-600 rounded px-2 py-1 min-h-[32px] mt-2">.</div>
                        )}
                        {replacementMaterials.map((item, idx) => {
                          const estimateQty = item.estimate?.quantity || 0;
                          const realityQty = item.reality?.quantity || 0;
                          const diff = estimateQty - realityQty;
                          const diffColor = diff > 0 ? 'text-green-600' : diff < 0 ? 'text-orange-500' : 'text-gray-900';
                          return (
                            <div key={`replacement-${idx}`} className={`text-sm font-medium border-b border-gray-100 pb-1 min-h-[32px] flex items-center justify-center ${diffColor}`}>
                              {diff !== 0 ? (diff > 0 ? `+${diff}` : diff) : ''}
                            </div>
                          );
                        })}
                        {replacementMaterials.length === 0 && (consumableMaterials.length > 0 || replacementMaterials.length > 0) && (
                          <div className="text-sm text-gray-400 border-b border-gray-100 pb-1 min-h-[32px]"></div>
                        )}
                      </div>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
