import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import attendanceService, { AttendanceRecord, PaginatedAttendance } from "../../services/attendance.service";

interface AttendanceState {
  myAttendance: AttendanceRecord[];
  allAttendance: AttendanceRecord[];
  totalRecords: number;
  todayRecord: AttendanceRecord | null;
  loading: boolean;
  error: string | null;
}

const initialState: AttendanceState = {
  myAttendance: [],
  allAttendance: [],
  totalRecords: 0,
  todayRecord: null,
  loading: false,
  error: null,
};

export const checkIn = createAsyncThunk(
  "attendance/checkIn",
  async (_, { rejectWithValue }) => {
    try {
      return await attendanceService.checkIn();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to check in");
    }
  }
);

export const checkOut = createAsyncThunk(
  "attendance/checkOut",
  async (_, { rejectWithValue }) => {
    try {
      return await attendanceService.checkOut();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to check out");
    }
  }
);

export const fetchMyAttendance = createAsyncThunk(
  "attendance/fetchMyAttendance",
  async (params: { page?: number; limit?: number } | undefined, { rejectWithValue }) => {
    try {
      const response = await attendanceService.getMyAttendance(params?.page, params?.limit);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch attendance");
    }
  }
);

export const fetchAllAttendance = createAsyncThunk(
  "attendance/fetchAllAttendance",
  async (params: { page?: number; limit?: number; date?: string; loginId?: string } | undefined, { rejectWithValue }) => {
    try {
      const response = await attendanceService.getAllAttendance(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch all attendance");
    }
  }
);

export const updateAttendanceRecord = createAsyncThunk(
  "attendance/updateAttendanceRecord",
  async ({ id, updates }: { id: string; updates: Partial<AttendanceRecord> }, { rejectWithValue }) => {
    try {
      return await attendanceService.updateAttendance(id, updates);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update attendance");
    }
  }
);

const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {
    clearAttendanceError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Check In
      .addCase(checkIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkIn.fulfilled, (state, action) => {
        state.loading = false;
        state.myAttendance = [action.payload, ...state.myAttendance];
        state.todayRecord = action.payload;
      })
      .addCase(checkIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Check Out
      .addCase(checkOut.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkOut.fulfilled, (state, action) => {
        state.loading = false;
        state.myAttendance = state.myAttendance.map((rec) => 
          rec.date === action.payload.date ? action.payload : rec
        );
        if (state.todayRecord && state.todayRecord.date === action.payload.date) {
            state.todayRecord = action.payload;
        }
      })
      .addCase(checkOut.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch My Attendance
      .addCase(fetchMyAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.myAttendance = action.payload.data;
        state.totalRecords = action.payload.total;
        
        // Find today's record
        const today = new Date().toISOString().split('T')[0];
        state.todayRecord = action.payload.data.find(r => r.date.startsWith(today)) || null;
      })
      .addCase(fetchMyAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch All Attendance
      .addCase(fetchAllAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.allAttendance = action.payload.data;
        state.totalRecords = action.payload.total;
      })
      .addCase(fetchAllAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Attendance Record
      .addCase(updateAttendanceRecord.fulfilled, (state, action) => {
        state.allAttendance = state.allAttendance.map((rec) => 
          rec._id === action.payload._id ? action.payload : rec
        );
      });
  },
});

export const { clearAttendanceError } = attendanceSlice.actions;
export default attendanceSlice.reducer;
