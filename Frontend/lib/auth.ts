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
// import { signInWithEmailAndPassword } from "firebase/auth";
interface FirestoreUser {
  email: string;
  name: string;
  verified: boolean;
  isOnboarded: boolean;
}
export const handleSignin = async (
  e: React.FormEvent<HTMLFormElement>,
  persistence: Persistence,
  router: AppRouterInstance,
  setLoggingIn: (bool: boolean) => void,
  isDone: (bool: boolean) => void
) => {
  e.preventDefault();
  setLoggingIn(true);

  const { email, password } = useUserStore.getState();

  try {
    // STEP 1: login to backend
    const res = await fetch("http://34.228.198.154/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      throw new Error(`Backend login failed (HTTP ${res.status})`);
    }

    const resolvedUser = await res.json();

    if (!resolvedUser.idToken) {
      throw new Error("No idToken returned from API");
    }

    // STEP 2: login to Firebase
    // optional: await setPersistence(auth, persistence);
    const fbUser = await signInWithEmailAndPassword(auth, email, password);

    // STEP 3: store backend token
    localStorage.setItem("token", resolvedUser.idToken);
    console.log(resolvedUser.idToken);

    // STEP 4: check Firestore for onboarding status
    const userRef = doc(db, "users", fbUser.user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      throw new Error("User not found in Firestore");
    }

    const userData = userSnap.data() as FirestoreUser;
    console.log(userData);

    if (!userData.isOnboarded) {
      isDone(true);
    } else {
      toast.success("Logged in successfully");
      router.push("/dashboard");
    }

    return { backend: resolvedUser, firebase: fbUser.user };
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

// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { doc, setDoc } from "firebase/firestore";
// import { auth, db } from "@/lib/firebase";
// import { getFirebaseErrorMessage } from "@/lib/firebaseErrors";
// import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
// import { toast } from "react-hot-toast";
// import { useUserStore } from "@/store/userStore";

export const handleCreateAccount = async (
  e: React.FormEvent<HTMLFormElement>,
  setError: (error: string) => void,
  router: AppRouterInstance,
  setSigningIn: (bool: boolean) => void
) => {
  e.preventDefault();

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
    // STEP 1: Create user in Firebase
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // STEP 2: Get Firebase ID token
    const idToken = await user.getIdToken();

    // STEP 3: Send Firebase token + profile info to backend
    const backendRes = await fetch(
      "http://34.228.198.154/api/user/sync-profile",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          email,
          password,
          full_name: name,
        }),
      }
    );

    if (!backendRes.ok) {
      const backendError = await backendRes.text();
      throw new Error(`Backend error: ${backendError}`);
    }

    // STEP 4: Save user in Firestore (optional if backend already handles it)
    await setDoc(doc(db, "users", user.uid), {
      email,
      name,
      verified: false,
      isOnboarded: false,
    });

    // STEP 5: Store token locally (for API calls)
    localStorage.setItem("token", idToken);

    // STEP 6: Navigate away
    toast.success("Account created successfully");
    router.replace("/interests");

    return user;
  } catch (error: any) {
    const message = getFirebaseErrorMessage(error);
    toast.error(message);
    console.error("signup error:", error);
    setError(message);
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
