import {
  ApplicationError,
  BaseAppError,
  ErrorCodeT
} from '../error/errors.js';

export interface AppErrorDetail {
  /**
   * Error code for categorizing errors
   */
  code: ErrorCodeT;

  /**
   * Human-readable error message
   */
  message: string;

  /**
   * Optional additional error data
   */
  data?: any;

  /**
   * Optional promise for asynchronous handling
   */
  promise?: Promise<any>;
}

/**
 * This event is fired to notify the application about errors
 */
export default class AppErrorEvent extends CustomEvent<AppErrorDetail> {
  static readonly eventName = 'app-error';

  constructor(code: ErrorCodeT | ApplicationError, messageOrData?: string | any, data?: any) {
    let errorDetail: AppErrorDetail;

    if (code instanceof BaseAppError) {
      errorDetail = {
        code: code.code as ErrorCodeT,
        message: code.message,
        data: code.data
      };
    } else {
      errorDetail = {
        code: code,
        message: typeof messageOrData === 'string' ? messageOrData : 'An error occurred',
        data: typeof messageOrData !== 'string' ? messageOrData : data
      };
    }

    super(AppErrorEvent.eventName, {
      bubbles: true,
      composed: true,
      detail: errorDetail
    });
  }
}

declare global {
  interface HTMLElementEventMap {
    'app-error': AppErrorEvent,
  }
}


