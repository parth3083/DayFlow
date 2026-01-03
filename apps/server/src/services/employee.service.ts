import Employee, { type IEmployee } from "../models/employee.model.js";
import { AuthUtils, type TokenResponse } from "../utils/auth.utils.js";
import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  BadRequestError,
} from "../utils/response.utils.js";
import {
  type CreateEmployeeInput,
  type LoginEmployeeInput,
  type ChangePasswordInput,
  type UpdateEmployeeInput,
  type UpdateRoleInput,
  EmployeeRole,
} from "../validations/employee.validation.js";

/**
 * Employee Creation Response Interface
 */
export interface EmployeeCreationResponse {
  employee: IEmployee;
  generatedPassword: string;
  loginId: string;
}

/**
 * Login Response Interface
 */
export interface LoginResponse {
  employee: Omit<IEmployee, "password">;
  tokens: TokenResponse;
  isPasswordChanged: boolean;
}

/**
 * Employee Service Class
 * Handles all business logic related to employee operations
 */
export class EmployeeService {
  /**
   * Create a new employee (Only HR or Admin can create)
   */
  static async createEmployee(
    data: CreateEmployeeInput,
    creatorRole: EmployeeRole
  ): Promise<EmployeeCreationResponse> {
    // Check if creator has permission to create employees
    if (
      !AuthUtils.hasRequiredRole(creatorRole, [
        EmployeeRole.HR,
        EmployeeRole.ADMIN,
      ])
    ) {
      throw new ForbiddenError(
        "Only HR officers and Admins can create employees"
      );
    }

    // Check if email already exists
    const existingEmployee = await Employee.findOne({ email: data.email });
    if (existingEmployee) {
      throw new ConflictError("An employee with this email already exists");
    }

    // Get current year and next serial number
    const joiningYear = AuthUtils.getCurrentYear();
    const serialNumber = await Employee.getNextSerialNumber(joiningYear);

    // Generate login ID
    const loginId = AuthUtils.generateLoginId(
      data.companyName,
      data.firstName,
      data.lastName,
      joiningYear,
      serialNumber
    );

    // Check if login ID already exists (edge case)
    const existingLoginId = await Employee.findOne({ loginId });
    if (existingLoginId) {
      throw new ConflictError(
        "Login ID generation conflict. Please try again."
      );
    }

    // Generate a random password
    const generatedPassword = AuthUtils.generatePassword();
    const hashedPassword = await AuthUtils.hashPassword(generatedPassword);

    // Create the employee
    const employee = await Employee.create({
      companyName: data.companyName,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      ...(data.imageUrl && { imageUrl: data.imageUrl }),
      password: hashedPassword,
      loginId,
      role: data.role || EmployeeRole.EMPLOYEE,
      serialNumber,
      joiningYear,
      isPasswordChanged: false,
      isActive: true,
    });

    return {
      employee,
      generatedPassword,
      loginId,
    };
  }

  /**
   * Login an employee using email or login ID
   */
  static async login(data: LoginEmployeeInput): Promise<LoginResponse> {
    // Find employee by email or login ID
    const query: { email?: string; loginId?: string } = {};

    if (data.email) {
      query.email = data.email.toLowerCase();
    } else if (data.loginId) {
      query.loginId = data.loginId.toUpperCase();
    }

    const employee = await Employee.findOne(query).select("+password");

    if (!employee) {
      throw new UnauthorizedError("Invalid credentials");
    }

    // Check if employee is active
    if (!employee.isActive) {
      throw new ForbiddenError(
        "Your account has been deactivated. Please contact HR."
      );
    }

    // Verify password
    const isPasswordValid = await AuthUtils.comparePassword(
      data.password,
      employee.password
    );

    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid credentials");
    }

    // Update last login
    employee.lastLogin = new Date();
    await employee.save();

    // Generate tokens
    const tokens = AuthUtils.generateTokens({
      email: employee.email,
      loginId: employee.loginId,
      role: employee.role,
    });

    // Return employee without password
    const employeeObject = employee.toJSON() as Omit<IEmployee, "password">;

    return {
      employee: employeeObject,
      tokens,
      isPasswordChanged: employee.isPasswordChanged,
    };
  }

  /**
   * Change employee password
   */
  static async changePassword(
    loginId: string,
    data: ChangePasswordInput
  ): Promise<void> {
    const employee = await Employee.findOne({ loginId }).select("+password");

    if (!employee) {
      throw new NotFoundError("Employee not found");
    }

    // Verify current password
    const isCurrentPasswordValid = await AuthUtils.comparePassword(
      data.currentPassword,
      employee.password
    );

    if (!isCurrentPasswordValid) {
      throw new UnauthorizedError("Current password is incorrect");
    }

    // Check if new password is same as current
    const isSamePassword = await AuthUtils.comparePassword(
      data.newPassword,
      employee.password
    );

    if (isSamePassword) {
      throw new BadRequestError(
        "New password must be different from current password"
      );
    }

    // Hash and save new password
    const hashedPassword = await AuthUtils.hashPassword(data.newPassword);
    employee.password = hashedPassword;
    employee.isPasswordChanged = true;
    await employee.save();
  }

  /**
   * Refresh access token using refresh token
   */
  static async refreshToken(refreshToken: string): Promise<TokenResponse> {
    try {
      const tokens = AuthUtils.refreshTokens(refreshToken);

      // Verify the employee still exists and is active
      const payload = AuthUtils.verifyRefreshToken(refreshToken);
      const employee = await Employee.findOne({ loginId: payload.loginId });

      if (!employee || !employee.isActive) {
        throw new UnauthorizedError("Employee account is no longer active");
      }

      return tokens;
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        throw error;
      }
      throw new UnauthorizedError("Invalid or expired refresh token");
    }
  }

  /**
   * Get employee by login ID
   */
  static async getEmployeeByLoginId(loginId: string): Promise<IEmployee> {
    const employee = await Employee.findOne({ loginId }).select(
      "firstName lastName email phoneNumber loginId role joiningYear isActive serialNumber isPasswordChanged"
    );

    if (!employee) {
      throw new NotFoundError("Employee not found");
    }

    return employee;
  }

  /**
   * Get employee profile (current logged-in user)
   */
  static async getProfile(loginId: string): Promise<IEmployee> {
    return this.getEmployeeByLoginId(loginId);
  }

  /**
   * Update employee profile
   */
  static async updateProfile(
    loginId: string,
    data: UpdateEmployeeInput
  ): Promise<IEmployee> {
    const employee = await Employee.findOneAndUpdate(
      { loginId },
      { $set: data },
      { new: true, runValidators: true }
    ).select(
      "firstName lastName email phoneNumber loginId role joiningYear isActive serialNumber isPasswordChanged"
    );

    if (!employee) {
      throw new NotFoundError("Employee not found");
    }

    return employee;
  }

  /**
   * Update employee role (Admin only)
   */
  static async updateRole(
    data: UpdateRoleInput,
    adminLoginId: string
  ): Promise<IEmployee> {
    // Prevent self role update
    if (data.loginId === adminLoginId) {
      throw new BadRequestError("You cannot change your own role");
    }

    const employee = await Employee.findOneAndUpdate(
      { loginId: data.loginId },
      { $set: { role: data.role } },
      { new: true, runValidators: true }
    ).select(
      "firstName lastName email phoneNumber loginId role joiningYear isActive serialNumber isPasswordChanged"
    );

    if (!employee) {
      throw new NotFoundError("Employee not found");
    }

    return employee;
  }

  /**
   * Deactivate an employee (Admin or HR only)
   */
  static async deactivateEmployee(
    loginId: string,
    deactivatorLoginId: string,
    deactivatorRole: EmployeeRole
  ): Promise<IEmployee> {
    // Prevent self deactivation
    if (loginId === deactivatorLoginId) {
      throw new BadRequestError("You cannot deactivate your own account");
    }

    const employee = await Employee.findOne({ loginId });

    if (!employee) {
      throw new NotFoundError("Employee not found");
    }

    // Check if deactivator has permission
    if (!AuthUtils.canManageUser(deactivatorRole, employee.role)) {
      throw new ForbiddenError(
        "You do not have permission to deactivate this employee"
      );
    }

    employee.isActive = false;
    await employee.save();

    return employee;
  }

  /**
   * Activate an employee (Admin or HR only)
   */
  static async activateEmployee(
    loginId: string,
    activatorRole: EmployeeRole
  ): Promise<IEmployee> {
    const employee = await Employee.findOne({ loginId });

    if (!employee) {
      throw new NotFoundError("Employee not found");
    }

    // Check if activator has permission
    if (!AuthUtils.canManageUser(activatorRole, employee.role)) {
      throw new ForbiddenError(
        "You do not have permission to activate this employee"
      );
    }

    employee.isActive = true;
    await employee.save();

    return employee;
  }

  /**
   * Get all employees (with pagination)
   */
  static async getAllEmployees(
    page: number = 1,
    limit: number = 10,
    filters?: {
      role?: EmployeeRole;
      companyName?: string;
      isActive?: boolean;
    }
  ): Promise<{ employees: IEmployee[]; total: number }> {
    const query: Record<string, unknown> = {};

    if (filters?.role) {
      query.role = filters.role;
    }
    if (filters?.companyName) {
      query.companyName = new RegExp(filters.companyName, "i");
    }
    if (filters?.isActive !== undefined) {
      query.isActive = filters.isActive;
    }

    const skip = (page - 1) * limit;

    const [employees, total] = await Promise.all([
      Employee.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .select(
          "firstName lastName email phoneNumber loginId role joiningYear isActive serialNumber isPasswordChanged"
        ),
      Employee.countDocuments(query),
    ]);

    return { employees, total };
  }

  /**
   * Reset employee password (Admin or HR only)
   */
  static async resetPassword(
    loginId: string,
    resetterRole: EmployeeRole
  ): Promise<{ newPassword: string }> {
    const employee = await Employee.findOne({ loginId });

    if (!employee) {
      throw new NotFoundError("Employee not found");
    }

    // Check if resetter has permission
    if (!AuthUtils.canManageUser(resetterRole, employee.role)) {
      throw new ForbiddenError(
        "You do not have permission to reset this employee's password"
      );
    }

    // Generate new password
    const newPassword = AuthUtils.generatePassword();
    const hashedPassword = await AuthUtils.hashPassword(newPassword);

    employee.password = hashedPassword;
    employee.isPasswordChanged = false;
    await employee.save();

    return { newPassword };
  }

  /**
   * Search employees by name, email, or login ID
   */
  static async searchEmployees(
    searchTerm: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ employees: IEmployee[]; total: number }> {
    const searchRegex = new RegExp(searchTerm, "i");
    const query = {
      $or: [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex },
        { loginId: searchRegex },
      ],
    };

    const skip = (page - 1) * limit;

    const [employees, total] = await Promise.all([
      Employee.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .select(
          "firstName lastName email phoneNumber loginId role joiningYear isActive serialNumber isPasswordChanged"
        ),
      Employee.countDocuments(query),
    ]);

    return { employees, total };
  }
}

export default EmployeeService;
