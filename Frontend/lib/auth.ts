import { auth, provider } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  setPersistence,
  signInWithEmailAndPassword,
  Persistence,
  signInWithPopup,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
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
import { useUserProfileStore } from "@/state/user";
import { useOnboardingStore } from "@/state/useOnboardingData";
import { clearNonAuthStorage } from "@/lib/token";
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

    // STEP 3.0: Clear any persisted non-auth state from previous users (Zustand persists)
    try {
      clearNonAuthStorage();
      // also clear in-memory slices
      const u = useUserStore.getState();
      u.setName("");
      u.setEmail("");
      u.setPassword("");
      u.setProfilePic("");
      u.setSelectedTags([]);
      u.setMood("");
      u.setDesc("");
      u.setDob({ day: "", month: "", year: "" });
      useOnboardingStore.getState().reset();
      useUserProfileStore.getState().clearProfile();
    } catch {}

    // STEP 3.1: Verify backend profile really exists and is active
    const me = await fetch("http://34.228.198.154/api/user/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resolvedUser.idToken}`,
      },
    });

    if (!me.ok) {
      // Backend says user not found/unauthorized — clean up and abort
      localStorage.removeItem("token");
      await signOut(auth).catch(() => {});
      throw new Error("Account not found or access denied. Please sign up again.");
    }

    const backendProfile = await me.json();

    // STEP 3.2: Derive onboarding from backend when available
    // Fall back to Firestore if backend doesn't expose it
    const backendOnboarded = typeof backendProfile?.onboarding_completed === 'boolean'
      ? backendProfile.onboarding_completed
      : null;

    // STEP 4: check Firestore for onboarding status (for consistency)
    const userRef = doc(db, "users", fbUser.user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      // Create user document with default values
      await setDoc(userRef, {
        email: fbUser.user.email,
        name: fbUser.user.displayName || email,
        verified: fbUser.user.emailVerified,
        isOnboarded: backendOnboarded ?? false,
      });
    } else if (backendOnboarded !== null) {
      // keep Firestore flag in sync with backend
      const current = userSnap.data() as FirestoreUser;
      if (current.isOnboarded !== backendOnboarded) {
        await setDoc(userRef, { isOnboarded: backendOnboarded }, { merge: true });
      }
    }

    const finalOnboarded = backendOnboarded ?? ((userSnap.data() as FirestoreUser | undefined)?.isOnboarded || false);

    // Check onboarding status and route accordingly
    if (!finalOnboarded) {
      console.log("User needs onboarding - starting onboarding flow");
      setLoggingIn(false);
      isDone(true);
    } else {
      console.log("User has completed onboarding - redirecting to dashboard");
      setLoggingIn(false);
      toast.success("Logged in successfully");
      router.push("/dashboard");
    }

    return { backend: resolvedUser, firebase: fbUser.user };
  } catch (err: unknown) {
    console.error("signin error:", err);
    const message = err instanceof Error ? err.message : "Login failed";
    toast.error(message);
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

  await fetch("http://34.228.198.154/api/user/sync-profile", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: user.email,
        full_name: user.displayName || "",
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

    // STEP 5.0: Clear any persisted non-auth state from previous sessions
    try {
      clearNonAuthStorage();
      const u = useUserStore.getState();
      u.setName("");
      u.setEmail("");
      u.setPassword("");
      u.setProfilePic("");
      u.setSelectedTags([]);
      u.setMood("");
      u.setDesc("");
      u.setDob({ day: "", month: "", year: "" });
      useOnboardingStore.getState().reset();
      useUserProfileStore.getState().clearProfile();
    } catch {}

    // STEP 5.1: Ensure frontend store shows correct full name immediately
    try {
      useUserProfileStore.getState().setFullName(name);
    } catch {}

    // STEP 5.2: Best-effort ensure backend full_name is correct (in case sync-profile ignored it)
    try {
      await fetch("http://34.228.198.154/api/user/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ full_name: name }),
      });
    } catch (e) {
      console.warn("Failed to enforce full_name via /api/user/me PUT", e);
    }

    // STEP 6: Navigate away
    toast.success("Account created successfully");
    router.replace("/interests");

    return user;
  } catch (error: unknown) {
    const message = getFirebaseErrorMessage(error as unknown as Error);
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
