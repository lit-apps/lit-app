
/**
 * This event is fired when a new app is connected to the DOM
 * so that it can be tracked by the main app
 */
export default class AppConnectedEvent extends Event {
  static readonly eventName = 'app-connected';
  constructor() {
    super(AppConnectedEvent.eventName, {
      bubbles: true,
      composed: true,
    });
  }
}

declare global {
  interface HTMLElementEventMap {
    'app-connected': AppConnectedEvent,
  }
}