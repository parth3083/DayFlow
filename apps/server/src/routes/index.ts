import type { Router } from "express";
import express from "express";
import employeeRoutes from "./employee.routes.js";
import attendanceRoutes from "./attendance.routes.js";
import adminAttendanceRoutes from "./admin.attendance.routes.js";
import profileRoutes from "./employee-profile.routes.js";
import leaveRoutes from "./leave.routes.js";
import payrollRoutes from "./payroll.routes.js";
import dashboardRoutes from "./dashboard.routes.js";

const router: Router = express.Router();

/**
 * API Routes
 * All routes are prefixed with /api
 */

// Employee routes
router.use("/employees", employeeRoutes);
router.use("/attendance", attendanceRoutes);
router.use("/admin/attendance", adminAttendanceRoutes);
router.use("/employee-profile", profileRoutes);

// Leave & Time-off routes
router.use("/leaves", leaveRoutes);

// Payroll routes
router.use("/payroll", payrollRoutes);

// Dashboard routes
router.use("/dashboard", dashboardRoutes);

// Health check route
router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "API is running",
    timestamp: new Date().toISOString(),
  });
});

export default router;
