import { html } from 'lit';
import { property, query } from 'lit/decorators.js';
import { Generic } from '../../generic/generic';
// import '@material/web/switch/switch.js';
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
   * `switchLabel` label of switch
   */
  @property() switchLabel!: string

  override renderInputOrTextarea() {

    return html`
    <label>
      <lapp-switch
        touch-target="wrapper"
        .supportingOrErrorText=${this.supportingOrErrorText} 
        aria-label="${this.label} ${this.switchLabel || ''}"
        @input=${this.handleSwitchInput}
        .disabled=${this.disabled}
        .required=${this.required}
        .selected=${this.selected}>
      </lapp-switch>
      ${this.switchLabel || ''}
    </label>
    
		`
  }


  private handleSwitchInput(e: InputEvent) {
    // this.dirty = true;
    const target = e.target as MdSwitch;
    // await this.updateComplete;
    this.selected = target.selected;
  }


}


