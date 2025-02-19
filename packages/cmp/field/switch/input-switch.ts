
import { css } from 'lit';
import { customElement } from 'lit/decorators.js';

// import styles from './Switch-styles';
// import { CSSResult } from 'lit';
import { InputSwitch } from './internal/input-switch';

declare global {
	interface HTMLElementTagNameMap {
		'lapp-switch': LappInputSwitch;
	}
}

/**
 * # Switch 
 * 
 * @summary
 * Switch is a component that display allow to register a Switch and store it locally.
 
 * @final
 */
@customElement('lapp-switch')
export class LappInputSwitch extends InputSwitch {
	static override styles = [
		...InputSwitch.styles,
		css`
		label {
			display: flex;
    	align-items: center;
		}
		`

	];



}
