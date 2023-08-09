import { property, state, query } from 'lit/decorators.js';
import { Generic } from '../../generic/generic';
import { html, nothing } from 'lit';
import type { TemplateResult } from 'lit';
// import { HTMLEvent } from '../../types';
import { GenericI } from '../../generic/generic'
import { when } from 'lit/directives/when.js';
import translate  from '@preignition/preignition-util/translate-mixin.js';
import '../input-record'

// @ts-ignore
import locale  from './record-field-locale.mjs';
import { requestUpdateOnAriaChange } from '@material/web/internal/aria/delegate';




/**
 *
 * 

 */
// export abstract class RecordField extends translate(Generic, locale, 'readaloud') {
export abstract class RecordField extends Generic {
	
	static {
		requestUpdateOnAriaChange(this);
	}

	protected fieldName = 'record';

	@query('lapp-input-record') override readonly input!: HTMLInputElement;
	@query('lapp-input-record') override readonly inputOrTextarea!: HTMLInputElement;
	
	@property() src = '';

	override renderInputOrTextarea(): TemplateResult {
		return html`
		<lapp-input-record 
			aria-label=${this.ariaLabel || nothing}
			.src=${this.src}></lapp-input-record>
		
		`
	}

	

}
