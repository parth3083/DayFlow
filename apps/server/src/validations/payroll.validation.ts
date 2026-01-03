import { z } from "zod";

export const updateSalaryStructureSchema = z.object({
  loginId: z.string("Login ID is required").min(1, "Login ID is required"),
  monthlyWage: z
    .number("Monthly wage must be a number")
    .positive("Monthly wage must be positive"),
  basicPercentage: z.number().min(0).max(100).default(50),
  hraPercentageOfBasic: z.number().min(0).max(100).default(50),
  standardAllowance: z.number().min(0).default(4167),
  performanceBonusPercentageOfBasic: z.number().min(0).max(100).default(8.33),
  ltaPercentageOfBasic: z.number().min(0).max(100).default(8.333),
  pfRate: z.number().min(0).max(100).default(12),
  professionalTax: z.number().min(0).default(200),
  workingDaysPerWeek: z.number().min(1).max(7).default(5),
});

export const generatePayslipSchema = z.object({
  loginId: z.string("Login ID is required").min(1, "Login ID is required"),
  month: z.number().min(1).max(12),
  year: z.number().min(2000).max(2100),
});

export const bulkGeneratePayslipsSchema = z.object({
  month: z.number().min(1).max(12),
  year: z.number().min(2000).max(2100),
});

export type UpdateSalaryStructureInput = z.infer<
  typeof updateSalaryStructureSchema
>;
export type GeneratePayslipInput = z.infer<typeof generatePayslipSchema>;
export type BulkGeneratePayslipsInput = z.infer<
  typeof bulkGeneratePayslipsSchema
>;
