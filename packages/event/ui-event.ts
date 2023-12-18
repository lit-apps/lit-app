export interface appUIDetail {
	id?: string
	item?: {
		id: string
		type: string
	}
}

/**
 * This event is fired when an element closes on the main application
 * this can happen for instance when a dialog is closed, or a close tab button is clicked
 */
export default class UICloseEvent extends CustomEvent<appUIDetail> {
	static readonly eventName = 'app-ui-close';
	constructor(detail: appUIDetail = {}) {
		super(UICloseEvent.eventName, {
			bubbles: true,
			composed: true,
			detail: detail
		});
	}
}

declare global {
	interface HTMLElementEventMap {
		'app-ui-close': UICloseEvent,
	}
}