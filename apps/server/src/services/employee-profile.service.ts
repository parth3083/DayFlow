import Resume, { IResume } from "../models/resume.model.js";
import PrivateInfo, { IPrivateInfo } from "../models/private-info.model.js";
import { NotFoundError } from "../utils/response.utils.js";

export class EmployeeProfileService {
  /**
   * Get Full Profile (Resume + Private Info)
   */
  static async getFullProfile(loginId: string) {
    const [resume, privateInfo] = await Promise.all([
      Resume.findOne({ loginId }).select("-_id -__v"),
      PrivateInfo.findOne({ emp_code: loginId }).select("-_id -__v")
    ]);

    return { resume, privateInfo };
  }

  /**
   * Create or Update Resume
   */
  static async upsertResume(loginId: string, data: Partial<IResume>) {
    return await Resume.findOneAndUpdate(
      { loginId },
      { $set: data },
      { new: true, upsert: true, runValidators: true }
    ).select("-_id -__v");
  }

  /**
   * Create or Update Private Info
   */
  static async upsertPrivateInfo(loginId: string, data: Partial<IPrivateInfo>) {
    // Ensure emp_code is set to loginId for safety
    const safeData = { ...data, emp_code: loginId };

    return await PrivateInfo.findOneAndUpdate(
      { emp_code: loginId },
      { $set: safeData },
      { new: true, upsert: true, runValidators: true }
    ).select("-_id -__v");
  }
}

export default EmployeeProfileService;