// import '../../../checkbox/checkbox';
import '../../../../list/list';
import '../../../../list/list-item';
import '@material/web/icon/icon';
import '@material/web/checkbox/checkbox';
import { html } from 'lit';
import { when } from 'lit/directives/when.js';
import { GenericI } from '../../../generic/generic';
import '../../../text-field';
import '../../list-item'
import { Choice } from '../../choice';
import IllustrationMixin from '../../illustrationMixin';
import MultiChoiceMixin from '../../multiMixin';
import specifyChangedEvent from '../../specifyChangedDetail';
import { nothing } from 'lit';
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
            _type="button"
            .isMulti=${true}
            .selector=${this.choiceInputSelector}
            data-variant="horizontal"
            .disabled=${this.isDisabled(option)}
            .listItemRole=${'option'}
            @change=${this.onChange} 
            >
            ${this.renderOptionIllustration(option)}
            ${this.renderCheckbox(option, index)}
            <div slot="headline">${option.md || option.label}</div>
            ${when(option.supportingText, () => html`<div slot="supportingText">${option.supportingText}</div>`)}
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
    <md-checkbox touch-target="wrapper" 
      data-role="checkbox"
      slot="start"
      .disabled=${this.isDisabled(option)}
      .ariaLabel=${option.label}
      aria-description=${option.supportingText || nothing}
      ?aria-invalid=${(this as unknown as GenericI).hasError}
      .ariaControls=${option.specify ? `specify${index}` : undefined}
      .value=${option.code}
      ?checked=${isChecked}
      ></md-checkbox>
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
      style="width: 240px;"
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


