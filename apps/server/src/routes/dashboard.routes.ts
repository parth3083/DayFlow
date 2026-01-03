import { Router } from "express";
import { getAdminStats, getEmployeeStats } from "../controllers/dashboard.controller.js";
import { authenticate, hrOrAdminOnly } from "../middleware/auth.middleware.js";

const router = Router();

/**
 * All dashboard routes require authentication
 */
router.use(authenticate);

/**
 * @route   GET /api/dashboard/admin
 * @desc    Get key stats for Admin Dashboard
 * @access  Admin, HR
 */
router.get("/admin", hrOrAdminOnly, getAdminStats);

/**
 * @route   GET /api/dashboard/employee
 * @desc    Get summary stats for Employee Dashboard
 * @access  Authenticated (Any role)
 */
router.get("/employee", getEmployeeStats);

export default router;
