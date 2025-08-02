import { HTMLEvent } from '@lit-app/shared/types';
import '@material/web/icon/icon';
import { html, nothing } from 'lit';
import { when } from 'lit/directives/when.js';
import '../../../../list/list';
import '../../../../list/list-item';
import '../../../radio/radio';
import '../../../text-field';
import { Choice } from '../../choice';
import IllustrationMixin from '../../illustrationMixin';
import '../../list-item';
import SingleMixin from '../../singleMixin';
import specifyChangedEvent from '../../specifyChangedDetail';
import { isOptionMdT, type Option } from '../../types';

/**
 * Radio group field

 */
export abstract class Radio extends
  SingleMixin(
    IllustrationMixin(
      Choice)) {

  protected fieldName = 'radio';

  protected override renderChoiceOptions(options: Option[]) {
    if (options.length === 0) {
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
          >
          ${this.renderOptionIllustration(option)}
          ${this.renderRadio(option, index)}
          <div slot="headline">${isOptionMdT(option) ? option.md : option.label}</div>
          ${when(option.supportingText, () => html`<div slot="supportingText">${option.supportingText}</div>`)}
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
      slot="start"
      .name=${name}
      .ariaLabel=${option.innerTextLabel}
      aria-description=${option.supportingText || nothing}
      .disabled=${this.readOnly || this.disabled || !!option.disabled}
      .readOnly=${this.readOnly}
      .ariaControls=${option.specify ? `specify${index}` : undefined}
      .value=${option.code}
      ?checked=${isChecked}
      ></lapp-radio>
    `
  }

  renderSpecify(option: Option, index: number) {
    const onInput = (e: HTMLEvent<HTMLInputElement>) => {
      e.stopPropagation();
      const event = new specifyChangedEvent(e.target.value)
      this.dispatchEvent(event)
    }

    return html`
    <md-filled-text-field 
      style="min-width: 150px; flex: 1;"
      id="specify${index}" 
      data-role="specify"
      data-variant="specify"
      slot="end"
      label=${option.specifyLabel || this.tr('pleaseSpecify')}
      .value=${this.specify || ''}
      @input=${onInput}
      @keydown=${(e: HTMLEvent) => e.stopPropagation()}
      @click=${(e: HTMLEvent) => e.stopPropagation()}
      ></md-filled-text-field>
    `
  }
}

