import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Customer, AuthTokens } from "../types";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: Customer | null;
  isAuthenticated: boolean;
  setAuth: (user: Customer, tokens: AuthTokens) => void;
  setAccessToken: (accessToken: string) => void;
  updateUser: (partial: Partial<Customer>) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,

      setAuth: (user, tokens) =>
        set({
          user,
          accessToken: tokens.access,
          refreshToken: tokens.refresh,
          isAuthenticated: true,
        }),

      setAccessToken: (accessToken) => set({ accessToken }),

      updateUser: (partial) =>
        set({
          user: get().user ? { ...get().user!, ...partial } : null,
        }),

      clearAuth: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "tredro-customer-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
