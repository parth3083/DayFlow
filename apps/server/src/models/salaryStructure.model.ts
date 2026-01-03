import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISalaryStructure extends Document {
  loginId: string;
  monthlyWage: number;
  yearlyWage: number;
  basic: {
    percentage: number;
    amount: number;
  };
  hra: {
    percentageOfBasic: number;
    amount: number;
  };
  standardAllowance: number;
  performanceBonus: {
    percentageOfBasic: number;
    amount: number;
  };
  lta: {
    percentageOfBasic: number;
    amount: number;
  };
  fixedAllowance: number;
  pf: {
    rate: number;
    employeeContribution: number;
    employerContribution: number;
  };
  professionalTax: number;
  workingDaysPerWeek: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const salaryStructureSchema = new Schema<ISalaryStructure>(
  {
    loginId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    monthlyWage: { type: Number, required: true },
    yearlyWage: { type: Number, required: true },
    basic: {
      percentage: { type: Number, default: 50 },
      amount: { type: Number, required: true },
    },
    hra: {
      percentageOfBasic: { type: Number, default: 50 },
      amount: { type: Number, required: true },
    },
    standardAllowance: { type: Number, default: 4167 },
    performanceBonus: {
      percentageOfBasic: { type: Number, default: 8.33 },
      amount: { type: Number, required: true },
    },
    lta: {
      percentageOfBasic: { type: Number, default: 8.333 },
      amount: { type: Number, required: true },
    },
    fixedAllowance: { type: Number, required: true },
    pf: {
      rate: { type: Number, default: 12 },
      employeeContribution: { type: Number, required: true },
      employerContribution: { type: Number, required: true },
    },
    professionalTax: { type: Number, default: 200 },
    workingDaysPerWeek: { type: Number, default: 5 },
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

const SalaryStructure = mongoose.model<ISalaryStructure>(
  "SalaryStructure",
  salaryStructureSchema
);

export default SalaryStructure;
