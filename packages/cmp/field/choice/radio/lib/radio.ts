import '../../../radio/radio';
import '../../../../list/list';
import '../../../../list/list-item';
import '@material/web/icon/icon';
import { html } from 'lit';
import { when } from 'lit/directives/when.js';
import '../../../text-field';
import { Choice } from '../../choice';
import IllustrationMixin from '../../illustrationMixin';
import SingleMixin from '../../singleMixin';
import specifyChangedEvent from '../../specifyChangedDetail';
import type {  Option } from '../../types';
import type { HTMLEvent } from '../../../../types';
import '../../list-item'


/**
 * Radio group field

 */
export abstract class Radio extends
  SingleMixin(
    IllustrationMixin(
      Choice)) {

  protected fieldName = 'radio';
  protected override readonly assertiveOnFocus = false;

  protected override renderChoiceOptions(options: Option[]) {
    if(options.length === 0) {
      return this.renderEmptyOption()
    }
    return html`
      ${options.map((option, index) => html`
        <lapp-choice-list-item
          .selector=${this.choiceInputSelector}
          data-variant="horizontal"
          .listItemRole=${'presentation'}
          .disabled=${this.disabled || !!option.disabled}
          @change=${this.onChange} 
          .headline=${option.md || option.label}
          .supportingText=${option.supportingText || ''}>
          ${this.renderOptionIllustration(option)}
          ${this.renderRadio(option, index)}
        </lapp-choice-list-item>`
    )}`
  }

  renderRadio(option: Option, index: number) {
    const isChecked = this._value == option.code
    const name = option.name || this.name
   
    return html`
    ${when(option.specify === true && isChecked, () => this.renderSpecify(option, index))}
    <lapp-radio 
      data-role="radio"
      data-variant="_icon" 
      slot="start"
      .name=${name}
      .ariaLabel=${option.label}
      .ariaDescription=${option.supportingText || ''}
      .disabled=${this.disabled || !!option.disabled}
      .readOnly=${this.readOnly}
      .ariaControls=${option.specify ? `specify${index}` : undefined}
      .value=${option.code}
      ?checked=${isChecked}
      ></lapp-radio>
    `
  }

  renderSpecify(option: Option, index: number) {
    const onInput = (e: HTMLEvent<HTMLInputElement>) => {
      const event = new specifyChangedEvent(e.target.value)
      this.dispatchEvent(event)
    }

    return html`
    <md-filled-text-field 
      style="width: 150px;"
      id="specify${index}" 
      data-role="specify"
      data-variant="specify"
      slot="end"

      label=${option.specifyLabel || this.tr('pleaseSpecify')}
      .value=${this.specify || ''}
      @input=${onInput}
      @click=${(e: HTMLEvent) => e.stopPropagation()}
      ></md-filled-text-field>
    `
  }
}

