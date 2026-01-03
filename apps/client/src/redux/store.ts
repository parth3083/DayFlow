import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./slices/authSlice"
import employeeReducer from './slices/employeeSlice';
import dashboardReducer from './slices/dashboardSlice';
import attendanceReducer from './slices/attendanceSlice';
import leaveReducer from './slices/leaveSlice';
import payrollReducer from './slices/payrollSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    employee: employeeReducer,
    dashboard: dashboardReducer,
    attendance: attendanceReducer,
    leave: leaveReducer,
    payroll: payrollReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;