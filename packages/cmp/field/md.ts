// TODO: import from lapp-textfield and remove lapp-textfield
import { customElement } from 'lit/decorators.js';

import Md from './md/md.js';

declare global {
	interface HTMLElementTagNameMap {
		'lapp-md': LappMd;
	}
}

/**
 * An element to render markdown content, with accessibility features:
 * md is supporting `.[show/hide]-when-signlanguage`, `.[show/hide]-when-readaloud`, `.[show/hide]-when-easyread` classes
 * to hide/show content according to accessibility settings.
 * 
 */
@customElement('lapp-md')
export class LappMd extends Md {

}
