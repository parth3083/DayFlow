import mongoose, { Schema, Document } from "mongoose";
import { format } from "date-fns";
import { LeaveType, LeaveStatus } from "../validations/leave.validation.js";

/**
 * Interface for Leave Document
 */
export interface ILeave extends Document {
  _id: mongoose.Types.ObjectId;
  employeeId: any; // Allow for populated or ObjectId
  leaveType: LeaveType;
  startDate: Date;
  endDate: Date;
  days: number;
  remarks?: string;
  attachment?: string;
  status: LeaveStatus;
  adminId?: mongoose.Types.ObjectId;
  adminComments?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Leave Schema Definition
 */
const leaveSchema = new Schema<ILeave>(
  {
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: [true, "Employee ID is required"],
    },
    leaveType: {
      type: String,
      enum: Object.values(LeaveType),
      required: [true, "Leave type is required"],
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },
    days: {
      type: Number,
      required: [true, "Number of days is required"],
    },
    remarks: {
      type: String,
      trim: true,
      maxlength: [500, "Remarks cannot exceed 500 characters"],
    },
    attachment: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(LeaveStatus),
      default: LeaveStatus.PENDING,
    },
    adminId: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
    },
    adminComments: {
      type: String,
      trim: true,
      maxlength: [500, "Admin comments cannot exceed 500 characters"],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (_, ret) => {
        return {
          loginId: ret.employeeId?.loginId || ret.employeeId,
          leaveType: ret.leaveType,
          startDate: format(new Date(ret.startDate), "yyyy-MM-dd"),
          endDate: format(new Date(ret.endDate), "yyyy-MM-dd"),
          days: ret.days,
          remarks: ret.remarks,
          attachment: ret.attachment,
          status: ret.status,
          leaveId: ret._id,
        };
      },
    },
  }
);

/**
 * Indexes for faster queries
 */
leaveSchema.index({ employeeId: 1 });
leaveSchema.index({ status: 1 });
leaveSchema.index({ startDate: 1, endDate: 1 });

/**
 * Leave Model
 */
const Leave = mongoose.model<ILeave>("Leave", leaveSchema);

export default Leave;
