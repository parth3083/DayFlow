import api from "../lib/api.config";

export enum LeaveType {
  PAID = "paid",
  SICK = "sick",
  UNPAID = "unpaid",
}

export enum LeaveStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export interface LeaveRequest {
  _id?: string;
  leaveId?: string;
  loginId: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  remarks: string;
  status: LeaveStatus;
  adminComment?: string;
  attachment?: string;
  days?: number;
  createdAt?: string;
}

export interface LeaveResponse {
  success: boolean;
  data: LeaveRequest[];
  total: number;
}

class LeaveService {
  async applyLeave(data: { leaveType: string; startDate: string; endDate: string; remarks: string }) {
    const response = await api.post<{ success: boolean; data: LeaveRequest }>(
      "/leaves/apply",
      data
    );
    return response.data.data;
  }

  async getMyLeaves() {
    const response = await api.get<{ success: boolean; data: LeaveRequest[] }>(
      "/leaves/my-leaves"
    );
    return response.data.data;
  }

  async getAllLeaves(params?: { status?: string; employeeId?: string }) {
    const query = new URLSearchParams();
    if (params?.status) query.append("status", params.status);
    if (params?.employeeId) query.append("employeeId", params.employeeId);

    const response = await api.get<{ success: boolean; data: LeaveRequest[] }>(
      `/leaves?${query.toString()}`
    );
    return response.data.data;
  }

  async updateLeaveStatus(id: string, status: LeaveStatus, adminComment?: string) {
    const response = await api.patch<{ success: boolean; data: LeaveRequest }>(
      `/leaves/${id}/status`,
      { status, adminComment }
    );
    return response.data.data;
  }
}

export const leaveService = new LeaveService();
export default leaveService;
