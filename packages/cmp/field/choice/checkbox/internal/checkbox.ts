import '../../../checkbox/checkbox';
import '../../../../list/list';
import '../../../../list/list-item';
import '@material/web/icon/icon';
import { html } from 'lit';
import { when } from 'lit/directives/when.js';
import { GenericI } from '../../../generic/generic';
import '../../../text-field';
import '../../list-item'
import { Choice } from '../../choice';
import IllustrationMixin from '../../illustrationMixin';
import MultiChoiceMixin from '../../multiMixin';
import specifyChangedEvent from '../../specifyChangedDetail';
import type { Option } from '../../types';
import type { HTMLEvent } from '../../../../types';

/**
 * Checkbox field 
 */
 export abstract class Checkbox extends 
  MultiChoiceMixin(
    IllustrationMixin(
      Choice)) {
  
  protected fieldName = 'checkbox';
  
  protected override renderChoiceOptions(options: Option[]) {
    if(options.length === 0) {
      return this.renderEmptyOption()
    }
    return html `
        ${options.map((option, index) => html`
         <lapp-choice-list-item
            .isMulti=${true}
            .selector=${this.choiceInputSelector}
            data-variant="horizontal"
            .disabled=${this.isDisabled(option)}
            .listItemRole=${'option'}
            @change=${this.onChange} 
            .headline=${option.md || option.label}
            .supportingText=${option.supportingText || ''}>
            ${this.renderOptionIllustration(option)}
            ${this.renderCheckbox(option, index)}
          </lapp-choice-list-item>
        `
        )}
    `
  }
 
  protected isDisabled(option: Option) {
    return this.exclusiveIsSelected && !Checkbox.isCodeSelected(this._value, option.code)
  }

  renderCheckbox(option: Option, index: number) {
    const isChecked = Checkbox.isCodeSelected(this._value, option.code)
    return html`
    ${when(option.specify === true && isChecked, () => this.renderSpecify(option, index))}
    <lapp-checkbox 
      data-role="checkbox"
      data-variant="_icon" 
      slot="start"
      .disabled=${this.isDisabled(option)}
      .ariaLabel=${option.label}
      .ariaDescription=${option.supportingText || ''}
      ?aria-invalid=${(this as unknown as GenericI).hasError}
      .ariaControls=${option.specify ? `specify${index}` : undefined}
      .value=${option.code}
      ?checked=${isChecked}
      ></lapp-checkbox>
    `
  }

  renderSpecify(option: Option, index: number) {
    const code = option.code || index + ''
    const onInput = (e: HTMLEvent<HTMLInputElement>) => {
      if(!this.specify) {
        this.specify = {}
      }
      {this.specify[code] = e.target.value}
      const event = new specifyChangedEvent({...this.specify})
      this.dispatchEvent(event)
    }

    return html`
    <md-filled-text-field 
      style="width: 180px;"
      id="specify${index}" 
      data-role="specify"
      data-variant="specify"
      slot="end"
      .label=${option.specifyLabel || this.tr('pleaseSpecify')}
      .value=${this.specify?.[code] || ''}
      @input=${onInput}
      @click=${(e: HTMLEvent) => e.stopPropagation()}
      ></md-filled-text-field>
    `

  }
}


