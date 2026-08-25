import { apiClient } from './apiClient';
import type { 
  ApiResponse, 
  LoginRequest, 
  LoginResponse, 
} from '../types/api';

export class AuthService {
  /**
   * User login
   * POST /auth/login
   */
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', credentials);
    
    // Store tokens after successful login
    if (response.data.status && response.data.data) {
      apiClient.setTokens(response.data.data.access_token);
    }
    
    return response.data;
  }

  /**
   * User logout
   * POST /auth/logout
   */
  async logout(): Promise<ApiResponse> {
    try {
      const response = await apiClient.post<ApiResponse>('/auth/logout');
      return response.data;
    } finally {
      // Clear tokens regardless of API response
      apiClient.logout();
    }
  }

  /**
   * Refresh access token
   * POST /auth/refresh
   * Note: This is now handled automatically by the API client interceptor
   * This method is kept for manual refresh if needed
   */
  async restoreSession(): Promise<boolean> {
    return apiClient.restoreSession();
  }

}

export const authService = new AuthService();
export default authService;
