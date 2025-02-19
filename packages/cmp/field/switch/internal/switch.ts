import { html } from 'lit';
import { property, query } from 'lit/decorators.js';
import { Generic } from '../../generic/generic';
// import '@material/web/switch/switch.js';
import '../input-switch';

/**
 *
 * 

 */
export abstract class Switch extends Generic {

  protected fieldName = 'switch';

  @query('lapp-switch') override readonly input!: HTMLInputElement;
  @query('lapp-switch') override readonly inputOrTextarea!: HTMLInputElement;

  /**
 * Whether or not the switch is selected.
 */
  @property({ type: Boolean }) checked = false;

  /**
   * Whether or not the switch is disabled.
   */
  @property({ type: Boolean }) override disabled = false;

  /**
   * Whether or not the switch is indeterminate.
   *
   * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/switch#indeterminate_state_switches
   */
  @property({ type: Boolean }) indeterminate = false;

  /*
   * `switchlabel` label of switch
   */
  @property() switchlabel!: string

  override renderInputOrTextarea() {

    return html`
    <label>
      <lapp-switch
        touch-target="wrapper"
        .supportingOrErrorText=${this.supportingOrErrorText} 
        aria-label="${this.label} ${this.switchlabel || ''}"
        @change=${this.handleChange}
        .indeterminate=${this.indeterminate}
        .disabled=${this.disabled}
        .required=${this.required}
        .checked=${this.checked}>
      </lapp-switch>
      ${this.switchlabel || ''}
    </label>
    
		`
  }

  handleChange(e: Event) {
    const target = e.target as HTMLInputElement;
    this.checked = target.checked;
    this.indeterminate = target.indeterminate;
    this.dispatchEvent(new CustomEvent('checked-changed', { detail: { value: this.checked } }));
  }


}


