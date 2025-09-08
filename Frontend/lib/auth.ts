import { auth, provider } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
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

// sign in with email and password function


// export const handleSignin = async (
//   e: React.FormEvent<HTMLFormElement>,
//   email: string,
//   password: string,
//   persistence: Persistence,
//   router: AppRouterInstance,
//   setLoggingIn: (bool: boolean) => void,
//   isDone: (bool: boolean) => void
// ) => {
//   e.preventDefault();
//   setLoggingIn(true);

//   try {
//     // await setPersistence(auth, persistence);
//     // const userCredential = await signInWithEmailAndPassword(
//     //   auth,
//     //   email,
//     //   password
//     // );
//     // await userCredential.user.reload();
//     // const token = await userCredential.user.getIdToken()
//     // const user = userCredential.user;
//     const user = await fetch("http://34.228.198.154/api/auth/login", {
//       method: "POST",
//       headers: {
//         // "Authorization": `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         email,
//         password: password,
//       }),
//     })

//     // if (!user.emailVerified) {
//     //   await auth.signOut(); // log them out
//     //   toast.warning("Please verify your email before logging in.");
//     //   setLoggingIn(false);
//     //   return;
//     // }
//     const resolvedUser = await user.json()
//     localStorage.setItem("token", resolvedUser.idToken)
//     console.log(resolvedUser)
//     toast.success("Logged in successfully");
//     isDone(true);
//     router.push('/dashboard')
//     return user;
//   } catch (error) {
//     const message = getFirebaseErrorMessage(error);
//     toast.error(message);
//     console.error("signin error:", error);
//     setLoggingIn(false);
//   }
// };


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



// export const handleSignin = async (
//   e: React.FormEvent<HTMLFormElement>,
//   email: string,
//   password: string,
//   router: AppRouterInstance,
//   setLoggingIn: (bool: boolean) => void,
//   isDone: (bool: boolean) => void
// ) => {
//   e.preventDefault();
//   setLoggingIn(true);

//   try {
//     const res = await fetch("http://34.228.198.154/api/auth/login", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email, password }),
//     });

//     if (!res.ok) throw new Error(`Login failed: ${res.statusText}`);
//     const resolvedUser = await res.json();

//     saveTokens(resolvedUser.idToken, resolvedUser.refreshToken);
//     console.log("Login success", resolvedUser);

//     toast.success("Logged in successfully");
//     isDone(true);
//     router.push("/dashboard");
//   } catch (err) {
//     console.error("signin error:", err);
//     toast.error((err as Error).message || "Something went wrong");
//     setLoggingIn(false);
//   }
// };





// export const handleSignin = async (
//   e: React.FormEvent<HTMLFormElement>,
//   email: string,
//   password: string,
//   router: AppRouterInstance,
//   setLoggingIn: (bool: boolean) => void,
//   isDone: (bool: boolean) => void
// ) => {
//   e.preventDefault();
//   setLoggingIn(true);

//   try {
//     const res = await fetch("http://34.228.198.154/api/auth/login", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email, password }),
//     });

//     if (!res.ok) {
//       throw new Error("Login failed");
//     }

//     const data = await res.json();

//     // If their backend returns a token
//     if (data?.token) {
//       localStorage.setItem("authToken", data.token);
//     }

//     toast.success("Logged in successfully");
//     isDone(true);
//     router.push("/dashboard");
//     return data;
//   } catch (error: any) {
//     console.error("signin error:", error);
//     toast.error(error.message || "Login failed");
//     setLoggingIn(false);
//   }
// };



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


    const token = await user.getIdToken()

    await fetch("http://34.228.198.154/users/sync-profile", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: user.email,
        name: user.displayName,
      }),
    })

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


// export const handleCreateAccount = async (
//   e: React.FormEvent<HTMLFormElement>,
//   email: string,
//   password: string,
//   fullName: string,
//   router: AppRouterInstance,
//   setError: (error: string) => void,
//   setSigningIn: (bool: boolean) => void,
//   setIsVerifying: (bool: boolean) => void
// ) => {
//   e.preventDefault();
//   setSigningIn(true);
//   setError("");

//   try {
//     const res = await fetch("/api/register", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         email,
//         password,
//         full_name: fullName, // ✅ backend requires this exact key
//       }),
//     });

//     if (!res.ok) {
//       const data = await res.json().catch(() => ({}));
//       throw new Error(data.message || "Registration failed");
//     }

//     const data = await res.json();

//     // save token if backend gives one
//     if (data.token) {
//       localStorage.setItem("authToken", data.token);
//     }

//     //toast.success("Account created! Please verify your email if required.");
//     setIsVerifying(true);

//     router.push("/dashboard");
//   } catch (error: any) {
//     console.error("signup error:", error);
//     //toast.error(error.message || "Failed to register");
//     setError(error.message || "Failed to register");
//   } finally {
//     setSigningIn(false);
//   }
// };


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

    const token = await user.getIdToken()

    await fetch("http://34.228.198.154/api/user/sync-profile", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        full_name: name,
      }),
    })

    //setName(name);

    await sendEmailVerification(user);
    toast.message("Verification email sent. Please check your inbox.");

    // Optionally store partial user now (or delay till verification)
    // await addDoc(collection(db, "users"), {
    //   email,
    //   name,
    //   verified: false,
    // });

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

export async function getCurrentUserFromFirestore() {
  try {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      throw new Error("No user is currently logged in.");
    }

    const email = currentUser.email;
    if (!email) {
      throw new Error("Logged in user has no email associated.");
    }

    const usersRef = collection(db, "users"); // 👈 your Firestore collection
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null; // no matching user found in Firestore
    }

    // Assuming unique email → return first match
    const userDoc = querySnapshot.docs[0];
    const data = userDoc.data() as Omit<user, "id">; // cast the Firestore doc
    const setName = useUsername.getState().setName;
    setName(data.name);
  } catch (error) {
    console.error("Error fetching current user from Firestore:", error);
    throw error;
  }
}




// import { auth, provider } from "@/lib/firebase";
// import {
//   signInWithEmailAndPassword,
//   signInWithPopup,
//   createUserWithEmailAndPassword,
//   sendEmailVerification,
//   User,
// } from "firebase/auth";

// import { toast } from "sonner";
// import { db } from "@/lib/firebase";
// import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
// import { addDoc, collection } from "firebase/firestore";
// import { getFirebaseErrorMessage } from "./firebaseErrorHandler";
// import { useUsername } from "@/state/usernameStore";

// const BASE_URL = "http://34.228.198.154";

// export interface AuthResult {
//   firebaseUser: User;
//   backendUser: any;
//   token: string;
// }

// async function syncWithBackend(user: User): Promise<AuthResult> {
//   const token = await user.getIdToken();

//   await fetch(`${BASE_URL}/users/sync-profile`, {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       email: user.email,
//       name: user.displayName || "Anonymous",
//     }),
//   });

//   const profileRes = await fetch(`${BASE_URL}/users/me`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   if (!profileRes.ok) {
//     throw new Error("Failed to fetch backend profile");
//   }

//   const backendUser = await profileRes.json();

//   if (backendUser?.name) {
//     useUsername.getState().setName(backendUser.name);
//   }

//   return { firebaseUser: user, backendUser, token };
// }

// export async function loginWithEmail(
//   email: string,
//   password: string,
//   router?: AppRouterInstance
// ): Promise<AuthResult | null> {
//   try {
//     const userCred = await signInWithEmailAndPassword(auth, email, password);
//     const user = userCred.user;

//     if (!user.emailVerified) {
//       await auth.signOut();
//       toast.warning("Please verify your email before logging in.");
//       return null;
//     }

//     const result = await syncWithBackend(user);
//     toast.success("Logged in successfully");
//     if (router) router.push("/dashboard");
//     return result;
//   } catch (error) {
//     toast.error(getFirebaseErrorMessage(error));
//     return null;
//   }
// }

// export async function signupWithEmail(
//   name: string,
//   email: string,
//   password: string
// ): Promise<AuthResult | null> {
//   try {
//     const userCred = await createUserWithEmailAndPassword(auth, email, password);
//     const user = userCred.user;

//     await sendEmailVerification(user);
//     toast.message("Verification email sent. Please check your inbox.");

//     await addDoc(collection(db, "users"), {
//       email,
//       name,
//       verified: false,
//     });

//     const result = await syncWithBackend(user);
//     return result;
//   } catch (error) {
//     toast.error(getFirebaseErrorMessage(error));
//     return null;
//   }
// }

// export async function loginWithGoogle(
//   router?: AppRouterInstance
// ): Promise<AuthResult | null> {
//   try {
//     const result = await signInWithPopup(auth, provider);
//     const user = result.user;

//     const synced = await syncWithBackend(user);
//     if (router) router.push("/dashboard");
//     return synced;
//   } catch (error) {
//     toast.error("Google sign-in failed");
//     console.error(error);
//     return null;
//   }
// }








