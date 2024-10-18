import { MdSlider }from '@material/web/slider/slider.js';
import { property, state } from 'lit/decorators.js';
import { PropertyValues, html, nothing } from 'lit';

/**
 * A Slider Component to be used within SliderField
 * 
 */

export abstract class InputSlider extends MdSlider {

  @property() supportingOrErrorText!: string;
	@property({ type: Boolean }) required = false;

  override firstUpdated(props: PropertyValues<this>) {
		super.firstUpdated(props);
    // @ts-expect-error  - we are cheating
		this.inputStart?.setAttribute('aria-describedby', 'description');
    // @ts-expect-error  - we are cheating
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

