import api from "../lib/api.config";

export interface AdminDashboardStats {
  totalEmployees: number;
  presentToday: number;
  absentToday: number;
  onLeaveToday: number;
  pendingLeaves: number;
}

export interface EmployeeDashboardStats {
  attendanceSummary: {
    present: number;
    absent: number;
    halfDay: number;
    late: number;
  };
  leaveBalance: {
    total: number;
    used: number;
    pending: number;
    remaining: number;
  };
  upcomingHolidays: Array<{
    date: string;
    name: string;
  }>;
}

class DashboardService {
  async getAdminStats() {
    const response = await api.get<{ success: boolean; data: AdminDashboardStats }>(
      "/dashboard/admin"
    );
    return response.data.data;
  }

  async getEmployeeStats() {
    const response = await api.get<{ success: boolean; data: EmployeeDashboardStats }>(
      "/dashboard/employee"
    );
    return response.data.data;
  }
}

export const dashboardService = new DashboardService();
export default dashboardService;
