import Leave, { type ILeave } from "../models/leave.model.js";
import { LeaveHelper } from "../utils/leave.utils.js";
import {
  type ApplyLeaveInput,
  type LeaveApprovalInput,
  LeaveStatus,
} from "../validations/leave.validation.js";
import { NotFoundError, BadRequestError } from "../utils/response.utils.js";
import mongoose from "mongoose";

/**
 * Leave Service Class
 * Handles all business logic related to leave and time-off operations
 */
export class LeaveService {
  /**
   * Apply for leave (Employee)
   * Calculates days and checks for overlapping leaves
   */
  static async applyLeave(
    employeeId: string | mongoose.Types.ObjectId,
    data: ApplyLeaveInput
  ): Promise<ILeave> {
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);

    // 1. Calculate days using the common helper class
    const days = LeaveHelper.calculateDays(startDate, endDate);

    // 2. Check for overlapping leaves using the common helper class
    const hasOverlap = await LeaveHelper.hasOverlappingLeave(
      employeeId,
      startDate,
      endDate
    );

    if (hasOverlap) {
      throw new BadRequestError(
        "You already have a pending or approved leave during this period"
      );
    }

    // 3. Create leave request
    const leave = await Leave.create({
      employeeId,
      leaveType: data.leaveType,
      startDate,
      endDate,
      days,
      ...(data.remarks !== undefined && { remarks: data.remarks }),
      ...(data.attachment !== undefined && { attachment: data.attachment }),
      status: LeaveStatus.PENDING,
    });

    return leave;
  }

  /**
   * Get leaves for a specific employee
   */
  static async getEmployeeLeaves(
    employeeId: string | mongoose.Types.ObjectId,
    page: number = 1,
    limit: number = 20
  ): Promise<{ leaves: ILeave[]; total: number }> {
    const skip = (page - 1) * limit;

    const [leaves, total] = await Promise.all([
      Leave.find({ employeeId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("employeeId", "loginId")
        .populate("adminId", "firstName lastName"),
      Leave.countDocuments({ employeeId }),
    ]);

    return { leaves, total };
  }

  /**
   * Get all leaves across the organization (Admin/HR Only)
   */
  static async getAllLeaves(
    page: number = 1,
    limit: number = 20,
    filters?: {
      status?: LeaveStatus | undefined;
      employeeId?: string | undefined;
    }
  ): Promise<{ leaves: ILeave[]; total: number }> {
    const skip = (page - 1) * limit;
    const query: any = {};

    if (filters?.status) {
      query.status = filters.status;
    }
    if (filters?.employeeId) {
      query.employeeId = filters.employeeId;
    }

    const [leaves, total] = await Promise.all([
      Leave.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("employeeId", "firstName lastName loginId")
        .populate("adminId", "firstName lastName"),
      Leave.countDocuments(query),
    ]);

    return { leaves, total };
  }

  /**
   * Get single leave details by ID
   */
  static async getLeaveById(leaveId: string): Promise<ILeave> {
    const leave = await Leave.findById(leaveId)
      .populate("employeeId", "firstName lastName loginId email")
      .populate("adminId", "firstName lastName");

    if (!leave) {
      throw new NotFoundError("Leave request not found");
    }

    return leave;
  }

  /**
   * Approve or reject leave request (Admin/HR Only)
   */
  static async updateLeaveStatus(
    leaveId: string,
    adminId: string | mongoose.Types.ObjectId,
    data: LeaveApprovalInput
  ): Promise<ILeave> {
    const leave = await Leave.findById(leaveId);

    if (!leave) {
      throw new NotFoundError("Leave request not found");
    }

    if (leave.status !== LeaveStatus.PENDING) {
      throw new BadRequestError(
        `Leave request has already been ${leave.status}`
      );
    }

    leave.status = data.status;
    if (data.adminComments !== undefined) {
      leave.adminComments = data.adminComments;
    }
    leave.adminId = new mongoose.Types.ObjectId(adminId.toString());

    await leave.save();

    return leave.populate([
      { path: "employeeId", select: "firstName lastName loginId" },
      { path: "adminId", select: "firstName lastName" },
    ]);
  }
}

export default LeaveService;
