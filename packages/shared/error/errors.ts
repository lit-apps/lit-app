/**
 * Common error codes used throughout the application
 */
export type ErrorCodeT =
  | 'auth/invalid-credentials'     // Authentication errors
  | 'auth/user-not-found'
  | 'auth/email-already-in-use'
  | 'auth/weak-password'
  | 'auth/requires-recent-login'
  | 'network/offline'              // Network-related errors
  | 'network/timeout'
  | 'network/connection-error'
  | 'data/not-found'               // Data errors
  | 'data/invalid'
  | 'data/permission-denied'
  | 'data/already-exists'
  | 'validation/required'          // Form validation errors
  | 'validation/format'
  | 'validation/constraint'
  | 'api/rate-limit'               // API errors
  | 'api/server-error'
  | 'api/bad-request'
  | 'app/unknown'                  // Generic application errors
  | 'app/not-implemented'

/**
 * Base custom error with code field
 */
abstract class BaseAppError extends Error {
  code: ErrorCodeT;
  data?: any;

  constructor(code: ErrorCodeT, message: string, data?: any) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.data = data;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Authentication specific errors
 */
export class AuthError extends BaseAppError {
  constructor(code: Extract<ErrorCodeT, `auth/${string}`>, message: string, data?: any) {
    super(code, message, data);
  }
}

/**
 * Network specific errors
 */
export class NetworkError extends BaseAppError {
  constructor(code: Extract<ErrorCodeT, `network/${string}`>, message: string, data?: any) {
    super(code, message, data);
  }
}

/**
 * Data specific errors
 */
export class DataError extends BaseAppError {
  constructor(code: Extract<ErrorCodeT, `data/${string}`>, message: string, data?: any) {
    super(code, message, data);
  }
}

/**
 * Validation specific errors
 */
export class ValidationError extends BaseAppError {
  constructor(code: Extract<ErrorCodeT, `validation/${string}`>, message: string, data?: any) {
    super(code, message, data);
  }
}

/**
 * API specific errors
 */
export class ApiError extends BaseAppError {
  constructor(code: Extract<ErrorCodeT, `api/${string}`>, message: string, data?: any) {
    super(code, message, data);
  }
}

/**
 * Generic application errors
 */
export class AppError extends BaseAppError {
  constructor(code: Extract<ErrorCodeT, `app/${string}`>, message: string, data?: any) {
    super(code, message, data);
  }
}

// Export the BaseAppError class to be used by the event
export { BaseAppError };

// Union type of all possible custom error types
export type ApplicationError =
  | AuthError
  | NetworkError
  | DataError
  | ValidationError
  | ApiError
  | AppError;

/**
 * Helper function to create the appropriate error instance based on error code
 */
export function createError(code: ErrorCodeT, message: string, data?: any): ApplicationError {
  if (code.startsWith('auth/')) {
    return new AuthError(code as Extract<ErrorCodeT, `auth/${string}`>, message, data);
  } else if (code.startsWith('network/')) {
    return new NetworkError(code as Extract<ErrorCodeT, `network/${string}`>, message, data);
  } else if (code.startsWith('data/')) {
    return new DataError(code as Extract<ErrorCodeT, `data/${string}`>, message, data);
  } else if (code.startsWith('validation/')) {
    return new ValidationError(code as Extract<ErrorCodeT, `validation/${string}`>, message, data);
  } else if (code.startsWith('api/')) {
    return new ApiError(code as Extract<ErrorCodeT, `api/${string}`>, message, data);
  } else {
    return new AppError(code as Extract<ErrorCodeT, `app/${string}`>, message, data);
  }
}
