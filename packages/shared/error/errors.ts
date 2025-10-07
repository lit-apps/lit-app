import { AppErrorEvent } from "../event/index.js";

const validCodes = [
  'auth/invalid-credentials',
  'auth/user-not-found',
  'auth/email-already-in-use',
  'auth/weak-password',
  'auth/requires-recent-login',
  'network/offline',
  'network/timeout',
  'network/connection-error',
  'data/not-found',
  'data/invalid',
  'data/permission-denied',
  'data/already-exists',
  'validation/required',
  'validation/format',
  'validation/constraint',
  'api/rate-limit',
  'api/server-error',
  'api/bad-request',
  'app/unknown',
  'app/not-implemented'
] as const;

/**
 * Common error codes used throughout the application
 */
export type ErrorCodeT = typeof validCodes[number];



/**
 * Error options interface for all custom errors
 */
export interface ErrorOptions {
  message: string;
  data?: any;
  cause?: unknown;
}

/**
 * Base class for application-specific errors.
 * Extends the native Error class with additional properties for error handling.
 * 
* @abstract    
 * @class
 * @extends {Error}
 * 
 * @property {ErrorCodeT | string} code - Error code identifier
 * @property {any} [data] - Optional additional data associated with the error
 * 
 * @param {ErrorCodeT | string} code - The error code
 * @param {ErrorOptions | string} optionsOrMessage - Either an options object or an error message string
 * @param {unknown | string} [cause] - The cause of the error (optional)
 * 
 * @throws {Error} Throws an error with the specified message and maintains proper stack trace (V8 only)
 */
export abstract class BaseAppError extends Error {
  code: ErrorCodeT | string; // we add string so that we can extend with other error codes
  data?: any;

  constructor(code: ErrorCodeT | string, optionsOrMessage: ErrorOptions | string, cause?: unknown | string) {
    if (typeof optionsOrMessage === 'string') {
      optionsOrMessage = {
        message: optionsOrMessage,
        data: undefined,
        cause: cause
      };
    }
    // @ts-ignore TS2554 - does not exist on Node
    super(optionsOrMessage.message, { cause: optionsOrMessage.cause });
    this.name = this.constructor.name;
    this.code = code;
    this.data = optionsOrMessage.data;
    // @ts-ignore TS2339 - does not exist on Node
    this.cause = optionsOrMessage.cause;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

type Substring<
  S extends string,
  T extends string
> = S extends `${T}${infer N}` ? N : never

/**
 * Authentication specific errors
 */
export class AuthError extends BaseAppError {
  constructor(code: Substring<Extract<ErrorCodeT, `auth/${string}`>, 'auth/'>, optionsOrMessage: ErrorOptions | string, cause?: unknown) {
    super(`auth/${code}`, optionsOrMessage, cause);
  }
}

/**
 * Network specific errors
 */
export class NetworkError extends BaseAppError {
  constructor(code: Substring<Extract<ErrorCodeT, `network/${string}`>, 'network/'>, optionsOrMessage: ErrorOptions | string, cause?: unknown) {
    super(`network/${code}`, optionsOrMessage, cause);
  }
}


/**
 * Data specific errors
 */
export class DataError extends BaseAppError {
  constructor(code: Substring<Extract<ErrorCodeT, `data/${string}`>, 'data/'>, optionsOrMessage: ErrorOptions | string, cause?: unknown) {
    super(`data/${code}`, optionsOrMessage, cause);
  }
}

/**
 * Validation specific errors
 */
export class ValidationError extends BaseAppError {
  constructor(code: Substring<Extract<ErrorCodeT, `validation/${string}`>, 'validation/'>, optionsOrMessage: ErrorOptions | string, cause?: unknown) {
    super(`validation/${code}`, optionsOrMessage, cause);
  }
}

/**
 * API specific errors
 */
export class ApiError extends BaseAppError {
  constructor(code: Substring<Extract<ErrorCodeT, `api/${string}`>, 'api/'>, optionsOrMessage: ErrorOptions | string, cause?: unknown) {
    super(`api/${code}`, optionsOrMessage, cause);
  }
}

/**
 * Generic application errors
 */
export class AppError extends BaseAppError {
  constructor(code: Substring<Extract<ErrorCodeT, `app/${string}`>, 'app/'>, optionsOrMessage: ErrorOptions | string, cause?: unknown) {
    super(`app/${code}`, optionsOrMessage, cause);
  }
}

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
export function createError(code: ErrorCodeT, optionsOrMessage: ErrorOptions | string, cause?: unknown): ApplicationError {
  if (code.startsWith('auth/')) {
    return new AuthError(code.substring(5) as Substring<Extract<ErrorCodeT, `auth/${string}`>, 'auth/'>, optionsOrMessage, cause);
  } else if (code.startsWith('network/')) {
    return new NetworkError(code.substring(8) as Substring<Extract<ErrorCodeT, `network/${string}`>, 'network/'>, optionsOrMessage, cause);
  } else if (code.startsWith('data/')) {
    return new DataError(code.substring(5) as Substring<Extract<ErrorCodeT, `data/${string}`>, 'data/'>, optionsOrMessage, cause);
  } else if (code.startsWith('validation/')) {
    return new ValidationError(code.substring(11) as Substring<Extract<ErrorCodeT, `validation/${string}`>, 'validation/'>, optionsOrMessage, cause);
  } else if (code.startsWith('api/')) {
    return new ApiError(code.substring(4) as Substring<Extract<ErrorCodeT, `api/${string}`>, 'api/'>, optionsOrMessage, cause);
  } else {
    return new AppError(code.substring(4) as Substring<Extract<ErrorCodeT, `app/${string}`>, 'app/'>, optionsOrMessage, cause);
  }
}

export function isErrorCode(code: string): code is ErrorCodeT {
  return validCodes.includes(code as ErrorCodeT);
} 

/**
 * Dispatches an AppErrorEvent if the error is an instance of BaseAppError,
 * otherwise throws the error.
 * 
 * @param el - The HTML element that will dispatch the error event
 * @param error - The error to be dispatched or thrown
 * @throws {Error} If the error is not an instance of BaseAppError
 */
export function dispatchOrThrow(el: HTMLElement, error: ApplicationError | Error) {
  if (error instanceof BaseAppError) {
    const event = new AppErrorEvent(error);
    el.dispatchEvent(event);
    return
  }
  throw error
} 