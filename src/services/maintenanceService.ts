import { apiClient } from './apiClient';
import type { 
  ApiResponse, 
  Maintenance, 
  CreateMaintenanceRequest,
  MaintenanceFilter
} from '../types/api';

export class MaintenanceService {
  /**
   * Create a new maintenance
   * POST /maintenance
   */
  async create(request: CreateMaintenanceRequest): Promise<ApiResponse<string>> {
    const response = await apiClient.post<ApiResponse<string>>('/maintenance', request);
    return response.data;
  }

  /**
   * Filter maintenance records
   * POST /maintenance/filter
   */
  async filter(filterRequest: MaintenanceFilter): Promise<ApiResponse<Maintenance[]>> {
    const response = await apiClient.post<ApiResponse<Maintenance[]>>('/maintenance/filter', filterRequest);
    return response.data;
  }

  /**
   * Get maintenance by ID
   * GET /maintenance/{id}
   */
  async getById(id: string): Promise<ApiResponse<string>> {
    const response = await apiClient.get<ApiResponse<string>>(`/maintenance/${id}`);
    return response.data;
  }

  /**
   * Get all maintenance records (using empty filter)
   */
  async getAll(): Promise<ApiResponse<Maintenance[]>> {
    return this.filter({});
  }

  /**
   * Get maintenance by project code
   */
  async getByProjectCode(projectCode: string): Promise<ApiResponse<Maintenance[]>> {
    return this.filter({ project_code: projectCode });
  }

  /**
   * Get maintenance by maintenance number
   */
  async getByMaintenanceNumber(maintenanceNumber: string): Promise<ApiResponse<Maintenance[]>> {
    return this.filter({ maintenance_number: maintenanceNumber });
  }

  /**
   * Get maintenance by tier
   */
  async getByTier(maintenanceTier: string): Promise<ApiResponse<Maintenance[]>> {
    return this.filter({ maintenance_tier: maintenanceTier });
  }
}

export const maintenanceService = new MaintenanceService();
export default maintenanceService;