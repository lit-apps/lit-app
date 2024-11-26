
import { feedback } from "./src/feedbackState.js";
export interface showFeedbackDetail {
  delay?: number;
  promise?: Promise<any>;
}

export interface activateFeedbackDetail {
  delay?: number;
  promise?: Promise<any>;
}
export interface submitFeedbackDetail extends feedback {
  context?: {
    href: string;
    title: string;
  };
  // screenshot?: boolean;
  promise?: Promise<any>;
}

/**
 * This event is fired to trigger the main application hoist an element
 */
export class FeedbackSubmitEvent extends CustomEvent<submitFeedbackDetail> {
  static readonly eventName = 'feedback-submit';
  constructor(detail: submitFeedbackDetail ) {
    super(FeedbackSubmitEvent.eventName, {
      bubbles: true,
      composed: true,
      detail: detail
    });
  }
}

export class FeedbackShowEvent extends CustomEvent<showFeedbackDetail> {
  static readonly eventName = 'feedback-show';
  constructor(detail: showFeedbackDetail) {
    super(FeedbackShowEvent.eventName, {
      bubbles: true,
      composed: true,
      detail: detail
    });
  }
}

export class FeedbackActivateEvent extends CustomEvent<activateFeedbackDetail> {
  static readonly eventName = 'feedback-activate';
  constructor(detail: activateFeedbackDetail) {
    super(FeedbackActivateEvent.eventName, {
      bubbles: true,
      composed: true,
      detail: detail
    });
  }
}

declare global {
  interface HTMLElementEventMap {
    'feedback-submit': FeedbackSubmitEvent,
    'feedback-show': FeedbackShowEvent,
    'feedback-activate': FeedbackActivateEvent
  }
}