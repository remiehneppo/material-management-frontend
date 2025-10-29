import { apiClient } from './apiClient';
import type { ApiResponse, User, UserProfileUpdate, UserChangePassword } from '../types/api';

export class UserService {
  /**
   * Get current user profile
   * GET /user/profile
   */
  async getProfile(): Promise<ApiResponse<User>> {
    try {
      const response = await apiClient.get('/user/profile');
      console.log('Raw profile response:', response);
      
      // Handle case where server returns data directly without ApiResponse wrapper
      if (response.data && typeof response.data === 'object') {
        // If response.data has user fields directly (not wrapped in ApiResponse)
        if ('id' in response.data && 'username' in response.data) {
          return {
            status: true,
            message: 'Success',
            data: response.data as unknown as User
          };
        }
        // If response.data is already in ApiResponse format
        if ('status' in response.data) {
          return response.data as ApiResponse<User>;
        }
      }
      
      // Fallback
      return {
        status: false,
        message: 'Invalid response format',
        data: undefined
      };
    } catch (error) {
      console.error('Error in getProfile:', error);
      throw error;
    }
  }

  /**
   * Update user profile
   * PUT /user/profile
   */
  async updateProfile(userData: Partial<UserProfileUpdate>): Promise<ApiResponse<User>> {
    try {
      const response = await apiClient.post('/user/profile', userData);
      console.log('Raw update profile response:', response);
      
      // Handle case where server returns data directly without ApiResponse wrapper
      if (response.data && typeof response.data === 'object') {
        // If response.data has user fields directly (not wrapped in ApiResponse)
        if ('id' in response.data && 'username' in response.data) {
          return {
            status: true,
            message: 'Profile updated successfully',
            data: response.data as unknown as User
          };
        }
        // If response.data is already in ApiResponse format
        if ('status' in response.data) {
          return response.data as ApiResponse<User>;
        }
      }
      
      // Fallback for successful response without proper format
      return {
        status: true,
        message: 'Profile updated successfully',
        data: undefined
      };
    } catch (error) {
      console.error('Error in updateProfile:', error);
      throw error;
    }
  }

  /**
   * Change user password
   * PUT /user/change-password
   */
  async changePassword(request: UserChangePassword): Promise<ApiResponse> {
    try {
      const response = await apiClient.post('/user/change-password', request);
      console.log('Raw change password response:', response);
      
      // Handle case where server returns success without proper ApiResponse wrapper
      if (response.status >= 200 && response.status < 300) {
        if (response.data && typeof response.data === 'object' && 'status' in response.data) {
          return response.data as ApiResponse;
        }
        
        // Fallback for successful response
        return {
          status: true,
          message: 'Password changed successfully'
        };
      }
      
      return {
        status: false,
        message: 'Failed to change password'
      };
    } catch (error) {
      console.error('Error in changePassword:', error);
      throw error;
    }
  }
}

export const userService = new UserService();
export default userService;