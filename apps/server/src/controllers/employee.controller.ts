import type { Request, Response } from "express";
import { EmployeeService } from "../services/employee.service.js";
import { ResponseHelper, HttpStatus } from "../utils/response.utils.js";
import { asyncHandler } from "../middleware/error.middleware.js";
import {
  type CreateEmployeeInput,
  type LoginEmployeeInput,
  type ChangePasswordInput,
  type UpdateEmployeeInput,
  type UpdateRoleInput,
  EmployeeRole,
} from "../validations/employee.validation.js";

/**
 * Employee Controller
 * Handles HTTP requests and responses for employee operations
 */
export class EmployeeController {
  /**
   * Create a new employee
   * POST /api/employees
   * Access: HR, Admin
   */
  static createEmployee = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const data: CreateEmployeeInput = req.body;
      const creatorRole = req.user!.role;

      const result = await EmployeeService.createEmployee(data, creatorRole);

      res.status(HttpStatus.CREATED).json(
        ResponseHelper.success("Employee created successfully", {
          employee: result.employee,
          loginId: result.loginId,
          temporaryPassword: result.generatedPassword,
        })
      );
    }
  );

  /**
   * Login employee
   * POST /api/employees/login
   * Access: Public
   */
  static login = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const data: LoginEmployeeInput = req.body;

      const result = await EmployeeService.login(data);
      res.cookie("accessToken", result.tokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
      });

      res
        .status(HttpStatus.OK)
        .json(
          ResponseHelper.success(
            result.isPasswordChanged
              ? "Login successful"
              : "Login successful. Please change your password.",
            result
          )
        );
    }
  );

  /**
   * Change password
   * POST /api/employees/change-password
   * Access: Authenticated
   */
  static changePassword = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const data: ChangePasswordInput = req.body;
      const loginId = req.user!.loginId;

      await EmployeeService.changePassword(loginId, data);

      res
        .status(HttpStatus.OK)
        .json(ResponseHelper.success("Password changed successfully"));
    }
  );

  /**
   * Refresh token
   * POST /api/employees/refresh-token
   * Access: Public (requires valid refresh token)
   */
  static refreshToken = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json(ResponseHelper.error("Refresh token is required"));
        return;
      }

      const tokens = await EmployeeService.refreshToken(refreshToken);

      res
        .status(HttpStatus.OK)
        .json(
          ResponseHelper.success("Token refreshed successfully", { tokens })
        );
    }
  );

  /**
   * Get current user profile
   * GET /api/employees/me
   * Access: Authenticated
   */
  static getProfile = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const loginId = req.user!.loginId;

      const employee = await EmployeeService.getProfile(loginId);

      res
        .status(HttpStatus.OK)
        .json(
          ResponseHelper.success("Profile retrieved successfully", { employee })
        );
    }
  );

  /**
   * Update current user profile
   * PATCH /api/employees/me
   * Access: Authenticated
   */
  static updateProfile = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const loginId = req.user!.loginId;
      const data: UpdateEmployeeInput = req.body;

      const employee = await EmployeeService.updateProfile(loginId, data);

      res
        .status(HttpStatus.OK)
        .json(
          ResponseHelper.success("Profile updated successfully", { employee })
        );
    }
  );

  /**
   * Get employee by ID
   * GET /api/employees/:id
   * Access: HR, Admin
   */
  static getEmployeeById = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { loginId } = req.params;

      if (loginId) {
        const employee = await EmployeeService.getEmployeeByLoginId(loginId);

        res.status(HttpStatus.OK).json(
          ResponseHelper.success("Employee retrieved successfully", {
            employee,
          })
        );
      }
    }
  );

  /**
   * Get all employees with pagination
   * GET /api/employees
   * Access: HR, Admin
   */
  static getAllEmployees = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const role = req.query.role as EmployeeRole | undefined;
      const companyName = req.query.companyName as string | undefined;
      const isActive = req.query.isActive
        ? req.query.isActive === "true"
        : undefined;

      // Build filters object conditionally to satisfy exactOptionalPropertyTypes
      const filters: {
        role?: EmployeeRole;
        companyName?: string;
        isActive?: boolean;
      } = {};
      if (role !== undefined) filters.role = role;
      if (companyName !== undefined) filters.companyName = companyName;
      if (isActive !== undefined) filters.isActive = isActive;

      const { employees, total } = await EmployeeService.getAllEmployees(
        page,
        limit,
        filters
      );

      res
        .status(HttpStatus.OK)
        .json(
          ResponseHelper.paginated(
            "Employees retrieved successfully",
            employees,
            page,
            limit,
            total
          )
        );
    }
  );

  /**
   * Update employee role
   * PATCH /api/employees/:id/role
   * Access: Admin only
   */
  static updateRole = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { loginId } = req.params;
      const { role } = req.body;
      const adminLoginId = req.user!.loginId;

      if (!loginId) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json(ResponseHelper.error("Login ID is required"));
        return;
      }

      const data: UpdateRoleInput = { loginId, role };

      const employee = await EmployeeService.updateRole(data, adminLoginId);

      res
        .status(HttpStatus.OK)
        .json(
          ResponseHelper.success("Role updated successfully", { employee })
        );
    }
  );

  /**
   * Deactivate employee
   * PATCH /api/employees/:id/deactivate
   * Access: HR, Admin
   */
  static deactivateEmployee = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { loginId } = req.params;
      const deactivatorLoginId = req.user!.loginId;
      const deactivatorRole = req.user!.role;

      if (!loginId) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json(ResponseHelper.error("Login ID is required"));
        return;
      }

      const employee = await EmployeeService.deactivateEmployee(
        loginId,
        deactivatorLoginId,
        deactivatorRole
      );

      res.status(HttpStatus.OK).json(
        ResponseHelper.success("Employee deactivated successfully", {
          employee,
        })
      );
    }
  );

  /**
   * Activate employee
   * PATCH /api/employees/:id/activate
   * Access: HR, Admin
   */
  static activateEmployee = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { loginId } = req.params;
      const activatorRole = req.user!.role;

      if (!loginId) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json(ResponseHelper.error("Login ID is required"));
        return;
      }

      const employee = await EmployeeService.activateEmployee(
        loginId,
        activatorRole
      );

      res.status(HttpStatus.OK).json(
        ResponseHelper.success("Employee activated successfully", {
          employee,
        })
      );
    }
  );

  /**
   * Reset employee password
   * POST /api/employees/:id/reset-password
   * Access: HR, Admin
   */
  static resetPassword = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { loginId } = req.params;
      const resetterRole = req.user!.role;

      if (!loginId) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json(ResponseHelper.error("Login ID is required"));
        return;
      }

      const { newPassword } = await EmployeeService.resetPassword(
        loginId,
        resetterRole
      );

      res.status(HttpStatus.OK).json(
        ResponseHelper.success("Password reset successfully", {
          temporaryPassword: newPassword,
        })
      );
    }
  );

  /**
   * Search employees
   * GET /api/employees/search
   * Access: HR, Admin
   */
  static searchEmployees = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const searchTerm = req.query.q as string;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      if (!searchTerm) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json(ResponseHelper.error("Search query 'q' is required"));
        return;
      }

      const { employees, total } = await EmployeeService.searchEmployees(
        searchTerm,
        page,
        limit
      );

      res
        .status(HttpStatus.OK)
        .json(
          ResponseHelper.paginated(
            "Search results retrieved successfully",
            employees,
            page,
            limit,
            total
          )
        );
    }
  );

  /**
   * Logout (client-side token invalidation)
   * POST /api/employees/logout
   * Access: Authenticated
   */
  static logout = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      // Clear the access token cookie
      res.clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      res.status(HttpStatus.OK).json(
        ResponseHelper.success("Logged out successfully")
      );
    }
  );
}

export default EmployeeController;
