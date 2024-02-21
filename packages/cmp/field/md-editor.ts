// TODO: import from lapp-textfield and remove lapp-textfield
import { customElement } from 'lit/decorators.js';

import MdEditor from './md/md-editor.js';

declare global {
	interface HTMLElementTagNameMap {
		'lapp-md-editor': LappMdEditor;
	}
}

/**
 * A markdown editor that support translation and preview.
 */
@customElement('lapp-md-editor')
export class LappMdEditor extends MdEditor {

}
