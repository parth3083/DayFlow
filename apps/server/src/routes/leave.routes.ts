import { Router } from "express";
import { LeaveController } from "../controllers/leave.controller.js";
import { authenticate, hrOrAdminOnly } from "../middleware/auth.middleware.js";
import { validateBody } from "../middleware/validation.middleware.js";
import {
  applyLeaveSchema,
  leaveApprovalSchema,
} from "../validations/leave.validation.js";

const router: Router = Router();

/**
 * PROTECTED ROUTES
 * All routes in this module require authentication
 */
router.use(authenticate);

// ==================== EMPLOYEE ROUTES ====================

/**
 * @route   POST /api/leaves/apply
 * @desc    Apply for a new leave/time-off
 * @access  Authenticated (Employee)
 */
router.post(
  "/apply",
  validateBody(applyLeaveSchema),
  LeaveController.applyLeave
);

/**
 * @route   GET /api/leaves/my-leaves
 * @desc    Get historical leave records for the logged-in employee
 * @access  Authenticated
 */
router.get("/my-leaves", LeaveController.getMyLeaves);

// ==================== ADMIN & HR ROUTES ====================

/**
 * @route   GET /api/leaves
 * @desc    Get all leave records across the organization
 * @access  HR, Admin
 */
router.get("/", hrOrAdminOnly, LeaveController.getAllLeaves);

/**
 * @route   PATCH /api/leaves/:id/status
 * @desc    Approve or reject a leave request
 * @access  HR, Admin
 */
router.patch(
  "/:id/status",
  hrOrAdminOnly,
  validateBody(leaveApprovalSchema),
  LeaveController.updateLeaveStatus
);

// ==================== SHARED ROUTES ====================

/**
 * @route   GET /api/leaves/:id
 * @desc    Get detailed information for a specific leave record
 * @access  Authenticated (Own record) or HR/Admin (All records)
 */
router.get("/:id", LeaveController.getLeaveById);

export default router;
