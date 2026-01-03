import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { employeeService } from '@/services/employee.service';
import type { User, CreateEmployeeRequest, UpdateProfileRequest } from '@/types/auth.types';

interface EmployeeState {
  employees: User[];
  selectedEmployee: User | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const initialState: EmployeeState = {
  employees: [],
  selectedEmployee: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
};

export const fetchEmployees = createAsyncThunk(
  'employee/fetchAll',
  async ({ page, limit }: { page?: number; limit?: number } = {}, { rejectWithValue }) => {
    try {
      const response = await employeeService.getAllEmployees(page, limit);
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch employees');
    }
  }
);

export const createNewEmployee = createAsyncThunk(
  'employee/create',
  async (data: CreateEmployeeRequest, { rejectWithValue }) => {
    try {
      const response = await employeeService.createEmployee(data);
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create employee');
    }
  }
);

export const updateEmployeeInfo = createAsyncThunk(
  'employee/update',
  async ({ loginId, data }: { loginId: string; data: UpdateProfileRequest }, { rejectWithValue }) => {
    try {
      const response = await employeeService.updateEmployee(loginId, data);
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update employee');
    }
  }
);

export const toggleEmployeeStatus = createAsyncThunk(
  'employee/toggleStatus',
  async ({ loginId, currentStatus }: { loginId: string; currentStatus: boolean }, { rejectWithValue }) => {
    try {
      if (currentStatus) {
        await employeeService.deactivateEmployee(loginId);
      } else {
        await employeeService.activateEmployee(loginId);
      }
      return { loginId, isActive: !currentStatus };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update employee status');
    }
  }
);

const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    setSelectedEmployee: (state, action: PayloadAction<User | null>) => {
      state.selectedEmployee = action.payload;
    },
    clearEmployeeError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Employees
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload.data || [];
        if (action.payload.meta) {
          state.pagination = action.payload.meta;
        }
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create Employee
      .addCase(createNewEmployee.pending, (state) => {
        state.loading = true;
      })
      .addCase(createNewEmployee.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.data?.employee) {
          state.employees.unshift(action.payload.data.employee);
        }
      })
      .addCase(createNewEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Employee
      .addCase(updateEmployeeInfo.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateEmployeeInfo.fulfilled, (state, action) => {
        state.loading = false;
        const updatedEmployee = action.payload.data;
        if (updatedEmployee) {
          state.employees = state.employees.map((emp) =>
            emp.loginId === updatedEmployee.loginId ? updatedEmployee : emp
          );
        }
      })
      .addCase(updateEmployeeInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Toggle Status
      .addCase(toggleEmployeeStatus.fulfilled, (state, action) => {
        const { loginId, isActive } = action.payload;
        state.employees = state.employees.map((emp) =>
          emp.loginId === loginId ? { ...emp, isActive } : emp
        );
      });
  },
});

export const { setSelectedEmployee, clearEmployeeError } = employeeSlice.actions;
export default employeeSlice.reducer;
