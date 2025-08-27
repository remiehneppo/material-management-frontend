import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { budgetService } from '../services/api';
import type { 
  CreateBudgetMaterialDTO, 
  UpdateBudgetMaterialDTO 
} from '../types/material';
import type { PaginationParams, FilterOptions, SortOptions } from '../types/common';
import { MESSAGES } from '../constants';

// Query Keys
export const budgetKeys = {
  all: ['budget'] as const,
  projects: () => [...budgetKeys.all, 'projects'] as const,
  projectsList: (params?: {
    pagination?: PaginationParams;
    filters?: FilterOptions;
    sort?: SortOptions;
  }) => [...budgetKeys.projects(), 'list', params] as const,
  project: (id: string) => [...budgetKeys.projects(), id] as const,
  materials: () => [...budgetKeys.all, 'materials'] as const,
  materialsList: (projectId: string, params?: {
    pagination?: PaginationParams;
    filters?: FilterOptions;
  }) => [...budgetKeys.materials(), projectId, params] as const,
  material: (id: string) => [...budgetKeys.materials(), id] as const,
};

// Budget Project Hooks
export function useBudgetProjects(params?: {
  pagination?: PaginationParams;
  filters?: FilterOptions;
  sort?: SortOptions;
}) {
  return useQuery({
    queryKey: budgetKeys.projectsList(params),
    queryFn: () => budgetService.getProjects(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useBudgetProject(id: string, enabled = true) {
  return useQuery({
    queryKey: budgetKeys.project(id),
    queryFn: () => budgetService.getProjectById(id),
    enabled: !!id && enabled,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Budget Material Hooks
export function useBudgetMaterials(projectId: string, params?: {
  pagination?: PaginationParams;
  filters?: FilterOptions;
}) {
  return useQuery({
    queryKey: budgetKeys.materialsList(projectId, params),
    queryFn: () => budgetService.getBudgetMaterials(projectId, params),
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useBudgetMaterial(id: string, enabled = true) {
  return useQuery({
    queryKey: budgetKeys.material(id),
    queryFn: () => budgetService.getBudgetMaterialById(id),
    enabled: !!id && enabled,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Budget Project Mutations
export function useCreateBudgetProject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: {
      name: string;
      code: string;
      description?: string;
      startDate: string;
      endDate?: string;
      totalBudget: number;
    }) => budgetService.createProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.projects() });
      console.log(MESSAGES.SUCCESS.CREATE);
    },
    onError: (error) => {
      console.error('Create budget project error:', error);
    },
  });
}

export function useUpdateBudgetProject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { 
      id: string; 
      data: {
        name?: string;
        code?: string;
        description?: string;
        startDate?: string;
        endDate?: string;
        totalBudget?: number;
        status?: string;
      } 
    }) => budgetService.updateProject(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.projects() });
      queryClient.invalidateQueries({ queryKey: budgetKeys.project(id) });
      console.log(MESSAGES.SUCCESS.UPDATE);
    },
    onError: (error) => {
      console.error('Update budget project error:', error);
    },
  });
}

export function useDeleteBudgetProject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => budgetService.deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.projects() });
      console.log(MESSAGES.SUCCESS.DELETE);
    },
    onError: (error) => {
      console.error('Delete budget project error:', error);
    },
  });
}

// Budget Material Mutations
export function useCreateBudgetMaterial() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateBudgetMaterialDTO) => budgetService.createBudgetMaterial(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: budgetKeys.materialsList(variables.projectId) 
      });
      queryClient.invalidateQueries({ 
        queryKey: budgetKeys.project(variables.projectId) 
      });
      console.log(MESSAGES.SUCCESS.CREATE);
    },
    onError: (error) => {
      console.error('Create budget material error:', error);
    },
  });
}

export function useUpdateBudgetMaterial() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBudgetMaterialDTO }) => 
      budgetService.updateBudgetMaterial(id, data),
    onSuccess: (_, { data }) => {
      if (data.projectId) {
        queryClient.invalidateQueries({ 
          queryKey: budgetKeys.materialsList(data.projectId) 
        });
        queryClient.invalidateQueries({ 
          queryKey: budgetKeys.project(data.projectId) 
        });
      }
      queryClient.invalidateQueries({ queryKey: budgetKeys.materials() });
      console.log(MESSAGES.SUCCESS.UPDATE);
    },
    onError: (error) => {
      console.error('Update budget material error:', error);
    },
  });
}

export function useDeleteBudgetMaterial() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => budgetService.deleteBudgetMaterial(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.materials() });
      queryClient.invalidateQueries({ queryKey: budgetKeys.projects() });
      console.log(MESSAGES.SUCCESS.DELETE);
    },
    onError: (error) => {
      console.error('Delete budget material error:', error);
    },
  });
}

// Import/Export Operations
export function useImportBudgetMaterials() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ projectId, file }: { projectId: string; file: File }) => 
      budgetService.importBudgetMaterials(projectId, file),
    onSuccess: (result, { projectId }) => {
      queryClient.invalidateQueries({ 
        queryKey: budgetKeys.materialsList(projectId) 
      });
      queryClient.invalidateQueries({ 
        queryKey: budgetKeys.project(projectId) 
      });
      console.log(`Import completed: ${result.data.imported} items imported`);
      if (result.data.errors.length > 0) {
        console.warn('Import errors:', result.data.errors);
      }
    },
    onError: (error) => {
      console.error('Import budget materials error:', error);
    },
  });
}

export function useExportBudgetMaterials() {
  return useMutation({
    mutationFn: (projectId: string) => budgetService.exportBudgetMaterials(projectId),
    onSuccess: () => {
      console.log('Export completed');
    },
    onError: (error) => {
      console.error('Export budget materials error:', error);
    },
  });
}
