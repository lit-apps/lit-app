
import { customElement } from 'lit/decorators.js';

import styles from './record-styles';
import { CSSResult } from 'lit';
import { InputRecord } from './internal/input-record';

declare global {
	interface HTMLElementTagNameMap {
		'lapp-input-record': LappInputRecord;
	}
}

/**
 * # record 
 * 
 * @summary
 * Record is a component that display allow to register a record and store it locally.
 
 * @final
 */
@customElement('lapp-input-record')
export class LappInputRecord extends InputRecord {
	static override styles: CSSResult[] = [
		styles

	];
}
