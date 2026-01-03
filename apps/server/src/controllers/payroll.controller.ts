import type { Request, Response } from "express";
import { PayrollService } from "../services/payroll.service.js";
import { ResponseHelper, HttpStatus } from "../utils/response.utils.js";
import { asyncHandler } from "../middleware/error.middleware.js";
import { EmployeeRole } from "../validations/employee.validation.js";
import { ForbiddenError, NotFoundError } from "../utils/response.utils.js";
import {
  type UpdateSalaryStructureInput,
  type GeneratePayslipInput,
} from "../validations/payroll.validation.js";

export class PayrollController {
  /**
   * Get salary structure for an employee
   */
  static getSalaryStructure = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { loginId } = req.params;
      const userRole = req.user!.role;
      const userLoginId = req.user!.loginId;

      // Access control: Employees can only view their own salary structure
      if (userRole === EmployeeRole.EMPLOYEE && userLoginId !== loginId) {
        throw new ForbiddenError(
          "You are not authorized to view this salary structure"
        );
      }

      const structure = await PayrollService.getSalaryStructure(
        loginId as string
      );
      if (!structure) {
        throw new NotFoundError("Salary structure not found for this employee");
      }

      res.status(HttpStatus.OK).json(
        ResponseHelper.success("Salary structure retrieved successfully", {
          structure,
        })
      );
    }
  );

  /**
   * Update or create salary structure (Admin only)
   */
  static updateSalaryStructure = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const data: UpdateSalaryStructureInput = req.body;
      const structure = await PayrollService.updateSalaryStructure(data);

      res.status(HttpStatus.OK).json(
        ResponseHelper.success("Salary structure updated successfully")
      );
    }
  );

  /**
   * Generate payslip (Admin only)
   */
  static generatePayslip = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { loginId, month, year }: GeneratePayslipInput = req.body;
      const payslip = await PayrollService.generatePayslip(
        loginId,
        month,
        year
      );

      res
        .status(HttpStatus.OK)
        .json(
          ResponseHelper.success("Payslip generated successfully", { payslip })
        );
    }
  );

  /**
   * Get own payslips (Employee)
   */
  static getMyPayslips = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const loginId = req.user!.loginId;
      const payslips = await PayrollService.getEmployeePayslips(loginId);

      res.status(HttpStatus.OK).json(
        ResponseHelper.success("Payslips retrieved successfully", {
          payslips,
        })
      );
    }
  );

  /**
   * Get all payslips (Admin Only)
   */
  static getAllPayslips = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const month = req.query.month
        ? parseInt(req.query.month as string)
        : undefined;
      const year = req.query.year
        ? parseInt(req.query.year as string)
        : undefined;

      const payslips = await PayrollService.getAllPayslips(month, year);

      res.status(HttpStatus.OK).json(
        ResponseHelper.success("All payslips retrieved successfully", {
          payslips,
        })
      );
    }
  );
}

export default PayrollController;
