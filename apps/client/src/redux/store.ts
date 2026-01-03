import { configureStore, createSlice } from "@reduxjs/toolkit"

// Dummy slice to prevent empty reducer error
const dummySlice = createSlice({
  name: 'dummy',
  initialState: {},
  reducers: {},
});

export const store = configureStore({
  reducer: {
    dummy: dummySlice.reducer,
  },
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;