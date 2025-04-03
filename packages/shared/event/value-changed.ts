export interface ValueChangedDetail<T = any> {
	value: T,
	context?: any
}

/**
 * This event is fired when a value is changed.
 */
export default class ValueChangedEvent<T = any, C = any> extends CustomEvent<ValueChangedDetail<T>> {
	static readonly eventName = 'value-changed';
	constructor(value: T, context?: C) {
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