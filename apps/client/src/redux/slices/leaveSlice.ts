import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import leaveService, { LeaveRequest, LeaveStatus } from "../../services/leave.service";

interface LeaveState {
  myLeaves: LeaveRequest[];
  allLeaves: LeaveRequest[];
  loading: boolean;
  error: string | null;
}

const initialState: LeaveState = {
  myLeaves: [],
  allLeaves: [],
  loading: false,
  error: null,
};

export const applyLeave = createAsyncThunk(
  "leave/applyLeave",
  async (data: { leaveType: string; startDate: string; endDate: string; remarks: string }, { rejectWithValue }) => {
    try {
      return await leaveService.applyLeave(data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to submit leave request");
    }
  }
);

export const fetchMyLeaves = createAsyncThunk(
  "leave/fetchMyLeaves",
  async (_, { rejectWithValue }) => {
    try {
      return await leaveService.getMyLeaves();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch your leave requests");
    }
  }
);

export const fetchAllLeaves = createAsyncThunk(
  "leave/fetchAllLeaves",
  async (params: { status?: string; employeeId?: string } | undefined, { rejectWithValue }) => {
    try {
      return await leaveService.getAllLeaves(params);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch all leave requests");
    }
  }
);

export const updateLeaveStatus = createAsyncThunk(
  "leave/updateLeaveStatus",
  async ({ id, status, adminComment }: { id: string; status: LeaveStatus; adminComment?: string }, { rejectWithValue }) => {
    try {
      return await leaveService.updateLeaveStatus(id, status, adminComment);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update leave status");
    }
  }
);

const leaveSlice = createSlice({
  name: "leave",
  initialState,
  reducers: {
    clearLeaveError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Apply Leave
      .addCase(applyLeave.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyLeave.fulfilled, (state, action) => {
        state.loading = false;
        state.myLeaves = [action.payload, ...state.myLeaves];
      })
      .addCase(applyLeave.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch My Leaves
      .addCase(fetchMyLeaves.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyLeaves.fulfilled, (state, action) => {
        state.loading = false;
        state.myLeaves = action.payload;
      })
      .addCase(fetchMyLeaves.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch All Leaves
      .addCase(fetchAllLeaves.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllLeaves.fulfilled, (state, action) => {
        state.loading = false;
        state.allLeaves = action.payload;
      })
      .addCase(fetchAllLeaves.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Leave Status
      .addCase(updateLeaveStatus.fulfilled, (state, action) => {
        state.allLeaves = state.allLeaves.map((leave) => 
          leave.leaveId === action.payload.leaveId ? action.payload : leave
        );
      });
  },
});

export const { clearLeaveError } = leaveSlice.actions;
export default leaveSlice.reducer;
