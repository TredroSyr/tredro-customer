import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Customer, AuthTokens } from "../types";

interface AuthState {
  accessToken: string | null;
  user: Customer | null;
  isAuthenticated: boolean;
  hasOnboarded: boolean;
  setAuth: (user: Customer, tokens: AuthTokens) => void;
  updateUser: (partial: Partial<Customer>) => void;
  setHasOnboarded: () => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      user: null,
      isAuthenticated: false,
      hasOnboarded: false,

      setAuth: (user, tokens) =>
        set({
          user,
          accessToken: tokens.access,
          isAuthenticated: true,
        }),

      updateUser: (partial) =>
        set({
          user: get().user ? { ...get().user!, ...partial } : null,
        }),

      setHasOnboarded: () => set({ hasOnboarded: true }),

      clearAuth: () =>
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "tredro-customer-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        hasOnboarded: state.hasOnboarded,
      }),
    },
  ),
);
