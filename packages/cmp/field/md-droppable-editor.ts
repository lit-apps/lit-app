// TODO: import from lapp-textfield and remove lapp-textfield
import { customElement } from 'lit/decorators.js';

import MdDroppableEditor from './md/md-droppable-editor.js';

declare global {
	interface HTMLElementTagNameMap {
		'lapp-md-droppable-editor': LappMdDroppableEditor;
	}
}

/**
 * A markdown editor that support translation and preview.
 */
@customElement('lapp-md-droppable-editor')
export class LappMdDroppableEditor extends MdDroppableEditor {

}
