import type { CreateMaterialRequestReq, Material, MaterialsForEquipment, MaterialsForEquipmentRes } from '@/types/api';

export type EditorMaterials = Record<string, MaterialsForEquipment>;

export function toEditableMaterials(source: Record<string, MaterialsForEquipmentRes>): EditorMaterials {
  return Object.fromEntries(Object.entries(source).map(([profileId, materials]) => [profileId, {
    consumable_supplies: { ...(materials.consumable_supplies ?? {}) },
    replacement_materials: { ...(materials.replacement_materials ?? {}) },
  }]));
}

export function toCreatePayload(
  maintenanceInstanceId: string,
  sector: string,
  description: string,
  materials: EditorMaterials,
): CreateMaterialRequestReq {
  return { maintenance_instance_id: maintenanceInstanceId, sector, description, materials_for_equipment: materials };
}

export function estimateVariance(requested: number, estimate?: Material | null): number {
  return requested - (estimate?.quantity ?? 0);
}
