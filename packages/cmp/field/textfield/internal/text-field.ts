import { TextField as T } from '@material/web/textfield/internal/text-field';
import { PropertyValues } from 'lit';
import { property, query } from 'lit/decorators.js';
import LocalStoragePersist from '../../../mixin/local-storage-persist-mixin.js';
import { Variant } from '../../field/internal/a11y-field-mixin';
import type { FilledField } from '../../field/internal/filled-field';
import type { OutlinedField } from '../../field/internal/outlined-field';
import NoAutoValidateMixin from '../../mixin/noAutoValidateMixin';

import { StaticValue, html as staticHtml } from 'lit/static-html.js';
import CompatMixin from '../../compat/compat-mixin';
import { GenericI } from '../../generic/generic';
/**
 * We add real class to avoid TS error
 */
class RealClass extends T {
	protected readonly fieldTag!: StaticValue
	// input: HTMLInputElement | null | undefined
	// fieldName: string | undefined
	// getInputValue:( ()=> string) | undefined
}
/**	
 * PwiTextField is an override of MD3's filled-textfield for Preignition
 * that adds a couple of additional features to the component.
 * 
 * - [x] RTL support - hopefully not needed anymore with MD3 as it should be supported out of the box
 * - [x] support for displaying native validation message - provided out of the box by MD3
 * - [ ] improved support for readonly (style and behavior) 
 * - [x] support for local storage persistence 
 * - [x] check validity on blur
 * - [x] only show supportText on focus
 * - [ ] prevent setting value when value is undefined ?
 * - [ ] possibility to listen when field icon is clicked - see https://github.com/material-components/material-components-web-components/issues/2447
 * - [ ] improved support for some aria attributes: aria-errormessage, aria-invalid role and aria-live
 */

// @ts-expect-error - TS complains about renderField and field being private in Base class
export class TextField extends
	// ConsumeFormMixin(
	NoAutoValidateMixin(
		CompatMixin(
			LocalStoragePersist(
				RealClass))) {
	/**
	 * The variant to use for rendering the field
	 */
	@property() variant!: Variant

	/**
	 * Whether the label should be displayed above the field
	 * and removes animation on focus
	 */
	@property({ type: Boolean }) labelAbove: boolean = false

	/**
	 * whether to persist supporting text 
	 * @default false
	 */
	@property({ type: Boolean }) persistSupportingText: boolean = false;

	/**
	 * The field holding label
	 */
	@query('.field') override field!: FilledField | OutlinedField;

	/**
	 * Override renderField so that we can have htmlResult label and supportingText
	 */
	protected override renderField() {
		const t = this as unknown as GenericI
		return staticHtml`<${this.fieldTag}
      class="field textfield"
      count=${this.value?.length}
      ?disabled=${this.disabled}
      ?error=${t.hasError}
			.persistSupportingText=${this.persistSupportingText}
      .errorText=${t.getErrorText()}
      ?focused=${t.focused}
      ?has-end=${this.hasTrailingIcon}
      ?has-start=${this.hasLeadingIcon}
      .label=${this.label}
      max=${this.maxLength}
      ?populated=${!!this.value}
      ?required=${this.required}
      ?resizable=${this.type === 'textarea'}
      .supportingText=${this.supportingText}
    >
      ${t.renderLeadingIcon()}
      ${t.renderInputOrTextarea()}
      ${t.renderTrailingIcon()}
      <div id="description" slot="aria-describedby"></div>
    </${this.fieldTag}>`;
	}


	/**
	 * propagate variant and labelAbove to field as they are not part of the template
	 * @param changedProperties 
	 */
	private propagateToField(changedProperties: PropertyValues) {
		if (this.field) {
			if (changedProperties.has('variant')) {
				this.field.variant = this.variant;
			}
			if (changedProperties.has('labelAbove')) {
				this.field.labelAbove = this.labelAbove;
			}
		}
	}

	override firstUpdated(changedProperties: PropertyValues) {
		this.propagateToField(changedProperties);
		super.firstUpdated(changedProperties);
	}

	override willUpdate(changedProperties: PropertyValues) {
		super.willUpdate(changedProperties);
		this.propagateToField(changedProperties);
	}


	/** overriding checkValidity to ensure errorText is displayed when we have an error */
	// override checkValidity() {
	// 	const valid = super.checkValidity();
	// 	if(this.errorText) {
	// 		if(valid) {
	// 			this.error = false;
	// 		} else {
	// 			this.error = true;
	// 		}
	// 	}
	// 	return valid;
	// }


}
