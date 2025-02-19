import { MdSwitch } from '@material/web/switch/switch.js';
import { PropertyValues, html } from 'lit';
import { property } from 'lit/decorators.js';

/**
 * A Switch Component to be used within SwitchField
 * 
 */

export abstract class InputSwitch extends MdSwitch {

	@property() supportingOrErrorText!: string;
	@property({ type: Boolean })
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

