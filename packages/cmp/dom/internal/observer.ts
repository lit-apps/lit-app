import { MutationController } from '@lit-labs/observers/mutation-controller.js';
import { LitElement } from "lit";

/**
 * Listen to dom changes and dispatch content-changed event when content changes 
 */
export class DomObserver extends LitElement {

	private _observer = new MutationController(this, {
		config: {
			characterData: true, subtree: true, childList: true
		},
		callback: (_records) => {
			this.dispatchEvent(new CustomEvent('content-changed', { detail: { value: this.innerText }, composed: true }));
		}
	});

	constructor() {
		super();
		this.style.setProperty('display', 'contents')
	}

	override createRenderRoot() {
		return this;
	}

	override get innerText() {
		return [...this.children].map((el) => (el as HTMLElement).innerText || '').join(' ');
	}

}


