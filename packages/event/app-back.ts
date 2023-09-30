
/**
 * This event is fired when the application need to go back to a previous page.
 */
export default class AppBackEvent extends Event {
  static readonly eventName = 'app-back';
  constructor() {
    super(AppBackEvent.eventName, {
      bubbles: true,
      composed: true,
    });
  }
}

declare global {
  interface HTMLElementEventMap {
    'app-back': AppBackEvent,
  }
}