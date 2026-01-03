import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { EmployeeRole } from "../validations/employee.validation.js";

/**
 * JWT Payload Interface
 */
export interface JWTPayload {
  email: string;
  loginId: string;
  role: EmployeeRole;
  iat?: number;
  exp?: number;
}

/**
 * Token Response Interface
 */
export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

/**
 * Login ID Components Interface
 */
export interface LoginIdComponents {
  companyInitials: string;
  nameInitials: string;
  joiningYear: number;
  serialNumber: number;
}

/**
 * AuthUtils Class - Centralized authentication utility methods
 * Handles JWT token operations, password hashing, and login ID generation
 */
export class AuthUtils {
  private static readonly SALT_ROUNDS = 12;
  private static readonly ACCESS_TOKEN_EXPIRY = "15m"; // 15 minutes
  private static readonly REFRESH_TOKEN_EXPIRY = "7d"; // 7 days
  private static readonly PASSWORD_LENGTH = 12;
  private static readonly PASSWORD_CHARS =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@$!%*?&";

  /**
   * Get JWT secrets from environment variables
   */
  private static getJWTSecret(): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET environment variable is not defined");
    }
    return secret;
  }

  private static getRefreshSecret(): string {
    const secret = process.env.JWT_REFRESH_SECRET;
    if (!secret) {
      throw new Error("JWT_REFRESH_SECRET environment variable is not defined");
    }
    return secret;
  }

  // ==================== PASSWORD METHODS ====================

  /**
   * Generate a random password for new employees
   * Password includes uppercase, lowercase, numbers, and special characters
   */
  static generatePassword(): string {
    let password = "";

    // Ensure at least one of each required character type
    password += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)]; // Uppercase
    password += "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)]; // Lowercase
    password += "0123456789"[Math.floor(Math.random() * 10)]; // Number
    password += "@$!%*?&"[Math.floor(Math.random() * 7)]; // Special char

    // Fill the rest with random characters
    for (let i = password.length; i < this.PASSWORD_LENGTH; i++) {
      password +=
        this.PASSWORD_CHARS[
          Math.floor(Math.random() * this.PASSWORD_CHARS.length)
        ];
    }

    // Shuffle the password
    return password
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");
  }

  /**
   * Hash a password using bcrypt
   */
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  /**
   * Compare a plain password with a hashed password
   */
  static async comparePassword(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  // ==================== LOGIN ID METHODS ====================

  /**
   * Extract initials from company name (first letter of each word, max 3)
   * Example: "Tech Solutions Inc" -> "TSI"
   */
  static getCompanyInitials(companyName: string): string {
    const words = companyName.trim().split(/\s+/);
    const initials = words
      .slice(0, 3)
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
    return initials || companyName.charAt(0).toUpperCase();
  }

  /**
   * Get name initials (first 2 letters of first name + first 2 letters of last name)
   * Example: "John", "Doe" -> "JODO"
   */
  static getNameInitials(firstName: string, lastName: string): string {
    const firstInitials = firstName.substring(0, 2).toUpperCase();
    const lastInitials = lastName.substring(0, 2).toUpperCase();
    return firstInitials + lastInitials;
  }

  /**
   * Generate a unique login ID for an employee
   * Format: [CompanyInitials][NameInitials][Year][SerialNumber]
   * Example: "TSIJODO202601"
   */
  static generateLoginId(
    companyName: string,
    firstName: string,
    lastName: string,
    joiningYear: number,
    serialNumber: number
  ): string {
    const companyInitials = this.getCompanyInitials(companyName);
    const nameInitials = this.getNameInitials(firstName, lastName);
    const yearStr = joiningYear.toString();
    const serialStr = serialNumber.toString().padStart(2, "0");

    return `${companyInitials}${nameInitials}${yearStr}${serialStr}`.toUpperCase();
  }

  /**
   * Parse a login ID to extract its components
   */
  static parseLoginId(loginId: string): LoginIdComponents | null {
    // Login ID format: [CompanyInitials(1-3)][NameInitials(4)][Year(4)][Serial(2+)]
    const match = loginId.match(/^([A-Z]{1,3})([A-Z]{4})(\d{4})(\d{2,})$/);
    if (!match) return null;

    return {
      companyInitials: match[1]!,
      nameInitials: match[2]!,
      joiningYear: parseInt(match[3]!),
      serialNumber: parseInt(match[4]!),
    };
  }

  // ==================== JWT TOKEN METHODS ====================

  /**
   * Generate access and refresh tokens for an employee
   */
  static generateTokens(
    payload: Omit<JWTPayload, "iat" | "exp">
  ): TokenResponse {
    const accessToken = jwt.sign(payload, this.getJWTSecret(), {
      expiresIn: this.ACCESS_TOKEN_EXPIRY,
    });

    const refreshToken = jwt.sign(payload, this.getRefreshSecret(), {
      expiresIn: this.REFRESH_TOKEN_EXPIRY,
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: 15 * 60, // 15 minutes in seconds
    };
  }

  /**
   * Verify an access token and return the payload
   */
  static verifyAccessToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, this.getJWTSecret()) as JWTPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error("Access token has expired");
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error("Invalid access token");
      }
      throw error;
    }
  }

  /**
   * Verify a refresh token and return the payload
   */
  static verifyRefreshToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, this.getRefreshSecret()) as JWTPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error("Refresh token has expired");
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error("Invalid refresh token");
      }
      throw error;
    }
  }

  /**
   * Decode a token without verification (useful for getting payload from expired token)
   */
  static decodeToken(token: string): JWTPayload | null {
    try {
      return jwt.decode(token) as JWTPayload;
    } catch {
      return null;
    }
  }

  /**
   * Refresh tokens using a valid refresh token
   */
  static refreshTokens(refreshToken: string): TokenResponse {
    const payload = this.verifyRefreshToken(refreshToken);

    // Generate new tokens with fresh payload (excluding old iat/exp)
    return this.generateTokens({
      email: payload.email,
      loginId: payload.loginId,
      role: payload.role,
    });
  }

  // ==================== VALIDATION METHODS ====================

  /**
   * Validate password strength
   */
  static validatePasswordStrength(password: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }
    if (!/\d/.test(password)) {
      errors.push("Password must contain at least one number");
    }
    if (!/[@$!%*?&]/.test(password)) {
      errors.push(
        "Password must contain at least one special character (@$!%*?&)"
      );
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Check if a user has the required role
   */
  static hasRequiredRole(
    userRole: EmployeeRole,
    requiredRoles: EmployeeRole[]
  ): boolean {
    return requiredRoles.includes(userRole);
  }

  /**
   * Check if user can manage another user based on roles
   * Admins can manage everyone, HR can manage employees
   */
  static canManageUser(
    managerRole: EmployeeRole,
    targetRole: EmployeeRole
  ): boolean {
    if (managerRole === EmployeeRole.ADMIN) {
      return true;
    }
    if (
      managerRole === EmployeeRole.HR &&
      targetRole === EmployeeRole.EMPLOYEE
    ) {
      return true;
    }
    return false;
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Extract bearer token from authorization header
   */
  static extractBearerToken(authHeader: string | undefined): string | null {
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }
    return authHeader.substring(7);
  }

  /**
   * Get current year for joining year calculation
   */
  static getCurrentYear(): number {
    return new Date().getFullYear();
  }
}

export default AuthUtils;
