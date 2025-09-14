import { auth, provider } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  setPersistence,
  signInWithEmailAndPassword,
  Persistence,
  signInWithPopup,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";

import { toast } from "sonner";
import { db } from "@/lib/firebase";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { addDoc, collection } from "firebase/firestore";
import { getFirebaseErrorMessage } from "./firebaseErrorHandler";
import { query, where, getDocs } from "firebase/firestore";
import { useUsername } from "@/state/usernameStore";
import { saveTokens } from "./token";
import { useUserStore } from "@/state/store";
// import { useAuthStore } from "@/state/authStore";

export const handleSignin = async (
  e: React.FormEvent<HTMLFormElement>,
  persistence: Persistence,
  router: AppRouterInstance,
  setLoggingIn: (bool: boolean) => void,
  isDone: (bool: boolean) => void
) => {
  e.preventDefault();
  setLoggingIn(true);

  // grab both values in one go
  const { email, password } = useUserStore.getState();

  try {
    // optional: await setPersistence(auth, persistence);
    //console.log("sending", { email, password });

    const res = await fetch("http://34.228.198.154/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const resolvedUser = await res.json();

    if (!resolvedUser.idToken) {
      throw new Error("No idToken returned from API");
    }

    localStorage.setItem("token", resolvedUser.idToken);

    toast.success("Logged in successfully");
    isDone(true);
    router.push("/dashboard");
    return resolvedUser;
  } catch (err: any) {
    console.error("signin error:", err);
    toast.error(err.message || "Login failed");
    setLoggingIn(false);
  }
};

//  Google sign up function
export const handleGoogleSignup = async (
  setSigningIn: (bool: boolean) => void,
  signingIn: boolean,
  router: AppRouterInstance
) => {
  if (signingIn) return;
  setSigningIn(true);
  // const { email, password } = useUserStore.getState();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const token = await user.getIdToken();

    await fetch("http://34.228.198.154/users/sync-profile", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: user.email,
        name: user.displayName,
      }),
    });

    router.push("login");
    console.log(user);
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error) {
      const err = error as { code: string };
      if (err.code === "auth/popup-closed-by-user") {
        console.log("User closed the popup before completing sign-in");
      } else {
        console.error("Google Sign-In Error:", err);
      }
    }
  } finally {
    setSigningIn(false);
  }
};

export const handleCreateAccount = async (
  e: React.FormEvent<HTMLFormElement>,
  //password: string,
  setError: (error: string) => void,
  router: AppRouterInstance,
  //name: string,
  //email: string,
  setSigningIn: (bool: boolean) => void,
  setIsVerifying: (bool: boolean) => void
) => {
  e.preventDefault();
  //const setName = useUsername.getState().setName;
  const { name, email, password } = useUserStore.getState();

  if (password.length < 8) {
    toast.error("Password must be at least 8 characters long");
    return;
  }

  if (!name || !email || !password) {
    toast.error("Please fill in all fields");
    return;
  }

  setSigningIn(true);
  setError("");

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    const token = await user.getIdToken();

    await fetch("http://34.228.198.154/api/user/sync-profile", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        full_name: name,
      }),
    });

    //setName(name);

    await sendEmailVerification(user);
    toast.message("Verification email sent. Please check your inbox.");

    await setDoc(doc(db, "users", user.uid), {
      email,
      name,
      verified: false,
    });

    setIsVerifying(true);
    return user;
  } catch (error) {
    const message = getFirebaseErrorMessage(error);
    toast.error(message); // 🚀 user-friendly message now
    console.error("signin error:", error); // log raw error for debugging
    setSigningIn(false);
  }
};

interface user {
  name: string;
  id: string;
  email: string;
  verified: boolean;
}

// lib/auth.ts
export async function getCurrentUserFromFirestore() {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error("No user logged in.");

  const userRef = doc(db, "users", currentUser.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) return null;

  return userSnap.data() as { name: string; email: string };
}
