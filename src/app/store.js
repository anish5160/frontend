import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { userAuthApi } from '../services/userAuthApi'
import { attendanceApi } from '../services/attendanceApi'
import authReducer from '../features/authSlice'
import userReducer from '../features/userSlice';
export const store = configureStore({
  reducer: {
    [userAuthApi.reducerPath]: userAuthApi.reducer,
    [attendanceApi.reducerPath]: attendanceApi.reducer,
    auth: authReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userAuthApi.middleware, attendanceApi.middleware),
});

setupListeners(store.dispatch);