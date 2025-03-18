export class FirebaseError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
  }
}

export const ErrorCodes = {
  AUTH_FAILED: 'auth/operation-failed',
  CLASS_NOT_FOUND: 'firestore/class-not-found',
  USER_NOT_FOUND: 'auth/user-not-found',
  EMAIL_ALREADY_IN_USE: 'auth/email-already-in-use',
  INVALID_EMAIL: 'auth/invalid-email',
  WEAK_PASSWORD: 'auth/weak-password',
  PERMISSION_DENIED: 'firestore/permission-denied',
  NETWORK_ERROR: 'network/error',
  UNKNOWN_ERROR: 'unknown/error'
};

export const handleFirebaseError = (error) => {
  switch (error.code) {
    case ErrorCodes.AUTH_FAILED:
      return 'Authentication failed. Please try again.';
    case ErrorCodes.CLASS_NOT_FOUND:
      return 'Class not found. Please check the class ID.';
    case ErrorCodes.USER_NOT_FOUND:
      return 'User not found. Please check your credentials.';
    case ErrorCodes.EMAIL_ALREADY_IN_USE:
      return 'This email is already in use. Please use a different email.';
    case ErrorCodes.INVALID_EMAIL:
      return 'The email address is not valid. Please check and try again.';
    case ErrorCodes.WEAK_PASSWORD:
      return 'The password is too weak. Please use a stronger password.';
    case ErrorCodes.PERMISSION_DENIED:
      return 'You do not have permission to perform this action.';
    case ErrorCodes.NETWORK_ERROR:
      return 'Network error. Please check your connection and try again.';
    default:
      return 'An unknown error occurred. Please try again later.';
  }
};