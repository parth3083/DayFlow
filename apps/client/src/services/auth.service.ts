import apiClient, { getErrorMessage } from '@/lib/api.config';
import { setTokens, clearTokens } from '@/lib/token.utils';
import type {
  ApiResponse,
  LoginCredentials,
  LoginResponse,
  ChangePasswordRequest,
  RefreshTokenRequest,
  RefreshTokenResponse,
  User,
} from '@/types/auth.types';

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */
class AuthService {
  private readonly BASE_PATH = '/employees';

  /**
   * Login with email or loginId and password
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<ApiResponse<LoginResponse>>(
        `${this.BASE_PATH}/login`,
        credentials
      );

      if (response.data.success && response.data.data) {
        const { employee, tokens, isPasswordChanged } = response.data.data as any;
        const { accessToken, refreshToken } = tokens;
        
        // Store tokens
        setTokens(accessToken, refreshToken);

        return {
          employee: {
            ...employee,
            passwordChangeRequired: !isPasswordChanged
          },
          accessToken,
          refreshToken,
          passwordChangeRequired: !isPasswordChanged // backend: true if changed, frontend: true if REQUIRED
        } as LoginResponse;
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    try {
      const response = await apiClient.post<ApiResponse<RefreshTokenResponse>>(
        `${this.BASE_PATH}/refresh-token`,
        { refreshToken }
      );

      if (response.data.success && response.data.data) {
        const { accessToken, refreshToken: newRefreshToken } = response.data.data;
        setTokens(accessToken, newRefreshToken);
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Token refresh failed');
      }
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Change password (required on first login or user-initiated)
   */
  async changePassword(passwordData: ChangePasswordRequest): Promise<void> {
    try {
      const response = await apiClient.post<ApiResponse>(
        `${this.BASE_PATH}/change-password`,
        passwordData
      );

      if (!response.data.success) {
        throw new Error(response.data.message || 'Password change failed');
      }
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Get current user profile
   */
  async getProfile(): Promise<User> {
    try {
      const response = await apiClient.get<ApiResponse<{ employee: User }>>(
        `${this.BASE_PATH}/me`
      );

      if (response.data.success && response.data.data) {
        const { employee } = response.data.data;
        const { isPasswordChanged, ...rest } = employee as any;
        
        return {
          ...rest,
          passwordChangeRequired: !isPasswordChanged
        } as User;
      } else {
        throw new Error(response.data.message || 'Failed to fetch profile');
      }
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Logout - clear tokens and invalidate session
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post<ApiResponse>(`${this.BASE_PATH}/logout`);
    } catch (error) {
      // Even if the API call fails, we still clear local tokens
      console.error('Logout error:', error);
    } finally {
      clearTokens();
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
