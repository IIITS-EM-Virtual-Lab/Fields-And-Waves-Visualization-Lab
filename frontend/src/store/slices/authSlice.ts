import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

// Define the shape of the client/user object
interface Client {
  name: string;
  email: string;
  // Add other fields if you store more info like id, role, etc.
}

// Define the shape of the auth slice state
export interface AuthState {
  token: string | null;
  client: Client | null;
  isAuthenticated: boolean;
}


// Initial state
const initialState: AuthState = {
  token: null,
  client: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; client: Client }>
    ) => {
      const { token, client } = action.payload;
      state.token = token;
      state.client = client;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.token = null;
      state.client = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

// Selectors
export const selectCurrentUser = (state: RootState) => state.auth.client;
export const selectCurrentToken = (state: RootState) => state.auth.token;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;

export default authSlice.reducer;
