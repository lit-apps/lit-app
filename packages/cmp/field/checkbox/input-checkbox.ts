
import { PropertyValues, html, css, CSSResult } from 'lit';
import { customElement } from 'lit/decorators.js';

// import styles from './Checkbox-styles';
// import { CSSResult } from 'lit';
import { InputCheckbox } from './internal/input-checkbox';

declare global {
	interface HTMLElementTagNameMap {
		'lapp-checkbox': LappInputCheckbox;
	}
}

/**
 * # Checkbox 
 * 
 * @summary
 * Checkbox is a component that display allow to register a Checkbox and store it locally.
 
 * @final
 */
@customElement('lapp-checkbox')
export class LappInputCheckbox extends InputCheckbox {
	static override styles: CSSResult[] = [
		...InputCheckbox.styles, 
		css`
		label {
			display: flex;
    	align-items: center;
		}
		`

	];



}
