import { apiClient } from './apiClient';
import type { 
  ApiResponse, 
  EquipmentMachinery, 
  CreateEquipmentMachineryReq,
  EquipmentMachineryFilter
} from '../types/api';

export class EquipmentMachineryService {
  /**
   * Create a new equipment machinery
   * POST /equipment-machinery
   */
  async create(request: CreateEquipmentMachineryReq): Promise<ApiResponse<string>> {
    const response = await apiClient.post<ApiResponse<string>>('/equipment-machinery', request);
    return response.data;
  }

  /**
   * Filter equipment machinery
   * POST /equipment-machinery/filter
   */
  async filter(filterRequest: EquipmentMachineryFilter): Promise<ApiResponse<EquipmentMachinery[]>> {
    const response = await apiClient.post<ApiResponse<EquipmentMachinery[]>>('/equipment-machinery/filter', filterRequest);
    return response.data;
  }

  /**
   * Get all equipment machinery (using empty filter)
   */
  async getAll(): Promise<ApiResponse<EquipmentMachinery[]>> {
    return this.filter({});
  }

  /**
   * Get equipment machinery by sector
   */
  async getBySector(sector: string): Promise<ApiResponse<EquipmentMachinery[]>> {
    return this.filter({ sector });
  }

  /**
   * Search equipment machinery by name
   */
  async searchByName(name: string): Promise<ApiResponse<EquipmentMachinery[]>> {
    return this.filter({ name });
  }
}

export const equipmentMachineryService = new EquipmentMachineryService();
export default equipmentMachineryService;