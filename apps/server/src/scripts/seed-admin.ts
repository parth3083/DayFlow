import mongoose from "mongoose";
import Employee from "../models/employee.model.js";
import { AuthUtils } from "../utils/auth.utils.js";
import { EmployeeRole } from "../validations/employee.validation.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../../.env") });

async function seedAdmin() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in .env file");
    }

    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected successfully.");

    // Check if any admin already exists
    const existingAdmin = await Employee.findOne({ role: EmployeeRole.ADMIN });
    if (existingAdmin) {
      console.log("⚠️ An admin already exists in the database:");
      console.log(`Email: ${existingAdmin.email}`);
      console.log(`Login ID: ${existingAdmin.loginId}`);
      console.log("Use the existing admin to create more users via the API.");
      process.exit(0);
    }

    // Admin Details
    const adminData = {
      companyName: "DayFlow",
      firstName: "Super",
      lastName: "Admin",
      email: "admin@dayflow.com",
      phoneNumber: "1234567890",
      role: EmployeeRole.ADMIN,
    };

    // Generate credentials
    const password = "AdminPassword@123"; // You can change this
    const hashedPassword = await AuthUtils.hashPassword(password);
    const joiningYear = AuthUtils.getCurrentYear();
    const serialNumber = 1;
    const loginId = AuthUtils.generateLoginId(
      adminData.companyName,
      adminData.firstName,
      adminData.lastName,
      joiningYear,
      serialNumber
    );

    // Create Admin
    const admin = await Employee.create({
      ...adminData,
      password: hashedPassword,
      loginId: loginId,
      serialNumber: serialNumber,
      joiningYear: joiningYear,
      isPasswordChanged: true, // Mark as changed so we can login directly
      isActive: true,
    });

    console.log("\n✅ First Admin Created Successfully!");
    console.log("-----------------------------------");
    console.log(`Email:      ${admin.email}`);
    console.log(`Login ID:   ${admin.loginId}`);
    console.log(`Password:   ${password}`);
    console.log("-----------------------------------");
    console.log("\nUse these credentials to login at /api/employees/login");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding admin:", error);
    process.exit(1);
  }
}

seedAdmin();
