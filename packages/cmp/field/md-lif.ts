// TODO: import from lapp-textfield and remove lapp-textfield
import { customElement } from 'lit/decorators.js';

import MdLif from './md/md-lif.js';

declare global {
	interface HTMLElementTagNameMap {
		'lapp-md-lif': LappMdLif;
	}
}

/**
 * An element to render markdown content straight from firebase.
 * It is supporting `.[show/hide]-when-signlanguage`, `.[show/hide]-when-readaloud`, `.[show/hide]-when-easyread` classes
 * to hide/show content according to accessibility settings.
 */
@customElement('lapp-md-lif')
export class LappMdLif extends MdLif {

}
