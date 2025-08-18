import { create } from "zustand";
import { User } from "firebase/auth";

type AuthState = {
  user: User | null;
  setUser: (user: User | null, rememberMe?: boolean) => void;
  isAuthenticated: boolean;
  rememberMe: boolean;
  hydrated: boolean;
  clearUser: () => void;
  setHydrated: () => void;
};

// export const useAuthStore = create<AuthState>((set) => ({
//     user: null,
//     isAuthenticated: false,
//     setUser: (user, rememberMe = false) => {
//         set({ user, isAuthenticated: !!user, rememberMe })
//         if (rememberMe && user) {
//             localStorage.setItem("user", JSON.stringify(user))
//         }
//     },
//     hydrated: false,
//     clearUser: () => {
//         localStorage.removeItem("user")
//         set({ user: null, isAuthenticated: false, rememberMe: false })
//     },
//     rememberMe: false,
//     setHydrated: () => set({ hydrated: true })
// })
// )
