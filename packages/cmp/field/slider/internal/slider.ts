import { LitElement, PropertyValues } from "lit";
import { property, state, query } from 'lit/decorators.js';
import { Generic } from '../../generic/generic';
import { html, nothing } from 'lit';
import type { TemplateResult } from 'lit';
// import '@material/web/slider/slider.js';
import '../input-slider'
import { redispatchEvent } from '@material/web/internal/controller/events';
import { MdSlider } from '@material/web/slider/slider';



/**
 *
 * 

 */
export abstract class Slider extends Generic {

  protected fieldName = 'slider';

  @query('lapp-slider') override readonly input!: HTMLInputElement;
  @query('lapp-slider') override readonly inputOrTextarea!: HTMLInputElement;
	
	@property({attribute: false}) 
  get value() {
    const input = this.input as unknown as MdSlider;
    if (!this.input) {
      return this._value;
    }
    return input.range ? [input.valueStart, input.valueEnd] : input.value;
		
	}
	set value(value) {
    const input = this.input as unknown as MdSlider;
    const isArray = Array.isArray(value);
    if (isArray && !this.range) {
      if (import.meta.env.DEV) {
        console.warn('You are trying to set an array value to a non-range slider. The slider will be a range slider.')
      }
      this.range = true
    } else if (!isArray && value && this.range) {
      if (import.meta.env.DEV) {
        console.warn('You are trying to set an non-array value to a range slider. The slider will be a non-range slider.')
      }
      this.range = false
    }

    this._value = value;
    if (!this.input) {
      return;
    }
    if (input.range && value) {
      input.value = value
      input.valueStart = value[0];
      input.valueEnd = value[1];
    } else {
      input.value = value;
    }
	}

  // temp holding value
  private _value 

  /**
   * Whether or not the slider is disabled.
   */
  @property({ type: Boolean }) disabled = false;


  /**
     * The slider start value displayed when range is true.
     */
  @property({ type: Number, attribute: 'value-start' }) valueStart?: number;

  /**
   * The slider end value displayed when range is true.
   */
  @property({ type: Number, attribute: 'value-end' }) valueEnd?: number;

  /**
   * An optional label for the slider's value displayed when range is
   * false; if not set, the label is the value itself.
   */
  @property({ attribute: 'value-label' }) valueLabel?: string;

  /**
   * An optional label for the slider's start value displayed when
   * range is true; if not set, the label is the valueStart itself.
   */
  @property({ attribute: 'value-label-start' }) valueLabelStart?: string;

  /**
   * An optional label for the slider's end value displayed when
   * range is true; if not set, the label is the valueEnd itself.
   */
  @property({ attribute: 'value-label-end' }) valueLabelEnd?: string;

  /**
   * Aria label for the slider's start value displayed when
   * range is true.
   */
  @property({ attribute: 'aria-label-start' }) ariaLabelStart?: string;

  /**
   * Aria label for the slider's end value displayed when
   * range is true.
   */
  @property({ attribute: 'aria-label-end' }) ariaLabelEnd?: string;

  /**
   * The step between values.
   */
  // @property({ type: Number }) step = 1;

  /**
   * Whether or not to show tick marks.
   */
  @property({ type: Boolean }) ticks = false;

  /**
   * Whether or not to show a value label when activated.
   */
  @property({ type: Boolean }) labeled = false;

  /**
   * Whether or not to show a value range. When false, the slider displays
   * a slideable handle for the value property; when true, it displays
   * slideable handles for the valueStart and valueEnd properties.
   */
  @property({ type: Boolean }) range = false;


  override renderInputOrTextarea(): TemplateResult {

    return html`
    <label>
      <lapp-slider
        .supportingOrErrorText=${this.supportingOrErrorText} 
        
        @change=${this.handleChange}
        .disabled=${this.disabled}
        .required=${this.required}
        .value=${this.value}
        .valueStart=${this.valueStart}
        .valueEnd=${this.valueEnd}
        .valueLabel=${this.valueLabel}
        .valueLabelStart=${this.valueLabelStart}
        .valueLabelEnd=${this.valueLabelEnd}
        .ariaLabelStart=${this.ariaLabelStart || this.label}
        .ariaLabelEnd=${this.ariaLabelEnd || this.label}
        .ticks=${this.ticks}
        .labeled=${this.labeled}
        .range=${this.range}
        .step=${Number(this.step || 1)}
        .min=${Number(this.min || 0)}
        .max=${Number(this.max || 100)}
        >
      </lapp-slider>
    </label>
    
		`
  }

  // we need to dispatch an input event to make sure the value is updated
  // this behavior is differend from other fields, but slider is a special case
  // as it has a default value set (50 if no range and [0, 100])
  override async firstUpdated(props: PropertyValues<this>) {
    super.firstUpdated(props);
    await (this.input as unknown as MdSlider).updateComplete;
    this.handleChange(new Event('input'))
  }


  handleChange(e: Event) {
    const event = new CustomEvent('input', {
      detail: {value: this.value},
      bubbles: true,
      composed: true
    })
    redispatchEvent(this, event)
  }


}


