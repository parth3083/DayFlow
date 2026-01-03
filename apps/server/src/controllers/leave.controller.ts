import type { Request, Response } from "express";
import { LeaveService } from "../services/leave.service.js";
import { ResponseHelper, HttpStatus } from "../utils/response.utils.js";
import { asyncHandler } from "../middleware/error.middleware.js";
import {
  type ApplyLeaveInput,
  type LeaveApprovalInput,
  LeaveStatus,
} from "../validations/leave.validation.js";
import { EmployeeRole } from "../validations/employee.validation.js";
import Employee from "../models/employee.model.js";
import { NotFoundError, ForbiddenError } from "../utils/response.utils.js";

/**
 * Leave Controller
 * Handles HTTP requests and responses for leave and time-off operations
 */
export class LeaveController {
  /**
   * Apply for leave (Employee)
   * POST /api/leaves/apply
   */
  static applyLeave = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const data: ApplyLeaveInput = req.body;
      const loginId = req.user!.loginId;

      // Resolve loginId to employee _id
      const employee = await Employee.findOne({ loginId });
      if (!employee) {
        throw new NotFoundError("Employee not found");
      }

      await LeaveService.applyLeave(employee._id, data);

      res.status(HttpStatus.CREATED).json(
        ResponseHelper.success("Leave application submitted successfully")
      );
    }
  );

  /**
   * Get own leave records (Employee)
   * GET /api/leaves/my-leaves
   */
  static getMyLeaves = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const loginId = req.user!.loginId;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const employee = await Employee.findOne({ loginId });
      if (!employee) {
        throw new NotFoundError("Employee not found");
      }

      const { leaves, total } = await LeaveService.getEmployeeLeaves(
        employee._id,
        page,
        limit
      );

      res
        .status(HttpStatus.OK)
        .json(
          ResponseHelper.paginated(
            "Your leave records retrieved successfully",
            leaves,
            page,
            limit,
            total
          )
        );
    }
  );

  /**
   * Get all leave records (Admin/HR Only)
   * GET /api/leaves
   */
  static getAllLeaves = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as LeaveStatus | undefined;
      const employeeId = req.query.employeeId as string | undefined;

      const { leaves, total } = await LeaveService.getAllLeaves(page, limit, {
        status,
        employeeId,
      });

      res
        .status(HttpStatus.OK)
        .json(
          ResponseHelper.paginated(
            "All leave records retrieved successfully",
            leaves,
            page,
            limit,
            total
          )
        );
    }
  );

  /**
   * Get leave details by ID
   * GET /api/leaves/:id
   */
  static getLeaveById = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      const leave = await LeaveService.getLeaveById(id as string);
      const userLoginId = req.user!.loginId;
      const userRole = req.user!.role;

      // Access control: Employees can only view their own records
      if (userRole === EmployeeRole.EMPLOYEE) {
        const employee = await Employee.findOne({ loginId: userLoginId });
        if (
          !employee ||
          leave.employeeId._id.toString() !== employee._id.toString()
        ) {
          throw new ForbiddenError(
            "You are not authorized to view this leave record"
          );
        }
      }

      res.status(HttpStatus.OK).json(
        ResponseHelper.success("Leave details retrieved successfully", {
          leave,
        })
      );
    }
  );

  /**
   * Approve or reject leave (Admin/HR Only)
   * PATCH /api/leaves/:id/status
   */
  static updateLeaveStatus = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      const adminLoginId = req.user!.loginId;
      const data: LeaveApprovalInput = req.body;

      const admin = await Employee.findOne({ loginId: adminLoginId });
      if (!admin) {
        throw new NotFoundError("Admin record not found");
      }

      const leave = await LeaveService.updateLeaveStatus(
        id as string,
        admin._id,
        data
      );

      res
        .status(HttpStatus.OK)
        .json(
          ResponseHelper.success(
            `Leave request has been ${data.status} successfully`,
            { leave }
          )
        );
    }
  );
}

export default LeaveController;
