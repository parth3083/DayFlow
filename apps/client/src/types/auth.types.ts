// API Response wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// User/Employee interface
export interface User {
  _id: string;
  loginId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'employee' | 'hr' | 'admin';
  companyName: string;
  phoneNumber: string;
  department: string;
  position: string;
  joiningYear: number;
  serialNumber: number;
  imageUrl?: string;
  isActive: boolean;
  passwordChangeRequired: boolean;
}

// Login credentials
export interface LoginCredentials {
  email?: string;
  loginId?: string;
  password: string;
}

// Login response
export interface LoginResponse {
  employee: User;
  accessToken: string;
  refreshToken: string;
  passwordChangeRequired: boolean;
}

// Change password request
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Refresh token request
export interface RefreshTokenRequest {
  refreshToken: string;
}

// Refresh token response
export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

// Auth state for Redux
export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  passwordChangeRequired: boolean;
}

// Create employee request (for HR/Admin)
export interface CreateEmployeeRequest {
  companyName: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  imageUrl?: string;
  role: 'employee' | 'hr' | 'admin';
}

// Create employee response
export interface CreateEmployeeResponse {
  employee: User;
  loginId: string;
  temporaryPassword: string;
}

// Update profile request
export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  imageUrl?: string;
}
