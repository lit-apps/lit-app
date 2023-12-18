import '../../../radio/radio';
import '../../../../list/list';
import '../../../../list/list-item';
import '@material/web/icon/icon';
import '@material/web/focus/md-focus-ring';
import getInnerText from '@preignition/preignition-util/src/getInnerText';
import { html } from 'lit';
import { when } from 'lit/directives/when.js';
import '../../../text-field';
import { Choice } from '../../choice';
import IllustrationMixin from '../../illustrationMixin';
import SingleMixin from '../../singleMixin';
import { Option } from '../../types';
import { HTMLEvent } from '../../../../types';
import '../../list-item'
import { property } from 'lit/decorators.js';
import { MdList } from '@material/web/list/list';

const starTemplate = html`<svg viewBox="0 0 512 512"><path d="M512 198.525l-176.89-25.704-79.11-160.291-79.108 160.291-176.892 25.704 128 124.769-30.216 176.176 158.216-83.179 158.216 83.179-30.217-176.176 128.001-124.769z"></path></svg>`
const zeroStarTemplate = html`<svg viewBox="0 0 512 512">
    <g stroke-width="80" stroke-linecap="square">
      <path d="M91.5 442.5l317.866-317.866M90.986 124.986l318.198 318.198"/>
    </svg>`

const ACTIONABLE_KEYS = {
  ArrowLeft: 'ArrowLeft',
  ArrowRight: 'ArrowRight',
  ArrowUp: 'ArrowUp',
  ArrowDown: 'ArrowDown',
} as const;

type ActionableValues = typeof ACTIONABLE_KEYS[keyof typeof ACTIONABLE_KEYS];
const actionableKeySet = new Set(Object.values(ACTIONABLE_KEYS));

function isActionableKey(key: string): key is ActionableValues {
  return actionableKeySet.has(key as ActionableValues);
}
/**
 * Star group field
 */
export abstract class Star extends
  SingleMixin(
    IllustrationMixin(
      Choice)) {

  protected fieldName = 'star';

  /**
   * The number of stars to display
   */
  @property({ type: Number }) starNumber = 5
  /**
   * when true, add a star with value 0
   */
  @property({ type: Boolean }) allowNoStar = false



  // @ts-ignore
  override get items() {
    return [...this._queryItems('input[type=radio]') as NodeListOf<HTMLInputElement>]
  }

  override get _selectedItems() {
    return this.items
      .filter((item) => item.checked)
  }

  protected override renderChoiceOptions(_options: Option[]) {
    const array = [...Array(this.starNumber * 1)].map((_, i) => i + 1)
    if (this.allowNoStar) {
      array.unshift(0)
    }
    return html`
      ${array.map((st, _index) => {
      return html`<input value="${st}" id="star${st}"
          tabindex="0"
          data-role="radio"
          @change=${this.onChange} 
          @click=${(e: Event) => e.stopPropagation()}
          ?highlight=${st < Number(this._value) * 1}
          ?disabled=${this.disabled}
          ?readonly=${this.readOnly}
          ?checked=${st + '' === this._value}
          type="radio" name="${this.name}" class="sr-only"></input>
          <label 
            for="star${st}"
            @click=${this.handleClick}
            >
            <span class="sr-only">${st} ${st < 2 ? this.tr('star') : this.tr('stars')}</span>
            ${st === 0 ? zeroStarTemplate : starTemplate}
          </label>
          `
    })}
    ${this.renderOutput()}
    `
  }

  handleClick(e: HTMLEvent) {
    const input = e.currentTarget.parentElement?.querySelector('input')
    if (input && input !== e.target) {
      e.stopPropagation()
      input.checked = true
      input.dispatchEvent(new Event('change', { bubbles: true }))
    }
  }
  protected handleKeydown(event: KeyboardEvent) {
    const key = event.key;
    if (isActionableKey(key)) {
      event.preventDefault();
      event.stopImmediatePropagation();
      const items = this.items;

      if (!items.length) {
        return;
      }
      switch (key) {
        // Activate the next item
        case ACTIONABLE_KEYS.ArrowDown:
        case ACTIONABLE_KEYS.ArrowRight:
          // @ts-ignore
          const next = MdList.getNextItem<HTMLInputElement>(items, this._value || 0)
          if(next) {
            next.checked = true
            next.dispatchEvent(new Event('change', { bubbles: true }))
          }
          break;
        // Activate the previous item
        case ACTIONABLE_KEYS.ArrowUp:
        case ACTIONABLE_KEYS.ArrowLeft:
          // @ts-ignore
          const prev = MdList.getPrevItem<HTMLInputElement>(items, (this._value ?? 1) - 1)
          if(prev) {
            prev.checked = true
            prev.dispatchEvent(new Event('change', { bubbles: true }))
          }
          break;
      }

    }
  }

  renderOutput() {
    return html`<output>${this._selectedItems[0]?.nextElementSibling?.textContent?.trim()}</output>`;
  }

  override getReadAloud(readHelper: boolean) {
    const min = this.allowNoStar ? 0 : 1;
    const max = this.starNumber;

    return this._value === undefined ?
      (getInnerText(this.label) + (readHelper && this.supportingText ? ('. ' + this.getTranslate('hint') + ': ' + this.supportingText) + '. ' : '') + this.getTranslate('giveRate', { min: min, max: max })) :
      (this.getTranslate('givenRate', { count: this._value, max: max }) + getInnerText(this.label));
  }

}

