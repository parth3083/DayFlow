import api from "../lib/api.config";

export enum AttendanceStatus {
  PRESENT = "PRESENT",
  ABSENT = "ABSENT",
  HALF_DAY = "HALF_DAY",
  LEAVE = "LEAVE",
}

export interface AttendanceRecord {
  _id?: string;
  loginId: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  status: AttendanceStatus;
  workHours: number;
}

export interface PaginatedAttendance {
  success: boolean;
  total: number;
  page?: number;
  totalPages?: number;
  data: AttendanceRecord[];
}

class AttendanceService {
  async checkIn() {
    const response = await api.post<{ success: boolean; data: AttendanceRecord }>(
      "/attendance/check-in"
    );
    return response.data.data;
  }

  async checkOut() {
    const response = await api.put<{ success: boolean; data: AttendanceRecord }>(
      "/attendance/check-out"
    );
    return response.data.data;
  }

  async getMyAttendance(page: number = 1, limit: number = 30) {
    const response = await api.get<PaginatedAttendance>(
      `/attendance?page=${page}&limit=${limit}`
    );
    return response.data;
  }

  async getAllAttendance(params?: { page?: number; limit?: number; date?: string; loginId?: string }) {
    const query = new URLSearchParams();
    if (params?.page) query.append("page", params.page.toString());
    if (params?.limit) query.append("limit", params.limit.toString());
    if (params?.date) query.append("date", params.date);
    if (params?.loginId) query.append("loginId", params.loginId);

    const response = await api.get<PaginatedAttendance>(`/admin/attendance?${query.toString()}`);
    return response.data;
  }

  async updateAttendance(id: string, updates: Partial<AttendanceRecord>) {
    const response = await api.put<{ success: boolean; data: AttendanceRecord }>(
      `/admin/attendance/${id}`,
      updates
    );
    return response.data.data;
  }
}

export const attendanceService = new AttendanceService();
export default attendanceService;
