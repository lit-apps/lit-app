import { label } from '@lit-app/shared/styles';
import page from '@lit-app/shared/styles/page.js';
import { css } from 'lit';
import { customElement } from 'lit/decorators.js';
import CreateDialog from './src/cmp/entity-create-dialog';
;

declare global {
	interface HTMLElementTagNameMap {
		'lapp-entity-create-dialog': LappEntityCreateDialog;
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
		label,
		css`
			:host {
				/* 
				 * TODO: remove when we stop using MD2 app layout 
				 * For the time being, necessary to make sure the dialog is 
				 * on top of the app layout
				 */
				z-index: var(--z-index-modal, 700)
			}
		`
	]

}
