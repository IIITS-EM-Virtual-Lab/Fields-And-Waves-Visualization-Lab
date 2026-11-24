import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';

try {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('reduxState');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
} catch (e) {
  // Ignore localStorage access errors
}

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
