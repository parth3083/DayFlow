import mongoose, { Schema, Document, Model } from "mongoose";
import { EmployeeRole } from "../validations/employee.validation.js";

/**
 * Interface for Employee Document
 */
export interface IEmployee extends Document {
  _id: mongoose.Types.ObjectId;
  companyName: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  imageUrl?: string;
  password: string;
  loginId: string;
  role: EmployeeRole;
  serialNumber: number;
  joiningYear: number;
  isPasswordChanged: boolean;
  isActive: boolean;
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Interface for Employee Model with static methods
 */
export interface IEmployeeModel extends Model<IEmployee> {
  getNextSerialNumber(joiningYear: number): Promise<number>;
}

/**
 * Employee Schema Definition
 */
const employeeSchema = new Schema<IEmployee, IEmployeeModel>(
  {
    companyName: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
      maxlength: [100, "Company name cannot exceed 100 characters"],
    },
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      maxlength: [50, "First name cannot exceed 50 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      maxlength: [50, "Last name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        "Please provide a valid email address",
      ],
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },
    loginId: {
      type: String,
      required: [true, "Login ID is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },
    role: {
      type: String,
      enum: Object.values(EmployeeRole),
      default: EmployeeRole.EMPLOYEE,
    },
    serialNumber: {
      type: Number,
      required: true,
    },
    joiningYear: {
      type: Number,
      required: true,
    },
    isPasswordChanged: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: {
      versionKey: false,
      transform: (_, ret) => {
        delete ret.createdAt;
        delete ret.updatedAt;
        return ret;
      },
    },
    toObject: {
      versionKey: false,
      transform: (_, ret) => {
        delete ret.createdAt;
        delete ret.updatedAt;
        return ret;
      },
    },
  }
);

/**
 * Index for faster queries
 */
employeeSchema.index({ email: 1 });
employeeSchema.index({ loginId: 1 });
employeeSchema.index({ companyName: 1 });
employeeSchema.index({ joiningYear: 1, serialNumber: 1 });

/**
 * Static method to get the next serial number for a joining year
 */
employeeSchema.statics.getNextSerialNumber = async function (
  joiningYear: number
): Promise<number> {
  const lastEmployee = await this.findOne({ joiningYear })
    .sort({ serialNumber: -1 })
    .select("serialNumber");

  return lastEmployee ? lastEmployee.serialNumber + 1 : 1;
};

/**
 * Virtual for full name
 */
employeeSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

/**
 * Employee Model
 */
const Employee = mongoose.model<IEmployee, IEmployeeModel>(
  "Employee",
  employeeSchema
);

export default Employee;
