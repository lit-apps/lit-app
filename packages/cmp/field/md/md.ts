import { html, LitElement, nothing } from "lit";
import { property } from 'lit/decorators.js';
import { ConsumeAccessibilityMixin } from '../../mixin/context-accessibility-mixin';
import { parse } from '@lit-app/shared/md/index.js';
import { classMap } from 'lit/directives/class-map.js';
import { MdConfigT } from './types';

import 'lite-youtube-embed';
import '../../youtube/youtube';
/**
 * An element to render markdown content, with accessibility features: 
 * md is supporting `.[show/hide]-when-signlanguage`, `.[show/hide]-when-readaloud`, `.[show/hide]-when-easyread` classes
 * to hide/show content according to accessibility settings.
 */


export default class lappMd extends ConsumeAccessibilityMixin(LitElement) {

	/**
	 * markdown content to render
	 */
	@property() md!: string;

	/**
	 * configuration for markdown parser
	 */
	@property({ attribute: false }) mdConfig!: MdConfigT;

	override render() {
		// we make md field tabbable if we detect accessible device
		const tabindex = this.accessibility?.accessibleDevice ? 0 : nothing;
		return html`<div tabindex="${tabindex}" class="markdown ${classMap(this.accessibilityClasses)}">${parse(this.md, this.mdConfig)}</div>`;
	}

	// Used by readaloud to read text
	getReadAloud() {
		return this.innerText || 'this field is empty';
	}

	// Note(cg): we want to render value in light dom so that
	// textContent work on parent elements.
	override createRenderRoot() {
		return this;
	}
}
