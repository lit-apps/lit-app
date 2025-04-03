import { parse } from '@lit-app/shared/md/index.js';
import { HTMLEvent } from "@lit-app/shared/types.js";
import { LifSpan } from '@preignition/lit-firebase/span';
import FirebaseDocumentController from "@preignition/lit-firebase/src/firebase-document-controller";
import { html, nothing } from "lit";
import { property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ConsumeAccessibilityMixin } from '../../mixin/context-accessibility-mixin';
import { LappMdEditor } from "../md-editor.js";
import { MdConfigT } from './types';

/**
 * An element to render markdown content straight from firebase.
 * It is supporting `.[show/hide]-when-signlanguage`, `.[show/hide]-when-readaloud`, `.[show/hide]-when-easyread` classes
 * to hide/show content according to accessibility settings.
 */

export default class lappMdLif extends ConsumeAccessibilityMixin(LifSpan) {

	/**
	 * configuration for markdown parser
	 */
	@property({ attribute: false }) mdConfig!: MdConfigT;
	@state() edit: boolean = false;
	constructor() {
		super();
		if (import.meta.env.VITE_PREVIEW === 'true') {
			// console.info('I AM IN PREVIEW');
			document.addEventListener('keydown', (event) => {
				// console.info('I HEAR KEYDOWN', event);

				if (event.ctrlKey && event.altKey && (event.key === 'e' || event.key === 'é' || event.code === 'KeyE' || event.key === 'p')) {
					// if (event.ctrlKey && event.altKey && event.code === 'KeyE') {
					// Handle the Ctrl + Alt + E key combination
					this.edit = !this.edit;
				}
			});
		}
	}

	override render() {
		return this.edit && import.meta.env.VITE_PREVIEW === 'true' ? this.renderEdit() : super.render();
	}

	renderEdit() {
		const onInput = (e: HTMLEvent<LappMdEditor>) => {
			console.info('onInput', e.target.md);
			(this.valueController as FirebaseDocumentController).set(e.target.md);
		}
		return html`<lapp-md-editor
			style="width: 100%;"
			rows="15"
    	.md=${this.value} 
			@md-changed=${onInput}
    ></lapp-md-editor>`
	}

	override renderValue(value: string) {
		// we make md field tabbable if we detect accessible device
		const tabindex = this.accessibility?.accessibleDevice ? 0 : nothing as any;
		return html`<div tabindex=${tabindex} class="markdown ${classMap(this.accessibilityClasses)}">${parse(this.format(value), this.mdConfig)}</div>`;
	}
}
