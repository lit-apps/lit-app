import { html, nothing } from 'lit';
import { property, query } from 'lit/decorators.js';
import { Generic, GenericI } from '../../generic/generic';
import '../input-record';

import {
	createValidator
} from '@material/web/labs/behaviors/constraint-validation.js';
import { Validator } from '@material/web/labs/behaviors/validators/validator';
import { InputRecord } from './input-record';
import { RecordValidator } from './recordValidator';



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

	override renderInputOrTextarea() {
		const t = this as unknown as GenericI
		return html`
		<lapp-input-record 
			@focusin=${t.handleFocusin}
      @focusout=${t.handleFocusout}
			aria-label=${t.ariaLabel || nothing}
			.required=${t.required}
			.src=${this.src}></lapp-input-record>
		
		`
	}
	override[createValidator](): Validator<unknown> {
		return new RecordValidator(() => this.inputOrTextarea as unknown as InputRecord || { required: this.required, value: this.value });
	}


}
