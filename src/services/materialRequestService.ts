import { apiClient } from './apiClient';
import type { 
  ApiResponse, 
  MaterialRequest, 
  CreateMaterialRequestReq,
  MaterialRequestFilter,
  MaterialRequestExport,
  UpdateNumberOfRequestReq,
  MaterialRequestUpdateReq
} from '../types/api';

export class MaterialRequestService {
  /**
   * Create a new material request
   * POST /materials-request
   */
  async create(request: CreateMaterialRequestReq): Promise<ApiResponse<string>> {
    const response = await apiClient.post<ApiResponse<string>>('/materials-request/', request);
    return response.data;
  }

  /**
   * Filter material requests
   * POST /materials-request/filter
   */
  async filter(filterRequest: MaterialRequestFilter): Promise<ApiResponse<MaterialRequest[]>> {
    const response = await apiClient.post<ApiResponse<MaterialRequest[]>>('/materials-request/filter', filterRequest);
    return response.data;
  }

  /**
   * Get material request by ID
   * GET /materials-request/{id}
   */
  async getById(id: string): Promise<ApiResponse<MaterialRequest>> {
    const response = await apiClient.get<ApiResponse<MaterialRequest>>(`/materials-request/${id}`);
    return response.data;
  }

  /**
   * Update number of material requests
   * POST /materials-request/update-number
   */
  async updateNumber(request: UpdateNumberOfRequestReq): Promise<ApiResponse> {
    const response = await apiClient.post<ApiResponse>('/materials-request/update-number', request);
    return response.data;
  }

  async updateMaterialRequest(request: MaterialRequestUpdateReq): Promise<ApiResponse> {
    const response = await apiClient.post<ApiResponse>('/materials-request/update', request);
    return response.data;
  }

  /**
   * Export material request to DOCX
   * POST /materials-request/export
   */
  async exportToDocx(exportRequest: MaterialRequestExport): Promise<Blob> {
    const response = await apiClient.post('/materials-request/export', exportRequest, {
      responseType: 'blob',
      headers: {
        'Accept': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      }
    });
    return response.data as Blob;
  }

  /**
   * Download exported material request
   */
  async downloadExport(materialRequestId: string, filename?: string): Promise<void> {
    try {
      const blob = await this.exportToDocx({ material_request_id: materialRequestId });
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || `YCVT-${materialRequestId}.docx`;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading material request export:', error);
      throw error;
    }
  }

  /**
   * Get all material requests (using empty filter)
   */
  async getAll(): Promise<ApiResponse<MaterialRequest[]>> {
    return this.filter({});
  }

  /**
   * Get material requests by sector
   */
  async getBySector(sector: string): Promise<ApiResponse<MaterialRequest[]>> {
    return this.filter({ sector });
  }

  /**
   * Get material requests by requester
   */
  async getByRequester(requestedBy: string): Promise<ApiResponse<MaterialRequest[]>> {
    return this.filter({ requested_by: requestedBy });
  }

  /**
   * Get material requests by maintenance instance
   */
  async getByMaintenanceInstance(maintenanceInstanceId: string): Promise<ApiResponse<MaterialRequest[]>> {
    return this.filter({ maintenance_instance_id: maintenanceInstanceId });
  }

  /**
   * Get material requests by equipment machinery
   */
  async getByEquipmentMachinery(equipmentMachineryId: string): Promise<ApiResponse<MaterialRequest[]>> {
    return this.filter({ equipment_machinery_id: equipmentMachineryId });
  }

  /**
   * Get material requests by date range
   */
  async getByDateRange(startDate: number, endDate: number): Promise<ApiResponse<MaterialRequest[]>> {
    return this.filter({ 
      requested_at_start: startDate, 
      requested_at_end: endDate 
    });
  }

  /**
   * Get material requests by number of requests
   */
  async getByNumberOfRequests(numOfRequest: number): Promise<ApiResponse<MaterialRequest[]>> {
    return this.filter({ num_of_request: numOfRequest });
  }
}

export const materialRequestService = new MaterialRequestService();
export default materialRequestService;