import { html, LitElement, nothing } from "lit";
import { customElement, property, state } from 'lit/decorators.js';

/**
 *  
 */

@customElement('field-translate')
export default class fieldTranslate extends LitElement {

  /*
    * `translated` the translated value
    */
  @state() translated!: string
  @property() value!: string

  /*
   * `label`
   */
  @property() label!: string
  @property() helper!: string
  @property({ type: Boolean }) charCounter!: boolean
  @property({ type: Number }) maxLength!: number

  /*
   * `translation` language
   */
  @property() translation!: string
  @property() translatedPlaceholder!: string


  @property({ type: Boolean }) hideEmpty!: boolean  // when true, do not show the empty warning
  @property({ type: Boolean }) disabled!: boolean
  @property({ type: Boolean }) readOnly!: boolean
  @property({ type: Boolean }) required!: boolean
  @property({ type: Boolean }) autoValidate!: boolean
  @property() pattern!: string
  @property() type: 'textarea' | 'text' = 'text'


  @property() sourceIcon: string = 'language'
  @property() targetIcon: string = 'translate'
  @property() targetHelper: string = 'translation for this field'
  @property() placeholder: string = 'this field does not hav a value'

  override render() {
    return html`
     <lapp-text-field
        class="source"
        .type=${this.type}
        .icon=${this.sourceIcon}
        .placeholder=${this.placeholder}
        readonly
        .label=${this.label}
        .value=${this.value || ''}
        ?disabled=${this.disabled}
      >
      <slot slot="leading-icon" name="source-icon">
        ${this.sourceIcon && this.type === 'text' ?
        html`<lapp-icon .icon=${this.sourceIcon}></lapp-icon>` :
        nothing}
      </slot>
      </lapp-text-field>
      <lapp-text-field 
        class="translation" 
        .type=${this.type}
        .value=${this.translated || ''}
        @input=${this.onInput}
        .supportingText=${this.targetHelper}
        .autoValidate=${this.autoValidate}
        .readOnly=${this.readOnly}
        .pattern=${this.pattern}
        .required=${this.required}
        ?disabled=${this.disabled}
        .placeholder=${this.translatedPlaceholder || ''}
        .maxLength=${this.maxLength}
        >
        <slot slot="leading-icon" name="target-icon">
          ${this.targetIcon && this.type === 'text' ?
        html`<lapp-icon .icon=${this.targetIcon}></lapp-icon>` :
        nothing}
        </slot>
      </lapp-text-field>`;
  }

  protected onInput(e: Event) {
    const value = (e.target as HTMLInputElement).value;
    this.translated = value
    this.dispatchEvent(new CustomEvent('translated-changed', { detail: { value: value } }));
  }


}

declare global {
  interface HTMLElementTagNameMap {
    'field-translate': fieldTranslate;
  }
}
