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
    console.log('Storing token from backend login:', resolvedUser.idToken);
    localStorage.setItem("token", resolvedUser.idToken);
    
    // Also get Firebase token as backup
    const firebaseToken = await fbUser.user.getIdToken();
    console.log('Firebase token:', firebaseToken);

    // STEP 4: check Firestore for onboarding status
    const userRef = doc(db, "users", fbUser.user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      console.warn("User not found in Firestore, assuming not onboarded");
      // Create user document with default values
      await setDoc(userRef, {
        email: fbUser.user.email,
        name: fbUser.user.displayName || email,
        verified: fbUser.user.emailVerified,
        isOnboarded: false,
      });
      console.log("User needs onboarding - starting onboarding flow");
      setLoggingIn(false); // Reset loading state
      isDone(true); // Start onboarding flow
      return { backend: resolvedUser, firebase: fbUser.user };
    }

    const userData = userSnap.data() as FirestoreUser;
    console.log('User Firebase profile:', userData);
    console.log('Onboarding status:', userData.isOnboarded);

    // Check onboarding status and route accordingly
    if (!userData.isOnboarded) {
      console.log("User needs onboarding - starting onboarding flow");
      setLoggingIn(false); // Reset loading state
      isDone(true); // ✅ Only set to true when user hasn't completed onboarding
    } else {
      console.log("User has completed onboarding - redirecting to dashboard");
      setLoggingIn(false); // Reset loading state
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

    router.push("dashboard");
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
    console.log('Storing token from account creation:', idToken);
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

// Check user's onboarding status from Firestore
export async function getUserOnboardingStatus(): Promise<{ isOnboarded: boolean; userData: FirestoreUser | null }> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return { isOnboarded: false, userData: null };
    }

    const userRef = doc(db, "users", currentUser.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      console.warn('User document does not exist in Firestore');
      return { isOnboarded: false, userData: null };
    }

    const userData = userSnap.data() as FirestoreUser;
    return { isOnboarded: userData.isOnboarded || false, userData };
  } catch (error) {
    console.error("Failed to check onboarding status:", error);
    return { isOnboarded: false, userData: null };
  }
}

// Update user's onboarding status in Firestore
export async function updateUserOnboardingStatus(isOnboarded: boolean = true) {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("No user logged in.");
    }

    const userRef = doc(db, "users", currentUser.uid);
    await setDoc(userRef, { isOnboarded }, { merge: true });
    
    console.log(`User onboarding status updated to: ${isOnboarded}`);
    return true;
  } catch (error) {
    console.error("Failed to update onboarding status:", error);
    throw error;
  }
}

// Debug function to check current user's onboarding status (can be called from browser console)
export async function debugUserOnboardingStatus() {
  console.log('=== USER ONBOARDING STATUS DEBUG ===');
  const { isOnboarded, userData } = await getUserOnboardingStatus();
  console.log('Is Onboarded:', isOnboarded);
  console.log('User Data:', userData);
  console.log('=====================================');
  return { isOnboarded, userData };
}
