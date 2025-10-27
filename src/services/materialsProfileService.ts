import { apiClient } from './apiClient';
import type { 
  ApiResponse, 
  MaterialsProfile,
  UploadMaterialsEstimateRequest
} from '../types/api';

export interface MaterialsProfileFilterParams {
  sector?: string;
  project?: string;
  maintenance_tier?: string;
  maintenance_number?: string;
  equipment_machinery_name?: string;
}

export class MaterialsProfileService {
  /**
   * Filter materials profiles
   * GET /materials-profiles
   */
  async filter(params: MaterialsProfileFilterParams = {}): Promise<ApiResponse<MaterialsProfile[]>> {
    const response = await apiClient.get<ApiResponse<MaterialsProfile[]>>('/materials-profiles', {
      params
    });
    return response.data;
  }

  /**
   * Get materials profile by ID
   * GET /materials-profiles/{id}
   */
  async getById(id: string): Promise<ApiResponse<MaterialsProfile>> {
    const response = await apiClient.get<ApiResponse<MaterialsProfile>>(`/materials-profiles/${id}`);
    return response.data;
  }

  /**
   * Upload materials estimate profile
   * POST /materials-profiles/upload-estimate
   */
  async uploadEstimate(file: File, request: UploadMaterialsEstimateRequest): Promise<ApiResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('request', JSON.stringify(request));

    const response = await apiClient.post<ApiResponse>('/materials-profiles/upload-estimate', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  /**
   * Get all materials profiles
   */
  async getAll(): Promise<ApiResponse<MaterialsProfile[]>> {
    return this.filter({});
  }

  /**
   * Get materials profiles by sector
   */
  async getBySector(sector: string): Promise<ApiResponse<MaterialsProfile[]>> {
    return this.filter({ sector });
  }

  /**
   * Get materials profiles by project
   */
  async getByProject(project: string): Promise<ApiResponse<MaterialsProfile[]>> {
    return this.filter({ project });
  }

  /**
   * Get materials profiles by maintenance tier
   */
  async getByMaintenanceTier(maintenanceTier: string): Promise<ApiResponse<MaterialsProfile[]>> {
    return this.filter({ maintenance_tier: maintenanceTier });
  }

  /**
   * Get materials profiles by equipment machinery name
   */
  async getByEquipmentMachineryName(equipmentMachineryName: string): Promise<ApiResponse<MaterialsProfile[]>> {
    return this.filter({ equipment_machinery_name: equipmentMachineryName });
  }
}

export const materialsProfileService = new MaterialsProfileService();
export default materialsProfileService;