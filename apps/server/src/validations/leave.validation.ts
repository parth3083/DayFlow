import { z } from "zod";

/**
 * Enum for leave types
 */
export enum LeaveType {
  PAID = "paid",
  SICK = "sick",
  UNPAID = "unpaid",
}

/**
 * Enum for leave status
 */
export enum LeaveStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

/**
 * Validation schema for applying for leave (Employee)
 */
export const applyLeaveSchema = z
  .object({
    leaveType: z.nativeEnum(LeaveType, {
      message: "Leave type must be one of: paid, sick, unpaid",
    }),
    startDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid start date",
    }),
    endDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid end date",
    }),
    remarks: z
      .string()
      .max(500, "Remarks must not exceed 500 characters")
      .optional(),
    attachment: z
      .string()
      .url("Please provide a valid attachment URL")
      .optional(),
  })
  .refine(
    (data) => {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return end >= start;
    },
    {
      message: "End date must be after or equal to start date",
      path: ["endDate"],
    }
  );

/**
 * Validation schema for leave approval/rejection (Admin/HR)
 */
export const leaveApprovalSchema = z.object({
  status: z.enum([LeaveStatus.APPROVED, LeaveStatus.REJECTED], {
    message: "Status must be either approved or rejected",
  }),
  adminComments: z
    .string()
    .max(500, "Comments must not exceed 500 characters")
    .optional(),
});

/**
 * Type definitions inferred from schemas
 */
export type ApplyLeaveInput = z.infer<typeof applyLeaveSchema>;
export type LeaveApprovalInput = z.infer<typeof leaveApprovalSchema>;
