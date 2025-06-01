import { configureStore } from '@reduxjs/toolkit';
import authReducer, { AuthState } from './slices/authSlice';

// Define structure of persisted state
interface PersistedState {
  auth: AuthState;
}

// Load from localStorage
function loadFromLocalStorage(): PersistedState | undefined {
  try {
    const serializedState = localStorage.getItem('reduxState');
    if (serializedState === null) return undefined;
    return JSON.parse(serializedState);
  } catch (e) {
    console.warn('Could not load state:', e);
    return undefined;
  }
}

// Save to localStorage
function saveToLocalStorage(state: PersistedState) {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('reduxState', serializedState);
  } catch (e) {
    console.warn('Could not save state:', e);
  }
}

const persistedState = loadFromLocalStorage();

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  preloadedState: persistedState,
});

store.subscribe(() => {
  saveToLocalStorage(store.getState());
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
