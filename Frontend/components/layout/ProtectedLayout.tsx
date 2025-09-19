"use client";
import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserProfileStore } from "@/state/user";
import { UserProfile } from "@/types/user";
import Loader from "@/components/common/loader/Loader";

type Props = { children: ReactNode };

const getCurrentUser = async (token: string): Promise<UserProfile | null> => {
  try {
    const res = await fetch("http://34.228.198.154/api/user/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      console.error("Failed to fetch user:", res.statusText);
      return null;
    }

    const resolvedUser = await res.json();
    return resolvedUser as UserProfile;
  } catch (err) {
    console.error("Error fetching user:", err);
    return null;
  }
};

export default function ProtectedLayout({ children }: Props) {
  const router = useRouter();
  const [loader, setLoader] = useState(true);
  const setProfile = useUserProfileStore((state) => state.setProfile);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/");
      return;
    }

    (async () => {
      const user = await getCurrentUser(token);
      if (user) {
        setProfile(user); // ✅ save user into Zustand store
      } else {
        router.replace("/"); // optional: kick out if fetch failed
      }
      setLoader(false);
    })();
  }, [router, setProfile]);
  if (loader)
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Loader />
      </div>
    );

  return <>{children}</>;
}
