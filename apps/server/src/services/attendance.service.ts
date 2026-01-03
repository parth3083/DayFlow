import Attendance, { 
  type IAttendance, 
  AttendanceStatus 
} from "../models/attendance.model.js";
import { ConflictError, NotFoundError } from "../utils/response.utils.js";

export class AttendanceService {
  /**
   * Mark Check-In using Login ID
   */
  static async checkIn(loginId: string): Promise<IAttendance> {
    const now = new Date();
    const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

    // Check existing using loginId
    const existingAttendance = await Attendance.findOne({
      loginId: loginId,
      date: today,
    });

    if (existingAttendance) {
      throw new ConflictError("You have already checked in for today!");
    }

    // Create using loginId
    const attendance = await Attendance.create({
      loginId: loginId,
      date: today,
      checkIn: now,
      status: AttendanceStatus.PRESENT,
    });

    return attendance;
  }

  static async checkOut(loginId: string): Promise<IAttendance> {
    const now = new Date();
    const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

    // 1. Find the attendance record for TODAY
    const attendance = await Attendance.findOne({
      loginId: loginId,
      date: today,
    });

    if (!attendance) {
      throw new NotFoundError("You have not checked in today");
    }

    // 2. Prevent double check-out
    if (attendance.checkOut) {
      throw new ConflictError("You have already checked out for today");
    }

    // 3. Calculate Work Hours (in hours, e.g., 8.5)
    const checkInTime = new Date(attendance.checkIn).getTime();
    const checkOutTime = now.getTime();
    const hoursWorked = (checkOutTime - checkInTime) / (1000 * 60 * 60);

    // 4. Update the record
    attendance.checkOut = now;
    attendance.workHours = parseFloat(hoursWorked.toFixed(2)); // Round to 2 decimals
    
    // Optional: Update status if needed (e.g., if workHours < 4, mark HALF_DAY)
    // if (attendance.workHours < 4) attendance.status = AttendanceStatus.HALF_DAY;

    await attendance.save();

    return attendance;
  }

  static async getEmployeeAttendance(
    loginId: string, 
    page: number = 1, 
    limit: number = 30
  ) {
    const skip = (page - 1) * limit;

    const [attendance, total] = await Promise.all([
      Attendance.find({ loginId })
        .sort({ date: -1 }) // Newest first
        .skip(skip)
        .limit(limit)
        .select("-_id -__v -employeeId"), // Exclude internal fields directly
      
      Attendance.countDocuments({ loginId })
    ]);

    return { attendance, total };
  }
  
  static async getAttendanceByRange(loginId: string, fromDate: string, toDate: string) {
    // 1. Parse Start Date (Set to 00:00:00)
    const start = new Date(fromDate);
    start.setUTCHours(0, 0, 0, 0);

    // 2. Parse End Date (Set to 23:59:59 to include the whole day)
    const end = new Date(toDate);
    end.setUTCHours(23, 59, 59, 999);

    // 3. Query
    return await Attendance.find({
      loginId,
      date: {
        $gte: start,
        $lte: end
      }
    }).sort({ date: 1 }) // Oldest to Newest
      .select("-_id -__v"); // Clean output
  }

  /**
   * ADMIN: Get All Employees' Attendance (with Pagination & Filters)
   */
  static async getAllAttendance(
    page: number = 1, 
    limit: number = 20, 
    filters: { date?: string; loginId?: string }
  ) {
    const query: any = {};

    // Filter by specific date if provided
    if (filters.date) {
      const date = new Date(filters.date);
      // Match exact date (ignoring time)
      query.date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    }

    // Filter by specific employee loginId
    if (filters.loginId) {
      query.loginId = new RegExp(filters.loginId, 'i'); // Partial match allowed
    }

    const skip = (page - 1) * limit;

    const [attendance, total] = await Promise.all([
      Attendance.find(query)
        .sort({ date: -1, loginId: 1 }) // Sort by date (newest), then user
        .skip(skip)
        .limit(limit)
        .select("-__v"), // We keep _id here because Admin needs it to Update
      
      Attendance.countDocuments(query)
    ]);

    return { attendance, total };
  }

  /**
   * ADMIN: Update a specific Attendance Record
   * Recalculates workHours if checkIn/checkOut is changed.
   */
  static async updateAttendanceRecord(recordId: string, updates: Partial<IAttendance>) {
    const record = await Attendance.findById(recordId);
    if (!record) {
      throw new NotFoundError("Attendance record not found");
    }

    // Apply updates
    if (updates.checkIn) record.checkIn = new Date(updates.checkIn);
    if (updates.checkOut) record.checkOut = new Date(updates.checkOut);
    if (updates.status) record.status = updates.status;

    // Recalculate Work Hours if times exist
    if (record.checkIn && record.checkOut) {
      const start = new Date(record.checkIn).getTime();
      const end = new Date(record.checkOut).getTime();
      const hours = (end - start) / (1000 * 60 * 60);
      record.workHours = parseFloat(hours.toFixed(2));
    }

    await record.save();
    return record;
  }
}

export default AttendanceService;