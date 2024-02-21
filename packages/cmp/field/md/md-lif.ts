import { html, nothing } from "lit";
import { property, state } from 'lit/decorators.js';
import { ConsumeAccessibilityMixin } from '../../mixin/context-accessibility-mixin';
import { parse } from '@lit-app/md-parser';
import { classMap } from 'lit/directives/class-map.js';
import { LifSpan } from '@preignition/lit-firebase/span';
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

	renderValue(value) {
		// we make md field tabbable if we detect accessible device
		const tabindex = this.accessibility?.accessibleDevice ? 0 : nothing;
		return html`<div tabindex="${tabindex}" class="markdown ${classMap(this.accessibilityClasses)}">${parse(this.format(value), this.mdConfig)}</div>`;
	}
}
