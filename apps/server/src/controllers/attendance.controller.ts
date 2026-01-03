import { Request, Response } from "express";
import { AttendanceService } from "../services/attendance.service.js";

/**
 * Mark Check-In
 */
export const markCheckIn = async (req: Request, res: Response) => {
  try {
    const loginId = req.user?.loginId;

    if (!loginId) {
      return res.status(401).json({ 
        success: false, 
        message: "Unauthorized: Login ID missing" 
      });
    }

    const attendance = await AttendanceService.checkIn(loginId);

    // 🟢 Filter the response to show only relevant fields
    const responseData = {
      loginId: attendance.loginId,
      date: attendance.date,       // Returns Date object (e.g., "2026-01-03T00:00:00.000Z")
      checkIn: attendance.checkIn,
      status: attendance.status
    };

    res.status(201).json({
      success: true,
      message: "Check-in successful",
      data: responseData,
    });

  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";
    
    res.status(statusCode).json({
      success: false,
      message: message,
    });
  }
};

export const markCheckOut = async (req: Request, res: Response) => {
  try {
    const loginId = req.user?.loginId;

    if (!loginId) {
      return res.status(401).json({ 
        success: false, 
        message: "Unauthorized: Login ID missing" 
      });
    }

    const attendance = await AttendanceService.checkOut(loginId);

    // 🟢 Filter Response
    const responseData = {
      loginId: attendance.loginId,
      date: attendance.date,
      checkIn: attendance.checkIn,
      checkOut: attendance.checkOut,
      workHours: attendance.workHours,
      status: attendance.status
    };

    res.status(200).json({
      success: true,
      message: "Check-out successful",
      data: responseData,
    });

  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";
    
    res.status(statusCode).json({
      success: false,
      message: message,
    });
  }
};

export const getMyAttendance = async (req: Request, res: Response) => {
  try {
    const loginId = req.user?.loginId;

    if (!loginId) {
      return res.status(401).json({ 
        success: false, 
        message: "Unauthorized" 
      });
    }

    // Parse query params (defaults: page 1, limit 30)
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 30;

    const { attendance, total } = await AttendanceService.getEmployeeAttendance(
      loginId, 
      page, 
      limit
    );

    res.status(200).json({
      success: true,
      count: attendance.length,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      data: attendance,
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

// ... imports

/**
 * Get Custom Attendance Report
 */
export const getReport = async (req: Request, res: Response) => {
  try {
    const loginId = req.user?.loginId;
    if (!loginId) return res.status(401).json({ message: "Unauthorized" });

    // 1. Get Dates from Query Params
    const { startDate, endDate } = req.query;

    // 2. Validation
    if (!startDate || !endDate) {
      return res.status(400).json({ 
        success: false, 
        message: "Please provide both startDate and endDate (YYYY-MM-DD)" 
      });
    }

    // 3. Fetch Data
    const data = await AttendanceService.getAttendanceByRange(
      loginId, 
      startDate as string, 
      endDate as string
    );

    res.status(200).json({
      success: true,
      count: data.length,
      range: { from: startDate, to: endDate },
      data
    });

  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};