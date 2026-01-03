import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import payrollService, { SalaryStructure, Payslip } from "../../services/payroll.service";

interface PayrollState {
  myPayslips: Payslip[];
  allPayslips: Payslip[];
  currentSalaryStructure: SalaryStructure | null;
  loading: boolean;
  error: string | null;
}

const initialState: PayrollState = {
  myPayslips: [],
  allPayslips: [],
  currentSalaryStructure: null,
  loading: false,
  error: null,
};

export const fetchSalaryStructure = createAsyncThunk(
  "payroll/fetchSalaryStructure",
  async (loginId: string, { rejectWithValue }) => {
    try {
      return await payrollService.getSalaryStructure(loginId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch salary structure");
    }
  }
);

export const updateSalaryStructure = createAsyncThunk(
  "payroll/updateSalaryStructure",
  async (data: Partial<SalaryStructure> & { loginId: string }, { rejectWithValue }) => {
    try {
      return await payrollService.updateSalaryStructure(data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update salary structure");
    }
  }
);

export const generatePayslip = createAsyncThunk(
  "payroll/generatePayslip",
  async (data: { loginId: string; month: number; year: number }, { rejectWithValue }) => {
    try {
      return await payrollService.generatePayslip(data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to generate payslip");
    }
  }
);

export const fetchMyPayslips = createAsyncThunk(
  "payroll/fetchMyPayslips",
  async (_, { rejectWithValue }) => {
    try {
      return await payrollService.getMyPayslips();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch your payslips");
    }
  }
);

export const fetchAllPayslips = createAsyncThunk(
  "payroll/fetchAllPayslips",
  async (_, { rejectWithValue }) => {
    try {
      return await payrollService.getAllPayslips();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch all payslips");
    }
  }
);

const payrollSlice = createSlice({
  name: "payroll",
  initialState,
  reducers: {
    clearPayrollError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Salary Structure
      .addCase(fetchSalaryStructure.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSalaryStructure.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSalaryStructure = action.payload;
      })
      .addCase(fetchSalaryStructure.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Structure
      .addCase(updateSalaryStructure.fulfilled, (state, action) => {
        state.currentSalaryStructure = action.payload;
      })
      // Fetch My Payslips
      .addCase(fetchMyPayslips.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyPayslips.fulfilled, (state, action) => {
        state.loading = false;
        state.myPayslips = action.payload;
      })
      .addCase(fetchMyPayslips.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch All Payslips
      .addCase(fetchAllPayslips.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllPayslips.fulfilled, (state, action) => {
        state.loading = false;
        state.allPayslips = action.payload;
      })
      .addCase(fetchAllPayslips.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearPayrollError } = payrollSlice.actions;
export default payrollSlice.reducer;
