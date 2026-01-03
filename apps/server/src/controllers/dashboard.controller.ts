import type { Request, Response } from "express";
import Employee from "../models/employee.model.js";
import Attendance, { AttendanceStatus } from "../models/attendance.model.js";
import Leave from "../models/leave.model.js";
import { LeaveStatus } from "../validations/leave.validation.js";
import { startOfDay, endOfDay, startOfMonth, endOfMonth } from "date-fns";
import { NotFoundError } from "../utils/response.utils.js";

/**
 * GET /api/dashboard/admin-stats
 * Aggregates key metrics for the Admin Dashboard
 */
export const getAdminStats = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    const startOfToday = startOfDay(today);
    const endOfToday = endOfDay(today);

    const [
      totalEmployees,
      presentToday,
      onLeaveToday,
      pendingLeaves,
    ] = await Promise.all([
      Employee.countDocuments({ isActive: true }),
      Attendance.countDocuments({
        date: { $gte: startOfToday, $lte: endOfToday },
        status: AttendanceStatus.PRESENT,
      }),
      Leave.countDocuments({
        status: LeaveStatus.APPROVED,
        startDate: { $lte: endOfToday },
        endDate: { $gte: startOfToday },
      }),
      Leave.countDocuments({ status: LeaveStatus.PENDING }),
    ]);

    // Simple math for absent today (excluding those on approved leave)
    const absentToday = totalEmployees - presentToday - onLeaveToday;

    res.status(200).json({
      success: true,
      data: {
        totalEmployees,
        presentToday,
        absentToday: Math.max(0, absentToday),
        onLeaveToday,
        pendingLeaves,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/dashboard/employee-stats
 * Aggregates summary data for the logged-in Employee's Dashboard
 */
export const getEmployeeStats = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Need full employee doc for internal _id
    const employee = await Employee.findOne({ loginId: user.loginId });
    if (!employee) {
      throw new NotFoundError("Employee record not found");
    }

    const today = new Date();
    const startOfMo = startOfMonth(today);
    const endOfMo = endOfMonth(today);

    // Attendance stats for current month
    const attendanceRecords = await Attendance.find({
      loginId: user.loginId,
      date: { $gte: startOfMo, $lte: endOfMo },
    });

    const attendanceSummary = {
      present: attendanceRecords.filter(r => r.status === AttendanceStatus.PRESENT).length,
      absent: attendanceRecords.filter(r => r.status === AttendanceStatus.ABSENT).length,
      halfDay: attendanceRecords.filter(r => r.status === AttendanceStatus.HALF_DAY).length,
      late: 0, // Placeholder
    };

    // Leave balance summary
    const approvedLeaves = await Leave.find({
      employeeId: employee._id,
      status: LeaveStatus.APPROVED,
    });
    
    const usedLeaves = approvedLeaves.reduce((acc, curr) => acc + curr.days, 0);
    const pendingRequests = await Leave.countDocuments({
      employeeId: employee._id,
      status: LeaveStatus.PENDING,
    });

    // Mock upcoming holidays
    const upcomingHolidays = [
      { date: "2026-01-26", name: "Republic Day" },
      { date: "2026-03-14", name: "Holi" },
      { date: "2026-04-10", name: "Good Friday" },
    ];

    res.status(200).json({
      success: true,
      data: {
        attendanceSummary,
        leaveBalance: {
          total: 20,
          used: usedLeaves,
          pending: pendingRequests,
          remaining: Math.max(0, 20 - usedLeaves),
        },
        upcomingHolidays,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
