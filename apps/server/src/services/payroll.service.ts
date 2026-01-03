import SalaryStructure, {
  type ISalaryStructure,
} from "../models/salaryStructure.model.js";
import Payslip, {
  type IPayslip,
  PayslipStatus,
} from "../models/payslip.model.js";
import Attendance, { AttendanceStatus } from "../models/attendance.model.js";
import Leave from "../models/leave.model.js";
import { LeaveType, LeaveStatus } from "../validations/leave.validation.js";
import { PayrollHelper } from "../utils/payroll.utils.js";
import { type UpdateSalaryStructureInput } from "../validations/payroll.validation.js";
import Employee from "../models/employee.model.js";
import ApiError from "@/utils/ApiError.js";

export class PayrollService {
  /**
   * Get salary structure for an employee
   */
  static async getSalaryStructure(
    loginId: string
  ): Promise<ISalaryStructure | null> {
    const structure = await SalaryStructure.findOne({ loginId });
    return structure;
  }

  /**
   * Update or create salary structure for an employee
   */
  static async updateSalaryStructure(
    data: UpdateSalaryStructureInput
  ): Promise<ISalaryStructure> {
    const { loginId, monthlyWage, ...rules } = data;

    // Verify employee exists
    const employee = await Employee.findOne({ loginId });
    if (!employee) {
      throw new ApiError(404, "Employee not found");
    }

    const calculatedComponents = PayrollHelper.calculateComponents(
      monthlyWage,
      {
        basicPercentage: rules.basicPercentage,
        hraPercentageOfBasic: rules.hraPercentageOfBasic,
        standardAllowance: rules.standardAllowance,
        performanceBonusPercentageOfBasic:
          rules.performanceBonusPercentageOfBasic,
        ltaPercentageOfBasic: rules.ltaPercentageOfBasic,
        pfRate: rules.pfRate,
        professionalTax: rules.professionalTax,
      }
    );

    const updatedStructure = await SalaryStructure.findOneAndUpdate(
      { loginId },
      {
        ...calculatedComponents,
        workingDaysPerWeek: rules.workingDaysPerWeek,
      },
      { new: true, upsert: true }
    );

    return updatedStructure;
  }

  /**
   * Generate payslip for an employee for a specific month and year
   */
  static async generatePayslip(
    loginId: string,
    month: number,
    year: number
  ): Promise<IPayslip> {
    // 1. Get Salary Structure
    const structure = await SalaryStructure.findOne({ loginId });
    if (!structure) {
      throw new ApiError(404, "Salary structure not defined for this employee");
    }

    // 2. Calculate Total Days in Month
    const totalDaysInMonth = PayrollHelper.getDaysInMonth(month, year);
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    // 3. Get Attendance Records
    const attendanceRecords = await Attendance.find({
      loginId,
      date: { $gte: startDate, $lte: endDate },
    });

    // Create a map for quick lookup
    const attendanceMap = new Map(
      attendanceRecords.map((r) => {
        const d = new Date(r.date);
        return [d.toISOString().split("T")[0], r];
      })
    );

    // 4. Get Approved Leaves
    const employee = await Employee.findOne({ loginId });
    if (!employee) throw new ApiError(404, "Employee not found");

    const approvedLeaves = await Leave.find({
      employeeId: employee._id,
      status: LeaveStatus.APPROVED,
      $or: [
        { startDate: { $gte: startDate, $lte: endDate } },
        { endDate: { $gte: startDate, $lte: endDate } },
        { startDate: { $lte: startDate }, endDate: { $gte: endDate } },
      ],
    });

    // 5. Calculate Payable Days
    let payableDaysCount = 0;

    for (let day = 1; day <= totalDaysInMonth; day++) {
      const currentDayDate = new Date(year, month - 1, day);
      const dateString = currentDayDate.toISOString().split("T")[0];

      const attendance = attendanceMap.get(dateString);
      const leave = approvedLeaves.find(
        (l) => currentDayDate >= l.startDate && currentDayDate <= l.endDate
      );

      const isWorkDay = PayrollHelper.isWorkingDay(
        currentDayDate,
        structure.workingDaysPerWeek
      );

      if (attendance) {
        if (attendance.status === AttendanceStatus.PRESENT) {
          payableDaysCount += 1;
        } else if (attendance.status === AttendanceStatus.HALF_DAY) {
          payableDaysCount += 0.5;
        } else if (attendance.status === AttendanceStatus.LEAVE) {
          if (
            leave &&
            (leave.leaveType === LeaveType.PAID ||
              leave.leaveType === LeaveType.SICK)
          ) {
            payableDaysCount += 1;
          }
        }
      } else if (leave) {
        if (
          leave.leaveType === LeaveType.PAID ||
          leave.leaveType === LeaveType.SICK
        ) {
          payableDaysCount += 1;
        }
      } else if (!isWorkDay) {
        // Standard policy: weekends are paid if not marked absent/unpaid leave
        payableDaysCount += 1;
      } else {
        // Missing attendance on working day: Deducted (don't increment)
      }
    }

    const prorationFactor = payableDaysCount / totalDaysInMonth;

    const earnings = {
      basic: Number((structure.basic.amount * prorationFactor).toFixed(2)),
      hra: Number((structure.hra.amount * prorationFactor).toFixed(2)),
      standardAllowance: Number(
        (structure.standardAllowance * prorationFactor).toFixed(2)
      ),
      performanceBonus: Number(
        (structure.performanceBonus.amount * prorationFactor).toFixed(2)
      ),
      lta: Number((structure.lta.amount * prorationFactor).toFixed(2)),
      fixedAllowance: Number(
        (structure.fixedAllowance * prorationFactor).toFixed(2)
      ),
      grossEarnings: 0,
    };
    earnings.grossEarnings = Number(
      Object.values(earnings)
        .reduce((a, b) => a + b, 0)
        .toFixed(2)
    );

    const deductions = {
      pfEmployee: Number(
        (structure.pf.employeeContribution * prorationFactor).toFixed(2)
      ),
      professionalTax: structure.professionalTax,
      unpaidLeaveDeduction: Number(
        (structure.monthlyWage * (1 - prorationFactor)).toFixed(2)
      ),
      totalDeductions: 0,
    };
    deductions.totalDeductions = Number(
      (deductions.pfEmployee + deductions.professionalTax).toFixed(2)
    );

    const netSalary = Number(
      (earnings.grossEarnings - deductions.totalDeductions).toFixed(2)
    );

    // 7. Save or Update Payslip
    const payslip = await Payslip.findOneAndUpdate(
      { loginId, month, year },
      {
        totalDays: totalDaysInMonth,
        payableDays: payableDaysCount,
        earnings,
        deductions,
        netSalary,
        status: PayslipStatus.PENDING,
        generatedDate: new Date(),
      },
      { new: true, upsert: true }
    );

    return payslip;
  }

  /**
   * Get all payslips for an employee
   */
  static async getEmployeePayslips(loginId: string) {
    return await Payslip.find({ loginId }).sort({ year: -1, month: -1 });
  }

  /**
   * Get all payslips (Admin)
   */
  static async getAllPayslips(month?: number, year?: number) {
    const query: any = {};
    if (month) query.month = month;
    if (year) query.year = year;
    return await Payslip.find(query).sort({ year: -1, month: -1 });
  }
}
