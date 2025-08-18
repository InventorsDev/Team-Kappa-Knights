'use client'
// import { onAuthStateChanged } from "firebase/auth";
import { useAuthStore } from "../state/authStore";
// import { auth } from "@/lib/firebase";
import { ReactNode, useEffect } from "react";

export function AuthProvider({children}: {children: ReactNode}) {
    const setUser = useAuthStore((state) => state.setUser)
  const setHydrated = useAuthStore((s) => s.setHydrated);

    useEffect(() => {
        const savedUser = localStorage.getItem("user")
            if (savedUser) {
                setUser(JSON.parse(savedUser), true)
            } 
    setHydrated();
    }, [setUser, setHydrated])

    return <>{children}</>
}