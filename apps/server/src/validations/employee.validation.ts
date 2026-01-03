import { z } from "zod";

/**
 * Role enum for employee types
 */
export enum EmployeeRole {
  EMPLOYEE = "employee",
  HR = "hr",
  ADMIN = "admin",
}

/**
 * Validation schema for creating a new employee
 * Used when HR or Admin creates a new employee
 */
export const createEmployeeSchema = z.object({
  companyName: z
    .string("Company name is required")
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name must not exceed 100 characters")
    .trim(),

  firstName: z
    .string("First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must not exceed 50 characters")
    .trim(),

  lastName: z
    .string("Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must not exceed 50 characters")
    .trim(),

  imageUrl: z.string("Please provide a valid image URL").optional(),

  email: z
    .string("Email is required")
    .email("Please provide a valid email address")
    .toLowerCase()
    .trim(),

  phoneNumber: z
    .string("Phone number is required")
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must not exceed 15 digits")
    .regex(/^[+]?[\d\s-]+$/, "Please provide a valid phone number"),

  role: z
    .nativeEnum(EmployeeRole, {
      message: "Role must be one of: employee, hr, admin",
    })
    .default(EmployeeRole.EMPLOYEE),
});

/**
 * Validation schema for employee login
 * Supports login via either loginId or email with password
 */
export const loginEmployeeSchema = z
  .object({
    loginId: z.string("Login ID must be a string").optional(),

    email: z
      .string("Email must be a string")
      .email("Please provide a valid email address")
      .toLowerCase()
      .trim()
      .optional(),

    password: z.string("Password is required").min(1, "Password is required"),
  })
  .refine((data) => data.loginId || data.email, {
    message: "Either loginId or email is required for login",
    path: ["loginId"],
  });

/**
 * Validation schema for changing password
 */
export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string("Current password is required")
      .min(1, "Current password is required"),

    newPassword: z
      .string("New password is required")
      .min(8, "New password must be at least 8 characters")
      .max(128, "New password must not exceed 128 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),

    confirmPassword: z
      .string("Confirm password is required")
      .min(1, "Confirm password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

/**
 * Validation schema for updating employee profile
 */
export const updateEmployeeSchema = z.object({
  firstName: z
    .string("First name must be a string")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must not exceed 50 characters")
    .trim()
    .optional(),

  lastName: z
    .string("Last name must be a string")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must not exceed 50 characters")
    .trim()
    .optional(),

  imageUrl: z
    .string("Image URL must be a string")
    .url("Please provide a valid image URL")
    .optional(),

  phoneNumber: z
    .string("Phone number must be a string")
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must not exceed 15 digits")
    .regex(/^[+]?[\d\s-]+$/, "Please provide a valid phone number")
    .optional(),
});

/**
 * Validation schema for updating employee role (Admin only)
 */
export const updateRoleSchema = z.object({
  loginId: z.string("Login ID is required").min(1, "Login ID is required"),

  role: z.nativeEnum(EmployeeRole, {
    message: "Role must be one of: employee, hr, admin",
  }),
});

/**
 * Type definitions inferred from schemas
 */
export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;
export type LoginEmployeeInput = z.infer<typeof loginEmployeeSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;
