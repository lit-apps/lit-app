import { LitElement, css, html } from 'lit';
import { property } from 'lit/decorators.js';
import '../img';


/**
 * A card like container with an avatar on the left
 */

export class UserThread extends LitElement {

	static override styles = css`
    :host {
      display: flex;
			flex-direction: row;
			--_lapp-user-thread-size: var(--lapp-user-thread-size, 32px);
			--_lapp-user-thread-thick: var(--lapp-user-thread-thick, max(2px, 0.125rem));
    }
		::slotted([slot="headline"]) {
			padding-top: calc(0.5 * var(--_lapp-user-thread-size));
			padding-left: calc(0.5 * var(--_lapp-user-thread-size));
			padding-right: var(--space-medium);
			height: var(--_lapp-user-thread-size);
		}

		.flex {
			flex: 1;

		}
		.content {
			min-height: calc(2 *var(--_lapp-user-thread-size));
			padding: calc(0.5 * var(--_lapp-user-thread-size)); 
		}
		.side {
			position: relative;
			width: calc( 1.5 * var(--_lapp-user-thread-size));
		}

		.side::before {
			content: '';
			display: block;
			position: absolute;
			top: 0;
			bottom: 0;
			left: var(--_lapp-user-thread-size);
			background-color: var(--color-surface-container-highest);
			width: var(--_lapp-user-thread-thick);
		}
		:host([first]) .side::before	{
			top: var(--_lapp-user-thread-size);
			
		}

		lapp-user-img {
			--lapp-user-img-size: var(--_lapp-user-thread-size);
			position: absolute;
			top: calc( 0.5 * var(--_lapp-user-thread-size));
			left: calc( 0.5 * var(--_lapp-user-thread-size));
		}
  `;
	@property() uid!: string;

	override render() {
		return html`
		<div class="side">
			<lapp-user-img .uid=${this.uid}></lapp-user-img>
		</div>
		<div class="flex">
			<slot name="headline"></slot>
			<div class="content">
				<slot></slot>
			</div>
		</div>`

	}


}
