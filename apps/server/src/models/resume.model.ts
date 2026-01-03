import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICertification {
  name: string;
  issuer: string;
  date: Date;
  url?: string;
}

export interface IResume extends Document {
  loginId: string; // Foreign Key
  about: string;
  skills: string[]; // Array of strings e.g. ["React", "Node.js"]
  certifications: ICertification[];
}

const resumeSchema = new Schema<IResume>(
  {
    loginId: { type: String, required: true, unique: true, uppercase: true },
    about: { type: String, maxlength: 500 },
    skills: [{ type: String }],
    certifications: [
      {
        name: { type: String, required: true },
        issuer: { type: String, required: true },
        date: { type: Date, required: true },
        url: { type: String },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<IResume>("Resume", resumeSchema);