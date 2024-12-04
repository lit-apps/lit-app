export interface HasChangedDetail {
  /**
   * The path of the data to check
   */
	path: string
  /**
   * the name of the entity to check
   */
  entityName: string
  /**
   * If the data has changed
   */
	hasChanged?: boolean
}

/**
 * This event is fired to check upstream if the data has changed
 */
export default class DataHasChangedEvent extends CustomEvent<HasChangedDetail> {
	static readonly eventName = 'data-has-changed';
	constructor(path: string, entityName: string) {
		super(DataHasChangedEvent.eventName, {
			bubbles: true,
			composed: true,
			detail: {path, entityName }
		});
	}
}

declare global {
	interface HTMLElementEventMap {
		'data-has-changed': DataHasChangedEvent,
	}
}