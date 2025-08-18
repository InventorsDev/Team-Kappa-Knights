import { create } from "zustand";

type AuthState = {
  isAuthenticated: boolean;
  setUser: (user: boolean) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  setUser: (user) => set({ isAuthenticated: user }),
}));
