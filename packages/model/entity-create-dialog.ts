import { form, label, page } from '@preignition/preignition-styles';
import { customElement } from 'lit/decorators.js';

import CreateDialog from './src/cmp/entity-create-dialog';

declare global {
  interface HTMLElementTagNameMap {
    'lapp-entity-create-dialog': LappCreateDialog;
  }
}

/**
 * @final
 * @suppress {visibility}
 */
@customElement('lapp-entity-create-dialog')
export class LappEntityCreateDialog extends CreateDialog {
	static override styles = [
		...page,
		form, 
		label
	]
  
}
