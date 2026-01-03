import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import dashboardService, { AdminDashboardStats, EmployeeDashboardStats } from "../../services/dashboard.service";

interface DashboardState {
  adminStats: AdminDashboardStats | null;
  employeeStats: EmployeeDashboardStats | null;
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  adminStats: null,
  employeeStats: null,
  loading: false,
  error: null,
};

export const fetchAdminStats = createAsyncThunk(
  "dashboard/fetchAdminStats",
  async (_, { rejectWithValue }) => {
    try {
      return await dashboardService.getAdminStats();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch admin stats");
    }
  }
);

export const fetchEmployeeStats = createAsyncThunk(
  "dashboard/fetchEmployeeStats",
  async (_, { rejectWithValue }) => {
    try {
      return await dashboardService.getEmployeeStats();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch employee stats");
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    clearDashboardError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Admin Stats
      .addCase(fetchAdminStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.loading = false;
        state.adminStats = action.payload;
      })
      .addCase(fetchAdminStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Employee Stats
      .addCase(fetchEmployeeStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeStats.fulfilled, (state, action) => {
        state.loading = false;
        state.employeeStats = action.payload;
      })
      .addCase(fetchEmployeeStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearDashboardError } = dashboardSlice.actions;
export default dashboardSlice.reducer;
