import mongoose, { Schema, Document, Model } from "mongoose";

export enum AttendanceStatus {
  PRESENT = "PRESENT",
  ABSENT = "ABSENT",
  HALF_DAY = "HALF_DAY",
  LEAVE = "LEAVE",
}

export interface IAttendance extends Document {
  loginId: string; // <--- Changed from employeeId (ObjectId)
  date: Date;
  checkIn: Date;
  checkOut?: Date;
  status: AttendanceStatus;
  workHours: number;
}

export interface IAttendanceModel extends Model<IAttendance> {}

const attendanceSchema = new Schema<IAttendance, IAttendanceModel>(
  {
    loginId: {
      type: String, // Storing the string ID (e.g., "EMP001")
      required: [true, "Login ID is required"],
      trim: true,
      uppercase: true, // Ensure consistency
    },
    date: {
      type: Date,
      required: true,
    },
    checkIn: {
      type: Date,
      required: true,
    },
    checkOut: {
      type: Date,
    },
    status: {
      type: String,
      enum: Object.values(AttendanceStatus),
      default: AttendanceStatus.PRESENT,
    },
    workHours: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Update Index to use loginId
attendanceSchema.index({ loginId: 1, date: 1 }, { unique: true });

const Attendance = mongoose.model<IAttendance, IAttendanceModel>(
  "Attendance",
  attendanceSchema
);

export default Attendance;