import api from "../lib/api.config";

export interface SalaryStructure {
  loginId: string;
  monthlyWage: number;
  yearlyWage: number;
  basic: { percentage: number; amount: number };
  hra: { percentageOfBasic: number; amount: number };
  standardAllowance: number;
  performanceBonus: { percentageOfBasic: number; amount: number };
  lta: { percentageOfBasic: number; amount: number };
  fixedAllowance: number;
  pf: { rate: number; employeeContribution: number; employerContribution: number };
  professionalTax: number;
}

export interface Payslip {
  _id: string;
  loginId: string;
  month: number;
  year: number;
  totalDays: number;
  payableDays: number;
  earnings: {
    basic: number;
    hra: number;
    standardAllowance: number;
    performanceBonus: number;
    lta: number;
    fixedAllowance: number;
    grossEarnings: number;
  };
  deductions: {
    pfEmployee: number;
    professionalTax: number;
    unpaidLeaveDeduction: number;
    totalDeductions: number;
  };
  netSalary: number;
  status: "PENDING" | "PAID" | "UNPAID";
  generatedDate: string;
}

class PayrollService {
  async getSalaryStructure(loginId: string) {
    const response = await api.get<{ success: boolean; data: { structure: SalaryStructure } }>(
      `/payroll/salary-structure/${loginId}`
    );
    return response.data.data.structure;
  }

  async updateSalaryStructure(data: Partial<SalaryStructure> & { loginId: string }) {
    const response = await api.put<{ success: boolean; data: any }>(
      "/payroll/salary-structure",
      data
    );
    return response.data.data;
  }

  async generatePayslip(data: { loginId: string; month: number; year: number }) {
    const response = await api.post<{ success: boolean; data: { payslip: Payslip } }>(
      "/payroll/generate-payslip",
      data
    );
    return response.data.data.payslip;
  }

  async getMyPayslips() {
    const response = await api.get<{ success: boolean; data: { payslips: Payslip[] } }>(
      "/payroll/my-payslips"
    );
    return response.data.data.payslips;
  }

  async getAllPayslips() {
    const response = await api.get<{ success: boolean; data: { payslips: Payslip[] } }>(
      "/payroll/all-payslips"
    );
    return response.data.data.payslips;
  }
}

export const payrollService = new PayrollService();
export default payrollService;
