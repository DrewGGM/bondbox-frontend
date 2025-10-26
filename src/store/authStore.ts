import { create } from 'zustand';
import { UserService, UserServiceImp } from '@/api/services/userService';
import credentialManager from '@/utils/credentialManager';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  lastCheck: number | null;

  // Actions
  initialize: () => Promise<void>;
  verifyToken: () => Promise<boolean>;
  logout: () => void;
  setAuthenticated: (value: boolean) => void;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
const userService: UserService = new UserServiceImp();

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  isLoading: true,
  isInitialized: false,
  lastCheck: null,

  initialize: async () => {
    const state = get();

    // Already initialized, skip
    if (state.isInitialized) {
      return;
    }

    set({ isLoading: true });

    // Quick check - no token means not authenticated
    if (!credentialManager.token()) {
      set({
        isAuthenticated: false,
        isLoading: false,
        isInitialized: true,
        lastCheck: Date.now()
      });
      return;
    }

    // Verify token with backend
    try {
      await userService.verifyToken();
      set({
        isAuthenticated: true,
        isLoading: false,
        isInitialized: true,
        lastCheck: Date.now()
      });

      // Start periodic verification (every 5 minutes)
      setInterval(() => {
        const currentState = get();
        if (currentState.isAuthenticated) {
          currentState.verifyToken();
        }
      }, CACHE_DURATION);

    } catch (error) {
      // Token is invalid/expired
      credentialManager.deleteToken();
      set({
        isAuthenticated: false,
        isLoading: false,
        isInitialized: true,
        lastCheck: Date.now()
      });
    }
  },

  verifyToken: async () => {
    const state = get();
    const now = Date.now();

    // Use cache if available and fresh (less than 5 minutes old)
    if (state.lastCheck && (now - state.lastCheck) < CACHE_DURATION) {
      return state.isAuthenticated;
    }

    // No token means not authenticated
    if (!credentialManager.token()) {
      set({
        isAuthenticated: false,
        lastCheck: now
      });
      return false;
    }

    // Verify with backend
    try {
      await userService.verifyToken();
      set({
        isAuthenticated: true,
        lastCheck: now
      });
      return true;
    } catch (error) {
      // Token is invalid/expired
      credentialManager.deleteToken();
      set({
        isAuthenticated: false,
        lastCheck: now
      });
      return false;
    }
  },

  logout: () => {
    credentialManager.deleteToken();
    set({
      isAuthenticated: false,
      lastCheck: Date.now()
    });
  },

  setAuthenticated: (value: boolean) => {
    set({
      isAuthenticated: value,
      lastCheck: Date.now()
    });
  }
}));
