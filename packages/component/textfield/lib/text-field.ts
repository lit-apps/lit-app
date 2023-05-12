import { TextField as T } from '@material/web/textfield/lib/text-field';
import { Variant } from '../../field/lib/a11y-field-mixin';
import { property, query } from 'lit/decorators.js';
import type { FilledField } from '../../field/lib/filled-field';
import type { OutlinedField } from '../../field/lib/outlined-field';
import { PropertyValues } from 'lit';


/**
 * PwiTextField is an override of MD3's filled-textfield for Preignition
 * that adds a couple of additional features to the component.
 * 
 * - [ ] two-way binding, via @value-changed - DEPRECATED
 * - [x] RTL support - hopefully not needed anymore with MD3 as it should be supported out of the box
 * - [x] support for displaying native validation message - provided out of the box by MD3
 * - [ ] improved support for readonly (style and behavior) 
 * - [ ] check validity on blur
 * - [ ] only show supportText on focus
 * - [ ] prevent setting value when value is undefined ?
 * - [ ] possibility to listen when field icon is clicked - see https://github.com/material-components/material-components-web-components/issues/2447
 * - [ ] improved support for some aria attributes: aria-errormessage, aria-invalid role and aria-live
 */ 


export abstract class TextField extends T {
	@property() variant!: Variant
	@property() labelAbove: boolean = false

	/**
	 * The field holding label
	 */
	@query('.field') field!: FilledField | OutlinedField;

	
	/**
	 * propagate variant and labelAbove to field as they are not part of the template
	 * @param changedProperties 
	 */
	private propagateToField(changedProperties: PropertyValues) {
		if(this.field) {
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
		this.propagateToField(changedProperties);
		super.willUpdate(changedProperties);

	}
}
