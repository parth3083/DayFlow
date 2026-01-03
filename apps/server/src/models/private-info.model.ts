import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBankDetails {
  acc_no: string;
  bank_name: string;
  ifsc_code: string;
}

export interface IPrivateInfo extends Document {
  emp_code: string; // This is loginId
  dob: Date;
  residing_adrs: string;
  nationality: string;
  personal_email: string;
  gender: "Male" | "Female" | "Other";
  marital_status: "Single" | "Married" | "Divorced" | "Widowed";
  date_of_joining: Date;
  bank_details: IBankDetails;
  pan_no: string;
  uan_no?: string;
}

const privateInfoSchema = new Schema<IPrivateInfo>(
  {
    emp_code: { type: String, required: true, unique: true, uppercase: true }, // Matches loginId
    dob: { type: Date, required: true },
    residing_adrs: { type: String, required: true },
    nationality: { type: String, default: "Indian" },
    personal_email: { type: String, required: true },
    gender: { 
      type: String, 
      enum: ["Male", "Female", "Other"], 
      required: true 
    },
    marital_status: { 
      type: String, 
      enum: ["Single", "Married", "Divorced", "Widowed"], 
      default: "Single" 
    },
    date_of_joining: { type: Date, required: true },
    bank_details: {
      acc_no: { type: String, required: true },
      bank_name: { type: String, required: true },
      ifsc_code: { type: String, required: true },
    },
    pan_no: { type: String, required: true, uppercase: true },
    uan_no: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IPrivateInfo>("PrivateInfo", privateInfoSchema);