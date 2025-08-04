import { FirebaseError } from "firebase/app";

export function getFirebaseErrorMessage(error: unknown): string {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      // 🔐 Auth Errors – Sign-up
      case "auth/email-already-in-use":
        return "Email is already in use.";
      case "auth/invalid-email":
        return "Invalid email address.";
      case "auth/operation-not-allowed":
        return "Signups are currently disabled.";
      case "auth/weak-password":
        return "Your password is too weak.";

      // 🔑 Auth Errors – Sign-in
      case "auth/user-not-found":
        return "No account found with this email.";
      case "auth/wrong-password":
        return "Incorrect password.";
      case "auth/too-many-requests":
        return "Too many attempts. Please try again later.";
      case "auth/user-disabled":
        return "This account has been disabled.";

      // 🧾 Firestore Errors
      case "permission-denied":
        return "You do not have permission to perform this action.";
      case "unavailable":
        return "Firestore service is currently unavailable. Try again later.";
      case "cancelled":
        return "The operation was cancelled.";
      case "not-found":
        return "The requested document was not found.";
      case "deadline-exceeded":
        return "The request took too long. Please try again.";
      case "resource-exhausted":
        return "Quota exceeded. Too many operations in a short time.";
      case "unauthenticated":
        return "You must be signed in to perform this action.";
      case "already-exists":
        return "A document with this ID already exists.";
      case "invalid-argument":
        return "An invalid argument was provided.";

      // 🧱 Common fallback
      default:
        return `Firebase error: ${
          error.message || "An unknown error occurred."
        }`;
    }
  }

  return "Unexpected error occurred.";
}
