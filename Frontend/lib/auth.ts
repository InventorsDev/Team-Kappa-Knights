import { auth, provider } from "@/lib/firebase";
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

// sign in with email and password function
export const handleSignin = async (
  e: React.FormEvent<HTMLFormElement>,
  email: string,
  password: string,
  persistence: Persistence,
  router: AppRouterInstance,
  setLoggingIn: (bool: boolean) => void,
  isDone: (bool: boolean) => void
) => {
  e.preventDefault();
  setLoggingIn(true);
  try {
    await setPersistence(auth, persistence);
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    await userCredential.user.reload();
    const user = userCredential.user;

    if (!user.emailVerified) {
      await auth.signOut(); // log them out
      toast.warning("Please verify your email before logging in.");
      setLoggingIn(false);
      return;
    }

    toast.success("Logged in successfully");
    isDone(true);
  } catch (error) {
    const message = getFirebaseErrorMessage(error);
    toast.error(message);
    console.error("signin error: ", message);
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
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
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
  password: string,
  setError: (error: string) => void,
  router: AppRouterInstance,
  name: string,
  email: string,
  setSigningIn: (bool: boolean) => void,
  setIsVerifying: (bool: boolean) => void
) => {
  e.preventDefault();

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

    await sendEmailVerification(user);
    toast.message("Verification email sent. Please check your inbox.");

    // Optionally store partial user now (or delay till verification)
    await addDoc(collection(db, "users"), {
      email,
      name,
      verified: false,
    });

    setIsVerifying(true);
  } catch (error) {
    const message = getFirebaseErrorMessage(error);
    toast.error(message);
    console.error("signup error: ", message);
    setSigningIn(false);
  }
};
