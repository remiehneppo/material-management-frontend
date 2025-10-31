// API Response Types
export interface ApiResponse<T = unknown> {
  status: boolean;
  message: string;
  data?: T;
}

export interface PaginatedResponse<T = unknown> {
    status: boolean;
    message: string;
    data: {
        items: T[];
        total: number;
        page: number;
        limit: number;
    };
}

// Authentication Types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

export interface RefreshRequest {
  refresh_token: string;
}


// User Types
export interface User {
  id: string;
  username: string;
  email: string;
  full_name: string;
  workspace_role: string;
  workspace: string;
  created_at: number;
  updated_at: number;
}

export interface UserProfileUpdate {
    full_name?: string;
    workspace?: string;
    workspace_role?: string;
}

export interface UserChangePassword {
  old_password: string;
  new_password: string;
}

// Equipment Machinery Types
export interface EquipmentMachinery {
  id: string;
  name: string;
  sector: string;
}

export interface CreateEquipmentMachineryReq {
  name: string;
  sector: string;
  order: number;
}

export interface EquipmentMachineryFilter {
  name?: string;
  sector?: string;
}

// Maintenance Types
export interface Maintenance {
  id: string;
  maintenance_number: string;
  maintenance_tier: string;
  project: string;
  project_code: string;
  year: number;
}

export interface CreateMaintenanceRequest {
  maintenance_number: string;
  maintenance_tier: string;
  project: string;
  project_code: string;
}

export interface MaintenanceFilter {
  maintenance_number?: string;
  maintenance_tier?: string;
  project_code?: string;
}

// Material Types
export interface Material {
  name: string;
  quantity: number;
  unit: string;
}

export interface AlignedMaterial {
  name: string;
  estimate: Material | null;
  reality: Material | null;
}

export interface MaterialsForEquipment {
  consumable_supplies?: Record<string, Material>;
  replacement_materials?: Record<string, Material>;
}

// Materials Profile Types
export interface MaterialsProfile {
  id: string;
  equipment_machinery_id: string;
  maintenance_instance_id: string;
  sector: string;
  index: number;
  estimate: MaterialsForEquipment;
  reality: MaterialsForEquipment;
}

// Material Request Types
export interface MaterialRequest {
  id: string;
  maintenance_instance_id: string;
  materials_for_equipment: Record<string, MaterialsForEquipment>;
  num_of_request: number;
  requested_at: number;
  requested_by: string;
  sector: string;
  description?: string;
}

export interface CreateMaterialRequestReq {
  maintenance_number: string;
  maintenance_tier: string;
  project: string;
  sector: string;
  materials_for_equipment: Record<string, MaterialsForEquipment>;
  description?: string;
}

export interface MaterialRequestFilter {
  maintenance_instance_id?: string;
  equipment_machinery_id?: string;
  requested_by?: string;
  sector?: string;
  num_of_request?: number;
  requested_at_start?: number;
  requested_at_end?: number;
}

export interface MaterialRequestExport {
  material_request_id: string;
}

export interface UpdateNumberOfRequestReq {
  material_request_id: string;
  num_of_request: number;
}

// Upload Types
export interface UploadMaterialsEstimateRequest {
  project: string;
  maintenance_tier: string;
  maintenance_number: string;
  sheet_name: string;
  sector: string;
}