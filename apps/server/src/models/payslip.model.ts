import mongoose, { Schema, Document } from "mongoose";

export enum PayslipStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  UNPAID = "UNPAID",
}

export interface IPayslip extends Document {
  loginId: string;
  month: number;
  year: number;
  totalDays: number;
  payableDays: number;
  earnings: {
    basic: number;
    hra: number;
    standardAllowance: number;
    performanceBonus: number;
    lta: number;
    fixedAllowance: number;
    grossEarnings: number;
  };
  deductions: {
    pfEmployee: number;
    professionalTax: number;
    unpaidLeaveDeduction: number;
    totalDeductions: number;
  };
  netSalary: number;
  status: PayslipStatus;
  generatedDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const payslipSchema = new Schema<IPayslip>(
  {
    loginId: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    month: { type: Number, required: true },
    year: { type: Number, required: true },
    totalDays: { type: Number, required: true },
    payableDays: { type: Number, required: true },
    earnings: {
      basic: { type: Number, required: true },
      hra: { type: Number, required: true },
      standardAllowance: { type: Number, required: true },
      performanceBonus: { type: Number, required: true },
      lta: { type: Number, required: true },
      fixedAllowance: { type: Number, required: true },
      grossEarnings: { type: Number, required: true },
    },
    deductions: {
      pfEmployee: { type: Number, required: true },
      professionalTax: { type: Number, required: true },
      unpaidLeaveDeduction: { type: Number, required: true },
      totalDeductions: { type: Number, required: true },
    },
    netSalary: { type: Number, required: true },
    status: {
      type: String,
      enum: Object.values(PayslipStatus),
      default: PayslipStatus.PENDING,
    },
    generatedDate: { type: Date, default: Date.now },
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

// Ensure only one payslip per employee per month
payslipSchema.index({ loginId: 1, month: 1, year: 1 }, { unique: true });

const Payslip = mongoose.model<IPayslip>("Payslip", payslipSchema);

export default Payslip;
