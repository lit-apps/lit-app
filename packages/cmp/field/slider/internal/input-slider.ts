import ValidationMixin from '../../generic/validationMixin';
import { MdSlider }from '@material/web/slider/slider.js';
import { property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { PropertyValues, html, nothing } from 'lit';

/**
 * A Slider Component to be used within SliderField
 * 
 * It needs validation methods from ValidationMixin
 */

export abstract class InputSlider extends ValidationMixin(MdSlider) {

  @property() supportingOrErrorText!: string;

  override firstUpdated(props: PropertyValues<this>) {
		super.firstUpdated(props);
    // @ts-ignore
		this.inputStart?.setAttribute('aria-describedby', 'description');
    // @ts-ignore
		this.inputEnd.setAttribute('aria-describedby', 'description');

	}

	override render() {
    return html`
			${super.render()}
			<div id="description" hidden>${this.supportingOrErrorText}</div>
    `
		;
	}

}

