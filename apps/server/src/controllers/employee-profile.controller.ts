import { Request, Response } from "express";
import EmployeeProfileService from "../services/employee-profile.service.js";

/**
 * Get My Profile
 */
export const getMyProfile = async (req: Request, res: Response) => {
  try {
    const loginId = req.user?.loginId;
    if (!loginId) return res.status(401).json({ message: "Unauthorized" });

    const data = await EmployeeProfileService.getFullProfile(loginId);
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Update Resume
 */
export const updateResume = async (req: Request, res: Response) => {
  try {
    const loginId = req.user?.loginId;
    if (!loginId) return res.status(401).json({ message: "Unauthorized" });

    const updated = await EmployeeProfileService.upsertResume(loginId, req.body);
    res.status(200).json({ success: true, message: "Resume updated", data: updated });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Update Private Info
 */
export const updatePrivateInfo = async (req: Request, res: Response) => {
  try {
    const loginId = req.user?.loginId;
    if (!loginId) return res.status(401).json({ message: "Unauthorized" });

    // Ideally, sensitive bank info updates might require Admin/HR permission
    // For now, we allow the user to fill their own data
    const updated = await EmployeeProfileService.upsertPrivateInfo(loginId, req.body);
    res.status(200).json({ success: true, message: "Private Info updated", data: updated });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};