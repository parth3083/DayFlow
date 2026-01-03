import type { Router } from "express";
import express from "express";
import employeeRoutes from "./employee.routes.js";
import leaveRoutes from "./leave.routes.js";

const router: Router = express.Router();

/**
 * API Routes
 * All routes are prefixed with /api
 */

// Employee routes
router.use("/employees", employeeRoutes);

// Leave & Time-off routes
router.use("/leaves", leaveRoutes);

// Health check route
router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "API is running",
    timestamp: new Date().toISOString(),
  });
});

export default router;
