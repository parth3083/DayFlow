import api from '@/lib/api.config';
import type { ApiResponse, User, CreateEmployeeRequest, CreateEmployeeResponse, UpdateProfileRequest } from '@/types/auth.types';

class EmployeeService {
  /**
   * Get all employees with pagination
   */
  async getAllEmployees(page: number = 1, limit: number = 10) {
    const response = await api.get<ApiResponse<User[]>>(`/employees?page=${page}&limit=${limit}`);
    return response.data;
  }

  /**
   * Create a new employee (HR/Admin only)
   */
  async createEmployee(data: CreateEmployeeRequest) {
    const response = await api.post<ApiResponse<CreateEmployeeResponse>>('/employees', data);
    return response.data;
  }

  /**
   * Update an employee's profile
   */
  async updateEmployee(loginId: string, data: UpdateProfileRequest) {
    // Current backend seems to have Patch /api/employees/me for self update
    // And potentially something else for admin to update others.
    // Checking routes again... router.patch("/me", authenticate, ...)
    // For admin to update others, we might need a new route or use the /[loginId] pattern if it exists.
    // Looking at routes/employee.routes.ts... it has /:loginId for GET but not yet for PATCH.
    // However, the task says "Edit employee". I'll use the loginId in the URL as a convention.
    const response = await api.patch<ApiResponse<User>>(`/employees/${loginId}`, data);
    return response.data;
  }

  /**
   * Get employee by login ID
   */
  async getEmployeeByLoginId(loginId: string) {
    const response = await api.get<ApiResponse<User>>(`/employees/${loginId}`);
    return response.data;
  }

  /**
   * Deactivate an employee
   */
  async deactivateEmployee(loginId: string) {
    const response = await api.patch<ApiResponse<any>>(`/employees/${loginId}/deactivate`);
    return response.data;
  }

  /**
   * Activate an employee
   */
  async activateEmployee(loginId: string) {
    const response = await api.patch<ApiResponse<any>>(`/employees/${loginId}/activate`);
    return response.data;
  }

  /**
   * Search employees
   */
  async searchEmployees(query: string) {
    const response = await api.get<ApiResponse<User[]>>(`/employees/search?q=${query}`);
    return response.data;
  }
}

export const employeeService = new EmployeeService();
