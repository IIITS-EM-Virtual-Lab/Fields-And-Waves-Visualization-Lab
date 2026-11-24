import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { apiClient } from '../../config/api';

export interface Client {
  name: string;
  email: string;
  _id: string;
  profilePicture?: string;
  isAdmin?: boolean;
}

export interface AuthState {
  client: Client | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  client: null,
  isAuthenticated: false,
  isInitialized: false,
  isLoading: true,
  error: null,
};

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/api/auth/me');
      if (response.data.success && response.data.user) {
        return response.data.user as Client;
      }
      return rejectWithValue('Invalid user payload');
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Session expired or not found');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await apiClient.post('/api/auth/logout');
      return true;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Logout failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ client: Client }>
    ) => {
      state.client = action.payload.client;
      state.isAuthenticated = true;
      state.isInitialized = true;
      state.isLoading = false;
      state.error = null;
    },
    logout: (state) => {
      state.client = null;
      state.isAuthenticated = false;
      state.isInitialized = true;
      state.isLoading = false;
      state.error = null;
    },
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setAuthError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // checkAuth
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action: PayloadAction<Client>) => {
        state.client = action.payload;
        state.isAuthenticated = true;
        state.isInitialized = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.client = null;
        state.isAuthenticated = false;
        state.isInitialized = true;
        state.isLoading = false;
      })
      // logoutUser
      .addCase(logoutUser.fulfilled, (state) => {
        state.client = null;
        state.isAuthenticated = false;
        state.isInitialized = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.client = null;
        state.isAuthenticated = false;
        state.isInitialized = true;
        state.isLoading = false;
      });
  },
});

export const { setCredentials, logout, setAuthLoading, setAuthError } = authSlice.actions;

// Selectors
export const selectCurrentUser = (state: RootState) => state.auth.client;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectIsAuthInitialized = (state: RootState) => state.auth.isInitialized;
export const selectIsAuthLoading = (state: RootState) => state.auth.isLoading;
export const selectCurrentToken = (_state: RootState) => null;

export default authSlice.reducer;
