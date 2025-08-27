import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { materialService } from '../services/api';
import type { 
  CreateMaterialDTO, 
  UpdateMaterialDTO 
} from '../types/material';
import type { PaginationParams, FilterOptions, SortOptions } from '../types/common';
import { MESSAGES } from '../constants';

// Query Keys
export const materialKeys = {
  all: ['materials'] as const,
  lists: () => [...materialKeys.all, 'list'] as const,
  list: (params?: {
    pagination?: PaginationParams;
    filters?: FilterOptions;
    sort?: SortOptions;
  }) => [...materialKeys.lists(), params] as const,
  details: () => [...materialKeys.all, 'detail'] as const,
  detail: (id: string) => [...materialKeys.details(), id] as const,
  search: (query: string) => [...materialKeys.all, 'search', query] as const,
  categories: ['material-categories'] as const,
};

// Material Hooks
export function useMaterials(params?: {
  pagination?: PaginationParams;
  filters?: FilterOptions;
  sort?: SortOptions;
}) {
  return useQuery({
    queryKey: materialKeys.list(params),
    queryFn: () => materialService.getMaterials(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useMaterial(id: string, enabled = true) {
  return useQuery({
    queryKey: materialKeys.detail(id),
    queryFn: () => materialService.getMaterialById(id),
    enabled: !!id && enabled,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useMaterialSearch(query: string, limit = 10) {
  return useQuery({
    queryKey: materialKeys.search(query),
    queryFn: () => materialService.searchMaterials(query, limit),
    enabled: query.length > 2,
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function useMaterialCategories() {
  return useQuery({
    queryKey: materialKeys.categories,
    queryFn: () => materialService.getCategories(),
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
}

// Material Mutations
export function useCreateMaterial() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateMaterialDTO) => materialService.createMaterial(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: materialKeys.lists() });
      // Show success message - you can integrate with toast notification
      console.log(MESSAGES.SUCCESS.CREATE);
    },
    onError: (error) => {
      console.error('Create material error:', error);
    },
  });
}

export function useUpdateMaterial() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMaterialDTO }) => 
      materialService.updateMaterial(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: materialKeys.lists() });
      queryClient.invalidateQueries({ queryKey: materialKeys.detail(id) });
      console.log(MESSAGES.SUCCESS.UPDATE);
    },
    onError: (error) => {
      console.error('Update material error:', error);
    },
  });
}

export function useDeleteMaterial() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => materialService.deleteMaterial(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: materialKeys.lists() });
      console.log(MESSAGES.SUCCESS.DELETE);
    },
    onError: (error) => {
      console.error('Delete material error:', error);
    },
  });
}

// Category Mutations
export function useCreateCategory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: { name: string; description?: string; parentId?: string }) => 
      materialService.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: materialKeys.categories });
      console.log(MESSAGES.SUCCESS.CREATE);
    },
    onError: (error) => {
      console.error('Create category error:', error);
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { 
      id: string; 
      data: { name?: string; description?: string; parentId?: string } 
    }) => materialService.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: materialKeys.categories });
      console.log(MESSAGES.SUCCESS.UPDATE);
    },
    onError: (error) => {
      console.error('Update category error:', error);
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => materialService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: materialKeys.categories });
      console.log(MESSAGES.SUCCESS.DELETE);
    },
    onError: (error) => {
      console.error('Delete category error:', error);
    },
  });
}
