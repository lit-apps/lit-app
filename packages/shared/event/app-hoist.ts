export type AppHoistProperty = {
	open: boolean, 
	context?: string
}
export interface AppHoistDetail {
  name: string;
	properties: AppHoistProperty
}

/**
 * This event is fired to trigger the main application hoist an element
 */
export default class AppHoistEvent extends CustomEvent<AppHoistDetail> {
  static readonly eventName = 'app-hoist';
  constructor(detail: AppHoistDetail) {
    super(AppHoistEvent.eventName, {
      bubbles: true,
      composed: true,
      detail: detail
    });
  }
}

declare global {
  interface HTMLElementEventMap {
    'app-hoist': AppHoistEvent,
  }
}