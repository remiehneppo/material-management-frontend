// Common types for the application
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginationResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface ApiError {
  success: false;
  error: string;
  details?: Record<string, string[]>;
}

// Form states
export interface FormState {
  isLoading: boolean;
  errors: Record<string, string>;
}

// Filter and sort options
export interface FilterOptions {
  search?: string;
  status?: string;
  dateRange?: {
    from: string;
    to: string;
  };
}

export interface SortOptions {
  field: string;
  order: 'asc' | 'desc';
}
