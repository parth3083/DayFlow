import { Router } from "express";
import { PayrollController } from "../controllers/payroll.controller.js";
import {
  authenticate,
  adminOnly,
  hrOrAdminOnly,
} from "../middleware/auth.middleware.js";
import { validateBody } from "../middleware/validation.middleware.js";
import {
  updateSalaryStructureSchema,
  generatePayslipSchema,
} from "../validations/payroll.validation.js";

const router: Router = Router();

/**
 * PROTECTED ROUTES
 * All payroll routes require at least authentication
 */
router.use(authenticate);

// ==================== SALARY STRUCTURE ====================

/**
 * @route   GET /api/payroll/salary-structure/:loginId
 * @desc    Get salary structure for a specific employee
 * @access  Admin, HR, or the Employee themselves
 */
router.get("/salary-structure/:loginId", PayrollController.getSalaryStructure);

/**
 * @route   PUT /api/payroll/salary-structure
 * @desc    Update or create salary structure for an employee
 * @access  Admin Only
 */
router.put(
  "/salary-structure",
  adminOnly,
  validateBody(updateSalaryStructureSchema),
  PayrollController.updateSalaryStructure
);

// ==================== PAYSLIP MANAGEMENT ====================

/**
 * @route   POST /api/payroll/generate-payslip
 * @desc    Generate a monthly payslip for an employee based on attendance
 * @access  Admin Only
 */
router.post(
  "/generate-payslip",
  adminOnly,
  validateBody(generatePayslipSchema),
  PayrollController.generatePayslip
);

/**
 * @route   GET /api/payroll/my-payslips
 * @desc    Get all historical payslips for the logged-in employee
 * @access  Authenticated (Employee)
 */
router.get("/my-payslips", PayrollController.getMyPayslips);

/**
 * @route   GET /api/payroll/all-payslips
 * @desc    Get all generated payslips across the organization
 * @access  Admin, HR
 */
router.get("/all-payslips", hrOrAdminOnly, PayrollController.getAllPayslips);

export default router;
