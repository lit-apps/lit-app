import { form, page } from '@preignition/preignition-styles';
import outlined from '@preignition/preignition-styles/src/outlined';
import { css } from 'lit';
import { customElement } from 'lit/decorators.js';
import EntityDangerZone from './src/cmp/entity-danger-zone';

declare global {
  interface HTMLElementTagNameMap {
    'lapp-entity-danger-zone': LappEntityDangerZone;
  }
}

/**
 * @final
 * @suppress {visibility}
 */
@customElement('lapp-entity-danger-zone')
export default class LappEntityDangerZone extends EntityDangerZone {
	static override styles = [
		...page,
		form,
		outlined,
		css`
		:host {
			display: block;
			--outlined-color: var(--color-warning, #f57c00);
			--outlined-padding: 24px;
		}
		md-list.outlined {
			max-width: 650px;
		}
		`
	]
  
}
