import { Router } from "express";
import { 
  getMyProfile, 
  updateResume, 
  updatePrivateInfo 
} from "../controllers/employee-profile.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.use(authenticate);

// GET Full Profile
router.get("/", getMyProfile);

// UPDATE Sections
router.put("/resume", updateResume);
router.put("/private-info", updatePrivateInfo);

export default router;