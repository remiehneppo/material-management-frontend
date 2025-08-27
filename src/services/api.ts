import { httpClient } from './http-client';
import type { 
  Material, 
  MaterialCategory, 
  CreateMaterialDTO, 
  UpdateMaterialDTO,
  BudgetMaterial,
  BudgetProject,
  CreateBudgetMaterialDTO,
  UpdateBudgetMaterialDTO,
  MaterialOutput,
  MaterialOutputRequest,
  CreateMaterialOutputDTO,
  UpdateMaterialOutputDTO
} from '../types/material';
import type { PaginationParams, PaginationResponse, FilterOptions, SortOptions } from '../types/common';

export class MaterialService {
  private readonly basePath = '/materials';

  // Material CRUD operations
  async getMaterials(params?: {
    pagination?: PaginationParams;
    filters?: FilterOptions;
    sort?: SortOptions;
  }) {
    const queryParams = new URLSearchParams();
    
    if (params?.pagination) {
      queryParams.append('page', params.pagination.page.toString());
      queryParams.append('limit', params.pagination.limit.toString());
    }
    
    if (params?.filters) {
      if (params.filters.search) {
        queryParams.append('search', params.filters.search);
      }
      if (params.filters.status) {
        queryParams.append('status', params.filters.status);
      }
      if (params.filters.dateRange) {
        queryParams.append('fromDate', params.filters.dateRange.from);
        queryParams.append('toDate', params.filters.dateRange.to);
      }
    }
    
    if (params?.sort) {
      queryParams.append('sortBy', params.sort.field);
      queryParams.append('sortOrder', params.sort.order);
    }

    return httpClient.get<PaginationResponse<Material>>(
      `${this.basePath}?${queryParams.toString()}`
    );
  }

  async getMaterialById(id: string) {
    return httpClient.get<Material>(`${this.basePath}/${id}`);
  }

  async createMaterial(data: CreateMaterialDTO) {
    return httpClient.post<Material>(this.basePath, data);
  }

  async updateMaterial(id: string, data: UpdateMaterialDTO) {
    return httpClient.put<Material>(`${this.basePath}/${id}`, data);
  }

  async deleteMaterial(id: string) {
    return httpClient.delete<void>(`${this.basePath}/${id}`);
  }

  async searchMaterials(query: string, limit = 10) {
    return httpClient.get<Material[]>(`${this.basePath}/search?q=${encodeURIComponent(query)}&limit=${limit}`);
  }

  // Material Categories
  async getCategories() {
    return httpClient.get<MaterialCategory[]>('/categories');
  }

  async getCategoryById(id: string) {
    return httpClient.get<MaterialCategory>(`/categories/${id}`);
  }

  async createCategory(data: { name: string; description?: string; parentId?: string }) {
    return httpClient.post<MaterialCategory>('/categories', data);
  }

  async updateCategory(id: string, data: { name?: string; description?: string; parentId?: string }) {
    return httpClient.put<MaterialCategory>(`/categories/${id}`, data);
  }

  async deleteCategory(id: string) {
    return httpClient.delete<void>(`/categories/${id}`);
  }
}

export class BudgetService {
  private readonly basePath = '/budget';

  // Budget Projects
  async getProjects(params?: {
    pagination?: PaginationParams;
    filters?: FilterOptions;
    sort?: SortOptions;
  }) {
    const queryParams = new URLSearchParams();
    
    if (params?.pagination) {
      queryParams.append('page', params.pagination.page.toString());
      queryParams.append('limit', params.pagination.limit.toString());
    }
    
    if (params?.filters) {
      if (params.filters.search) {
        queryParams.append('search', params.filters.search);
      }
      if (params.filters.status) {
        queryParams.append('status', params.filters.status);
      }
    }
    
    if (params?.sort) {
      queryParams.append('sortBy', params.sort.field);
      queryParams.append('sortOrder', params.sort.order);
    }

    return httpClient.get<PaginationResponse<BudgetProject>>(
      `${this.basePath}/projects?${queryParams.toString()}`
    );
  }

  async getProjectById(id: string) {
    return httpClient.get<BudgetProject>(`${this.basePath}/projects/${id}`);
  }

  async createProject(data: {
    name: string;
    code: string;
    description?: string;
    startDate: string;
    endDate?: string;
    totalBudget: number;
  }) {
    return httpClient.post<BudgetProject>(`${this.basePath}/projects`, data);
  }

  async updateProject(id: string, data: {
    name?: string;
    code?: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    totalBudget?: number;
    status?: string;
  }) {
    return httpClient.put<BudgetProject>(`${this.basePath}/projects/${id}`, data);
  }

  async deleteProject(id: string) {
    return httpClient.delete<void>(`${this.basePath}/projects/${id}`);
  }

  // Budget Materials
  async getBudgetMaterials(projectId: string, params?: {
    pagination?: PaginationParams;
    filters?: FilterOptions;
  }) {
    const queryParams = new URLSearchParams();
    queryParams.append('projectId', projectId);
    
    if (params?.pagination) {
      queryParams.append('page', params.pagination.page.toString());
      queryParams.append('limit', params.pagination.limit.toString());
    }
    
    if (params?.filters?.search) {
      queryParams.append('search', params.filters.search);
    }

    return httpClient.get<PaginationResponse<BudgetMaterial>>(
      `${this.basePath}/materials?${queryParams.toString()}`
    );
  }

  async getBudgetMaterialById(id: string) {
    return httpClient.get<BudgetMaterial>(`${this.basePath}/materials/${id}`);
  }

  async createBudgetMaterial(data: CreateBudgetMaterialDTO) {
    return httpClient.post<BudgetMaterial>(`${this.basePath}/materials`, data);
  }

  async updateBudgetMaterial(id: string, data: UpdateBudgetMaterialDTO) {
    return httpClient.put<BudgetMaterial>(`${this.basePath}/materials/${id}`, data);
  }

  async deleteBudgetMaterial(id: string) {
    return httpClient.delete<void>(`${this.basePath}/materials/${id}`);
  }

  async importBudgetMaterials(projectId: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('projectId', projectId);
    
    return httpClient.upload<{ imported: number; errors: string[] }>(
      `${this.basePath}/materials/import`, 
      formData
    );
  }

  async exportBudgetMaterials(projectId: string) {
    return httpClient.download(
      `${this.basePath}/materials/export?projectId=${projectId}`,
      `budget-materials-${projectId}.xlsx`
    );
  }
}

export class OutputService {
  private readonly basePath = '/output';

  // Material Output Requests
  async getRequests(params?: {
    pagination?: PaginationParams;
    filters?: FilterOptions;
    sort?: SortOptions;
  }) {
    const queryParams = new URLSearchParams();
    
    if (params?.pagination) {
      queryParams.append('page', params.pagination.page.toString());
      queryParams.append('limit', params.pagination.limit.toString());
    }
    
    if (params?.filters) {
      if (params.filters.search) {
        queryParams.append('search', params.filters.search);
      }
      if (params.filters.status) {
        queryParams.append('status', params.filters.status);
      }
      if (params.filters.dateRange) {
        queryParams.append('fromDate', params.filters.dateRange.from);
        queryParams.append('toDate', params.filters.dateRange.to);
      }
    }
    
    if (params?.sort) {
      queryParams.append('sortBy', params.sort.field);
      queryParams.append('sortOrder', params.sort.order);
    }

    return httpClient.get<PaginationResponse<MaterialOutputRequest>>(
      `${this.basePath}/requests?${queryParams.toString()}`
    );
  }

  async getRequestById(id: string) {
    return httpClient.get<MaterialOutputRequest>(`${this.basePath}/requests/${id}`);
  }

  async createRequest(data: {
    projectId: string;
    requestReason: string;
    items: {
      materialId: string;
      requestedQuantity: number;
      notes?: string;
    }[];
  }) {
    return httpClient.post<MaterialOutputRequest>(`${this.basePath}/requests`, data);
  }

  async updateRequest(id: string, data: {
    requestReason?: string;
    items?: {
      id?: string;
      materialId: string;
      requestedQuantity: number;
      notes?: string;
    }[];
  }) {
    return httpClient.put<MaterialOutputRequest>(`${this.basePath}/requests/${id}`, data);
  }

  async deleteRequest(id: string) {
    return httpClient.delete<void>(`${this.basePath}/requests/${id}`);
  }

  async submitRequest(id: string) {
    return httpClient.post<MaterialOutputRequest>(`${this.basePath}/requests/${id}/submit`);
  }

  async approveRequest(id: string, approvalData: {
    items: {
      id: string;
      approvedQuantity: number;
    }[];
    notes?: string;
  }) {
    return httpClient.post<MaterialOutputRequest>(`${this.basePath}/requests/${id}/approve`, approvalData);
  }

  async rejectRequest(id: string, reason: string) {
    return httpClient.post<MaterialOutputRequest>(`${this.basePath}/requests/${id}/reject`, { reason });
  }

  // Material Outputs (Actual deliveries)
  async getOutputs(params?: {
    pagination?: PaginationParams;
    filters?: FilterOptions;
    sort?: SortOptions;
  }) {
    const queryParams = new URLSearchParams();
    
    if (params?.pagination) {
      queryParams.append('page', params.pagination.page.toString());
      queryParams.append('limit', params.pagination.limit.toString());
    }
    
    if (params?.filters) {
      if (params.filters.search) {
        queryParams.append('search', params.filters.search);
      }
      if (params.filters.status) {
        queryParams.append('status', params.filters.status);
      }
      if (params.filters.dateRange) {
        queryParams.append('fromDate', params.filters.dateRange.from);
        queryParams.append('toDate', params.filters.dateRange.to);
      }
    }
    
    if (params?.sort) {
      queryParams.append('sortBy', params.sort.field);
      queryParams.append('sortOrder', params.sort.order);
    }

    return httpClient.get<PaginationResponse<MaterialOutput>>(
      `${this.basePath}/history?${queryParams.toString()}`
    );
  }

  async getOutputById(id: string) {
    return httpClient.get<MaterialOutput>(`${this.basePath}/history/${id}`);
  }

  async createOutput(data: CreateMaterialOutputDTO) {
    return httpClient.post<MaterialOutput>(`${this.basePath}/history`, data);
  }

  async updateOutput(id: string, data: UpdateMaterialOutputDTO) {
    return httpClient.put<MaterialOutput>(`${this.basePath}/history/${id}`, data);
  }

  async deleteOutput(id: string) {
    return httpClient.delete<void>(`${this.basePath}/history/${id}`);
  }
}

// Export service instances
export const materialService = new MaterialService();
export const budgetService = new BudgetService();
export const outputService = new OutputService();
