import { property, state, query } from 'lit/decorators.js';
import { Generic } from '../../generic/generic';
import { html, nothing } from 'lit';
import type { TemplateResult } from 'lit';
// import { HTMLEvent } from '@lit-app/shared/types';
import { GenericI } from '../../generic/generic'
import { when } from 'lit/directives/when.js';
import translate  from '@preignition/preignition-util/translate-mixin.js';
import '../input-record'

// @ts-expect-error  - we are cheating
import locale  from './record-field-locale.mjs';
import {
	createValidator
} from '@material/web/labs/behaviors/constraint-validation.js';
import {RecordValidator} from './recordValidator';
import { Validator } from '@material/web/labs/behaviors/validators/validator';
import { InputRecord } from './input-record';



/**
 *
 * 

 */
// export abstract class RecordField extends translate(Generic, locale, 'readaloud') {
export abstract class RecordField extends Generic {


	protected fieldName = 'record';

	@query('lapp-input-record') override readonly input!: HTMLInputElement;
	@query('lapp-input-record') override readonly inputOrTextarea!: HTMLInputElement;
	
	@property() src = '';

	override renderInputOrTextarea(): TemplateResult {
		return html`
		<lapp-input-record 
			@focusin=${this.handleFocusin}
      @focusout=${this.handleFocusout}
			aria-label=${this.ariaLabel || nothing}
			.required=${this.required}
			.src=${this.src}></lapp-input-record>
		
		`
	}
	[createValidator](): Validator<unknown> {
		return new RecordValidator(() => this.inputOrTextarea as unknown as InputRecord || { required: this.required, value: this.value});
	}


}
