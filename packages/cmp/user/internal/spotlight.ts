import { LitElement, css, html } from 'lit';
import { property } from 'lit/decorators.js';
import '../img';
import('@material/web/labs/card/outlined-card.js');


/**
 * A card like container with a gradient at the top 
 * and a user avatar 
 * 
 * css variables:
 * --lapp-user-spotlight-height: height of the user spotlight header. Will be used to calc margins an avatar size
 * 
 */

export class UserSpotlight extends LitElement {

	static override shadowRootOptions: ShadowRootInit = {
    mode: 'open',
    delegatesFocus: true,
  };

	static override styles = css`
    :host {
      display: flex;
			flex-direction: row;
			position: relative;
			--_lapp-user-spotlight-height: var(--lapp-user-spotlight-height, 32px);
    }
		a {
			all:unset;
			cursor: pointer;
			width: 100%;
			position: relative;

		}
		.content {
			padding: var(--_lapp-user-spotlight-height) var(--_lapp-user-spotlight-height) calc(0.5 * var(--_lapp-user-spotlight-height)) var(--_lapp-user-spotlight-height);  
		}
		.header {
			height: var(--_lapp-user-spotlight-height);
			background: linear-gradient(to right in oklab , var(--color-primary) 33%,var(--color-secondary));
		}
		:host(.secondary) .header{
			background: linear-gradient(to right in oklab , var(--color-secondary) 33%,var(--color-tertiary));
			
		}
		:host(.tertiary) .header{
			background: linear-gradient(to right in oklab , var(--color-tertiary)  33%,var(--color-primary));
			
		}
		lapp-user-img {
			--lapp-user-img-size: var(--_lapp-user-spotlight-height);
			position: absolute;
			top: calc( 0.5 * var(--_lapp-user-spotlight-height));
			left: calc(1 * var(--_lapp-user-spotlight-height));
		}
		md-outlined-card {
			flex: 1;
			min-height: calc(var(--_lapp-user-spotlight-height) * 2.5);
			overflow:hidden;
		}
    `;
	@property() uid!: string;
	@property() href!: string;


	override render() {
		if(this.href) {
			return html`<a href=${this.href}>
				<md-focus-ring  style="--md-focus-ring-shape: 10px"></md-focus-ring>
				${this.renderInside()}
			</a>`
		}
		return this.renderInside();
		
	}

	renderInside() {
		return html`
		<md-outlined-card>
			<lapp-user-img .uid=${this.uid}></lapp-user-img>
			 <div class="header"></div>
			<div class="content">
				<slot></slot>
			</div>
	</md-outlined-card>
		`
	}

}
