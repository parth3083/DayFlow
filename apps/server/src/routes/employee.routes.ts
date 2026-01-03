import { Router } from "express";
import { EmployeeController } from "../controllers/employee.controller.js";
import {
  authenticate,
  adminOnly,
  hrOrAdminOnly,
  loginRateLimit,
} from "../middleware/auth.middleware.js";
import { validateBody } from "../middleware/validation.middleware.js";
import {
  createEmployeeSchema,
  loginEmployeeSchema,
  changePasswordSchema,
  updateEmployeeSchema,
  updateRoleSchema,
} from "../validations/employee.validation.js";

const router: Router = Router();

// ==================== PUBLIC ROUTES ====================

/**
 * @route   POST /api/employees/login
 * @desc    Login employee (using email or loginId + password)
 * @access  Public
 */
router.post(
  "/login",
  loginRateLimit,
  validateBody(loginEmployeeSchema),
  EmployeeController.login
);

/**
 * @route   POST /api/employees/refresh-token
 * @desc    Refresh access token using refresh token
 * @access  Public (requires valid refresh token)
 */
router.post("/refresh-token", EmployeeController.refreshToken);

// ==================== AUTHENTICATED ROUTES ====================

/**
 * @route   GET /api/employees/me
 * @desc    Get current user profile
 * @access  Authenticated
 */
router.get("/me", authenticate, EmployeeController.getProfile);

/**
 * @route   PATCH /api/employees/me
 * @desc    Update current user profile
 * @access  Authenticated
 */
router.patch(
  "/me",
  authenticate,
  validateBody(updateEmployeeSchema),
  EmployeeController.updateProfile
);

/**
 * @route   POST /api/employees/change-password
 * @desc    Change password
 * @access  Authenticated
 */
router.post(
  "/change-password",
  authenticate,
  validateBody(changePasswordSchema),
  EmployeeController.changePassword
);

/**
 * @route   POST /api/employees/logout
 * @desc    Logout (client-side token removal)
 * @access  Authenticated
 */
router.post("/logout", authenticate, EmployeeController.logout);

// ==================== HR & ADMIN ROUTES ====================

/**
 * @route   POST /api/employees
 * @desc    Create a new employee
 * @access  HR, Admin
 */
router.post(
  "/",
  authenticate,
  hrOrAdminOnly,
  validateBody(createEmployeeSchema),
  EmployeeController.createEmployee
);

/**
 * @route   GET /api/employees/search
 * @desc    Search employees by name, email, or login ID
 * @access  HR, Admin
 */
router.get(
  "/search",
  authenticate,
  hrOrAdminOnly,
  EmployeeController.searchEmployees
);

/**
 * @route   GET /api/employees
 * @desc    Get all employees with pagination
 * @access  HR, Admin
 */
router.get(
  "/",
  authenticate,
  hrOrAdminOnly,
  EmployeeController.getAllEmployees
);

/**
 * @route   GET /api/employees/:loginId
 * @desc    Get employee by login ID
 * @access  HR, Admin
 */
router.get(
  "/:loginId",
  authenticate,
  hrOrAdminOnly,
  EmployeeController.getEmployeeById
);

/**
 * @route   PATCH /api/employees/:loginId/deactivate
 * @desc    Deactivate employee
 * @access  HR, Admin
 */
router.patch(
  "/:loginId/deactivate",
  authenticate,
  hrOrAdminOnly,
  EmployeeController.deactivateEmployee
);

/**
 * @route   PATCH /api/employees/:loginId/activate
 * @desc    Activate employee
 * @access  HR, Admin
 */
router.patch(
  "/:loginId/activate",
  authenticate,
  hrOrAdminOnly,
  EmployeeController.activateEmployee
);

/**
 * @route   POST /api/employees/:loginId/reset-password
 * @desc    Reset employee password
 * @access  HR, Admin
 */
router.post(
  "/:loginId/reset-password",
  authenticate,
  hrOrAdminOnly,
  EmployeeController.resetPassword
);

// ==================== ADMIN ONLY ROUTES ====================

/**
 * @route   PATCH /api/employees/:loginId/role
 * @desc    Update employee role
 * @access  Admin only
 */
router.patch(
  "/:loginId/role",
  authenticate,
  adminOnly,
  EmployeeController.updateRole
);

export default router;
