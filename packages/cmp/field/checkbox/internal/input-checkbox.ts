import ValidationMixin from '../../generic/validationMixin';
import { MdCheckbox }from '@material/web/checkbox/checkbox.js';
import { property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { PropertyValues, html, nothing } from 'lit';

/**
 * A Checkbox Component to be used within CheckboxField
 * 
 * It needs validation methods from ValidationMixin
 */

export abstract class InputCheckbox extends ValidationMixin(MdCheckbox) {

  @property() supportingOrErrorText!: string;
	@property({type: Boolean}) 
	get value() {
		return this.checked;
	}
	set value(value) {
		this.checked = value
	}

  override firstUpdated(props: PropertyValues<this>) {
		super.firstUpdated(props);
    // @ts-ignore
		this.input.setAttribute('aria-describedby', 'description');
	}

	override render() {
    return html`
			${super.render()}
			<div id="description" hidden>${this.supportingOrErrorText}</div>
    `
		;
	}

}

