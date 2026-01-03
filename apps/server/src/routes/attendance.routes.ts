import { Router } from "express";
import { 
  markCheckIn, 
  markCheckOut, 
  getReport,      // <--- New Import
  getMyAttendance 
} from "../controllers/attendance.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

// Apply Auth Middleware
router.use(authenticate);

// POST /api/attendance/check-in
router.post("/check-in", markCheckIn);
router.put("/check-out", markCheckOut);
router.get("/", getMyAttendance);

router.get("/report", getReport);

export default router;