export interface ValueChangedDetail<T = any> {
	value: T,
	context?: any
}

/**
 * This event is fired when an element closes on the main application
 * this can happen for instance when a dialog is closed, or a close tab button is clicked
 */
export default class ValueChangedEvent<T = any> extends CustomEvent<ValueChangedDetail<T>> {
	static readonly eventName = 'value-changed';
	constructor(value: T, context?: any) {
		super(ValueChangedEvent.eventName, {
			bubbles: true,
			composed: true,
			detail: { value, context }
		});
	}
}



declare global {
	interface HTMLElementEventMap {
		'value-changed': ValueChangedEvent,
	}
}