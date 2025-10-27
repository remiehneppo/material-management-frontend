import { apiClient } from './apiClient';
import type { 
  ApiResponse, 
  LoginRequest, 
  LoginResponse, 
  RefreshRequest 
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
      apiClient.setTokens(
        response.data.data.access_token,
        response.data.data.refresh_token
      );
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
   */
  async refreshToken(refreshRequest: RefreshRequest): Promise<ApiResponse<LoginResponse>> {
    // const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/refresh', refreshRequest);
    
    // // Update stored tokens after successful refresh
    // if (response.data.status && response.data.data) {
    //   apiClient.setTokens(
    //     response.data.data.access_token,
    //     response.data.data.refresh_token
    //   );
    // }
    
    // return response.data;
    throw new Error('Not implemented');
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('access_token');
  }

  /**
   * Get current access token
   */
  getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('access_token');
  }
}

export const authService = new AuthService();
export default authService;