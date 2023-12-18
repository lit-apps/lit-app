type Value = string | {[key:string]: string}
export interface specifyChangedDetail {
	value: Value;
}
/**
 * This event is fired to trigger the main application hoist an element
 */

export default class specifyChangedEvent extends CustomEvent<specifyChangedDetail> {
	static readonly eventName = 'specify-changed';
	constructor(value: Value) {
		super(specifyChangedEvent.eventName, {
			bubbles: true,
			composed: true,
			detail: { value: value }
		});
	}
}

declare global {
	interface HTMLElementEventMap {
		'specify-changed': specifyChangedEvent;
	}
}
