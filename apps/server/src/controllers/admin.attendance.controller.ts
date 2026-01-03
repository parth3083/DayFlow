import { Request, Response } from "express";
import { AttendanceService } from "../services/attendance.service.js";
import { EmployeeRole } from "../validations/employee.validation.js"; // Your Role Enum

/**
 * Helper to ensure Admin/HR access
 */
const checkPermission = (user: any) => {
  if (!user || (user.role !== EmployeeRole.ADMIN && user.role !== EmployeeRole.HR)) {
    throw new Error("Forbidden: Admin or HR access required");
  }
};

/**
 * GET /api/admin/attendance
 * Fetch all attendance with pagination and optional date/loginId filters
 */
export const getAllAttendance = async (req: Request, res: Response) => {
  try {
    checkPermission(req.user); // Security Check

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const date = req.query.date as string;
    const loginId = req.query.loginId as string;

    const { attendance, total } = await AttendanceService.getAllAttendance(
      page, 
      limit, 
      { date, loginId }
    );

    res.status(200).json({
      success: true,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: attendance
    });
  } catch (error: any) {
    const statusCode = error.message.includes("Forbidden") ? 403 : 500;
    res.status(statusCode).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/admin/attendance/:loginId
 * Get specific employee's full history
 */
export const getSpecificEmployeeAttendance = async (req: Request, res: Response) => {
  try {
    checkPermission(req.user);

    const targetLoginId = req.params.loginId; // We use loginId from URL params
    const page = parseInt(req.query.page as string) || 1;

    // Reuse the existing service method but for a specific user
    const { attendance, total } = await AttendanceService.getEmployeeAttendance(
      targetLoginId, 
      page, 
      30 // Default limit
    );

    res.status(200).json({
      success: true,
      total,
      data: attendance
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * PUT /api/admin/attendance/:id
 * Update a specific attendance record by its _id
 */
export const updateAttendance = async (req: Request, res: Response) => {
  try {
    checkPermission(req.user);

    const recordId = req.params.id; // This is the Mongo _id of the attendance doc
    const updates = req.body;

    const updatedRecord = await AttendanceService.updateAttendanceRecord(recordId, updates);

    res.status(200).json({
      success: true,
      message: "Attendance updated successfully",
      data: updatedRecord
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};