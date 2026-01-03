import { Router } from "express";
import { 
  getAllAttendance, 
  getSpecificEmployeeAttendance, 
  updateAttendance 
} from "../controllers/admin.attendance.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.use(authenticate);

// 1. Get All (with query params: ?date=...&loginId=...)
router.get("/", getAllAttendance);

// 2. Get Specific Employee History
// Note: We use :loginId here to match your user identifier preference
router.get("/:loginId", getSpecificEmployeeAttendance);

// 3. Update Record
// Note: We use :id here because we are updating a specific DOCUMENT (_id)
router.put("/:id", updateAttendance);

export default router;