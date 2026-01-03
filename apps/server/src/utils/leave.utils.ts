import { differenceInDays, startOfDay } from "date-fns";
import Leave from "../models/leave.model.js";
import mongoose from "mongoose";

/**
 * Helper class for Leave management logic
 */
export class LeaveHelper {
  /**
   * Calculates the number of days between two dates (inclusive)
   */
  public static calculateDays(startDate: Date, endDate: Date): number {
    const start = startOfDay(new Date(startDate));
    const end = startOfDay(new Date(endDate));

    return differenceInDays(end, start) + 1;
  }

  /**
   * Checks if there's any overlapping leave for the employee
   */
  public static async hasOverlappingLeave(
    employeeId: string | mongoose.Types.ObjectId,
    startDate: Date,
    endDate: Date,
    excludeLeaveId?: string | mongoose.Types.ObjectId
  ): Promise<boolean> {
    const query: any = {
      employeeId,
      status: { $ne: "rejected" }, // Only consider pending or approved leaves
      $or: [
        {
          startDate: { $lte: endDate },
          endDate: { $gte: startDate },
        },
      ],
    };

    if (excludeLeaveId) {
      query._id = { $ne: excludeLeaveId };
    }

    const overlappingLeave = await Leave.findOne(query);
    return !!overlappingLeave;
  }
}
