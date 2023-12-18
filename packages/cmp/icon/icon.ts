import { customElement } from 'lit/decorators.js';

import { Icon } from './internal/icon.js';
import { MdIcon } from '@material/web/icon/icon.js'
import styles from './internal/icon-styles.js';

declare global {
	interface HTMLElementTagNameMap {
		'lapp-icon': LappIcon;
	}
}

/**
 * @final
 * @suppress {visibility}
 */
@customElement('lapp-icon')
export class LappIcon extends Icon {
	static override styles = [
		MdIcon.styles,
		styles
	];
}