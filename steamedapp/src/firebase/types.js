import { FirebaseError } from 'firebase/app';

export { FirebaseError };

export const ErrorCodes = {
  AUTH_FAILED: 'auth/operation-failed',
  CLASS_NOT_FOUND: 'firestore/class-not-found',
  USER_NOT_FOUND: 'auth/user-not-found',
  EMAIL_ALREADY_IN_USE: 'auth/email-already-in-use',
  INVALID_EMAIL: 'auth/invalid-email',
  WEAK_PASSWORD: 'auth/weak-password',
  EMAIL_NOT_FOUND: 'auth/email-not-found',
  WRONG_PASSWORD: 'auth/wrong-password',
  TOO_MANY_REQUESTS: 'auth/too-many-requests',
  PERMISSION_DENIED: 'firestore/permission-denied',
  NETWORK_ERROR: 'network/error',
  UNKNOWN_ERROR: 'unknown/error',
  EMAIL_NOT_VERIFIED: 'auth/email-not-verified',
  ACCOUNT_DISABLED: 'auth/account-disabled',
};

export const handleFirebaseError = (error) => {
  // If error is not a Firebase error, return generic message
  if (!(error instanceof FirebaseError)) {
    return 'An unknown error occurred. Please try again later.';
  }

  // -----------------------| Firebase Auth Errors |-----------------------
  switch (error.code) {
    case 'auth/email-already-in-use':
      return 'This email address is already in use. Please use a different email or try logging in.';

    case 'auth/invalid-email':
      return 'The email address is not valid. Please check and try again.';

    case 'auth/weak-password':
      return 'The password is too weak. Please use a stronger password (at least 6 characters).';

    case 'auth/user-not-found':
      return 'No account found with this email address. Please check your email or register.';

    case 'auth/wrong-password':
      return 'Incorrect password. Please check your password and try again.';

    case 'auth/too-many-requests':
      return 'Too many unsuccessful login attempts. Please try again later or reset your password.';

    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection and try again.';

    case 'auth/operation-not-allowed':
      return 'This operation is not allowed. Please contact support.';

    case 'auth/requires-recent-login':
      return 'This action requires you to re-authenticate. Please log out and log back in.';

    case 'auth/account-exists-with-different-credential':
      return 'An account already exists with the same email but different sign-in credentials.';

    case 'auth/popup-closed-by-user':
      return 'The popup was closed before the operation could complete. Please try again.';

    case 'auth/cancelled-popup-request':
      return 'The authentication popup request was cancelled. Please try again.';

    case 'auth/popup-blocked':
      return 'The authentication popup was blocked by the browser. Please allow popups for this site.';

    case 'auth/unauthorized-domain':
      return 'This domain is not authorized for OAuth operations. Please contact support.';

    case 'auth/invalid-action-code':
      return 'The action code is invalid. This could be because it has expired or was already used.';

    case 'firestore/permission-denied':
      return 'You do not have permission to perform this action. Please log in with the correct account.';

    case 'firestore/unavailable':
      return 'The service is currently unavailable. Please try again later.';

    case 'firestore/data-loss':
      return 'A data loss error occurred. Please try again or contact support.';

    case 'firestore/class-not-found':
      return 'Class not found. Please check the class ID.';

    case 'auth/email-not-verified':
      return 'Please verify your email address before logging in. A new verification email has been sent.';

      case 'auth/account-disabled':
        return 'Your account has been disabled by your teacher. Please contact them for assistance.';

    default:
      console.error('Unhandled Firebase error:', error.code, error.message);
      return 'An error occurred. Please try again later.';
  }
};