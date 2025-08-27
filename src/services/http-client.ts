import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { API_CONFIG, MESSAGES } from '../constants';
import type { ApiResponse, ApiError } from '../types/common';

export class HttpClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: API_CONFIG.DEFAULT_HEADERS,
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Add request timestamp for debugging
        (config as any).metadata = { startTime: new Date() };
        
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        // Log response time in development
        if (import.meta.env.DEV) {
          const config = response.config as any;
          const duration = new Date().getTime() - config.metadata?.startTime?.getTime();
          console.log(`API ${config.method?.toUpperCase()} ${config.url} took ${duration}ms`);
        }
        
        return response;
      },
      (error) => {
        // Handle common errors
        if (error.response) {
          const status = error.response.status;
          
          switch (status) {
            case 401:
              // Unauthorized - redirect to login
              localStorage.removeItem('auth_token');
              window.location.href = '/login';
              break;
            case 403:
              // Forbidden
              console.error('Access forbidden');
              break;
            case 404:
              // Not found
              console.error('Resource not found');
              break;
            case 500:
              // Server error
              console.error('Internal server error');
              break;
          }
        } else if (error.request) {
          // Network error
          console.error('Network error:', error.message);
        }
        
        return Promise.reject(this.transformError(error));
      }
    );
  }

  private transformError(error: any): ApiError {
    if (error.response?.data) {
      return {
        success: false,
        error: error.response.data.message || error.response.data.error || MESSAGES.ERROR.SERVER,
        details: error.response.data.details,
      };
    }
    
    if (error.request) {
      return {
        success: false,
        error: MESSAGES.ERROR.NETWORK,
      };
    }
    
    return {
      success: false,
      error: error.message || MESSAGES.ERROR.SERVER,
    };
  }

  // Generic methods
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.get<ApiResponse<T>>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.post<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.put<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.patch<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.delete<ApiResponse<T>>(url, config);
    return response.data;
  }

  // File upload
  async upload<T>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.post<ApiResponse<T>>(url, formData, {
      ...config,
      headers: {
        ...config?.headers,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Download file
  async download(url: string, filename?: string, config?: AxiosRequestConfig): Promise<void> {
    const response = await this.client.get(url, {
      ...config,
      responseType: 'blob',
    });

    // Create download link
    const blob = new Blob([response.data]);
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  }
}

// Create singleton instance
export const httpClient = new HttpClient();
