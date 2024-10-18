import { MdCheckbox } from '@material/web/checkbox/checkbox.js';
import { PropertyValues, html } from 'lit';
import { property } from 'lit/decorators.js';

/**
 * A Checkbox Component to be used within CheckboxField
 * 
 */

export abstract class InputCheckbox extends MdCheckbox {

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
    // @ts-expect-error  - we are cheating
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

