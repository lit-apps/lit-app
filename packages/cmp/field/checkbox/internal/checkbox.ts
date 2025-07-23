import { html } from 'lit';
import { property, query } from 'lit/decorators.js';
import { Generic } from '../../generic/generic';
// import '@material/web/checkbox/checkbox.js';
import '../input-checkbox';

/**
 *
 * 

 */
export abstract class Checkbox extends Generic {

  protected fieldName = 'checkbox';

  @query('lapp-checkbox') override readonly input!: HTMLInputElement;
  @query('lapp-checkbox') override readonly inputOrTextarea!: HTMLInputElement;

  /**
 * Whether or not the checkbox is selected.
 */
  @property({ type: Boolean }) checked = false;

  /**
   * Whether or not the checkbox is disabled.
   */
  @property({ type: Boolean }) override disabled = false;

  /**
   * Whether or not the checkbox is indeterminate.
   *
   * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox#indeterminate_state_checkboxes
   */
  @property({ type: Boolean }) indeterminate = false;

  /*
   * `checkboxlabel` label of checkbox
   */
  @property() checkboxlabel!: string

  override renderInputOrTextarea() {

    return html`
    <label>
      <lapp-checkbox
        touch-target="wrapper"
        .supportingOrErrorText=${this.supportingOrErrorText} 
        aria-label="${this.label} ${this.checkboxlabel || ''}"
        @input=${this.handleCheckedInput}
        .indeterminate=${this.indeterminate}
        .disabled=${this.disabled}
        .required=${this.required}
        .checked=${this.checked}>
      </lapp-checkbox>
      ${this.checkboxlabel || ''}
    </label>
    
		`
  }

  handleCheckedInput(e: Event) {
    const target = e.target as HTMLInputElement;
    this.checked = target.checked;
    this.indeterminate = target.indeterminate;
    // we need to keep the `checked-changed` event for compatibility
    // with the legacy version
    this.dispatchEvent(new CustomEvent('checked-changed', { detail: { value: this.checked } }));
  }


}


