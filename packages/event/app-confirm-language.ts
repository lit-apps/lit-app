
interface AppConfirmLanguageDetail {
  force?: boolean;
}

/**
 * This event is fired to trigger a language widget popup window.
 */
export default class AppConfirmLanguageEvent extends CustomEvent<AppConfirmLanguageDetail> {
  static readonly eventName = 'app-confirm-language';
  constructor(detail: AppConfirmLanguageDetail = {}) {
    super(AppConfirmLanguageEvent.eventName, {
      bubbles: true,
      composed: true,
      detail: detail
    });
  }
}

declare global {
  interface HTMLElementEventMap {
    'app-confirm-language': AppConfirmLanguageEvent,
  }
}