import { customElement } from 'lit/decorators.js';
import Creator from './src/cmp/entity-creator';

declare global {
  interface HTMLElementTagNameMap {
    'lapp-entity-creator': LappEntityCreator;
  }
}

/**
 * @final
 * @suppress {visibility}
 */
@customElement('lapp-entity-creator')
export class LappEntityCreator extends Creator {
  // static override styles = [
  // 	...page,
  // 	form, 
  // 	label, 
  // 	css`
  // 		:host {
  // 			/* 
  // 			 * TODO: remove when we stop using MD2 app layout 
  // 			 * For the time being, necessary to make sure the dialog is 
  // 			 * on top of the app layout
  // 			 */
  // 			z-index: var(--z-index-modal, 700)
  // 		}
  // 	`
  // ]

}
