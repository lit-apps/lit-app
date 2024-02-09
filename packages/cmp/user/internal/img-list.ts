import { html, css, LitElement, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import '../img'

export class UserImgList  extends LitElement {

	static override styles = css`
			:host {
				display: flex;
				flex-direction: row;
				gap: var(--space-medium);
				--_lapp-user-img-size: var(--lapp-user-img-size, 40px);
			}
			:host([overlap]) {
				flex-direction: row-reverse;
				gap: 0px;
				transition: gap 0.1s;
			}
			:host([overlap]:hover)  {
				gap: calc(var(--_lapp-user-img-size) * 1.1);
			}
			:host([overlap]) lapp-user-img {
				margin-left: calc(var(--_lapp-user-img-size) * -0.9);
			}
			:host([overlap]) lapp-user-img:first-of-type {
				z-index: 1;
			}

		`;
	
	@property({attribute: false}) uids!: string[];
	/**
	 * if true, images will overlap and animate on hover
	 */
	@property({type: Boolean, reflect: true}) overlap: boolean = false

	override render() {
		const length = this.uids?.length || 1;
		const style = this.overlap ?  
			html`<style>:host { min-width: calc(${((length || 1) ) * 1.2 } * var(--_lapp-user-img-size)) }</style>` : 
			nothing;
		return html`
			${style}
			${this.uids?.map((uid, index) => html`<lapp-user-img style="z-index: ${length - index}" .uid=${uid}></lapp-user-img>`)}
		`; 
	}


}


