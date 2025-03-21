import { html } from 'lit';
import { property, query } from 'lit/decorators.js';
import { Generic } from '../../generic/generic';
// import '@material/web/switch/switch.js';
import { HTMLEvent } from '@lit-app/shared/types.js';
import { MdSwitch } from '@material/web/switch/switch.js';
import '../input-switch';

/**
 *
 * 

 */
export abstract class Switch extends Generic {

  protected fieldName = 'switch';

  @query('lapp-switch') override readonly input!: HTMLInputElement;
  @query('lapp-switch') override readonly inputOrTextarea!: HTMLInputElement;

  @property({ type: Boolean }) selected = false;

  /**
   * Whether or not the switch is disabled.
   */
  @property({ type: Boolean }) override disabled = false;

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
        .disabled=${this.disabled}
        .required=${this.required}
        .selected=${this.selected}>
      </lapp-switch>
      ${this.switchlabel || ''}
    </label>
    
		`
  }

  async handleChange(e: HTMLEvent<MdSwitch>) {
    const target = e.target;
    await this.updateComplete;
    this.selected = target.selected;
  }


}


