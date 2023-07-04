import '../../../radio/radio';
import '../../../../list/list';
import '../../../../list/list-item';
import '@material/web/icon/icon';
import '@material/web/focus/focus-ring';
import getInnerText from '@preignition/preignition-util/src/getInnerText';
import { html } from 'lit';
import { when } from 'lit/directives/when.js';
import '../../../text-field';
import { Choice } from '../../choice';
// import { Checkbox } from './checkbox/lib/checkbox';
import IllustrationMixin from '../../illustrationMixin';
import SingleMixin from '../../singleMixin';
import specifyChangedEvent from '../../specifyChangedDetail';
import { Option } from '../../types';
import { HTMLEvent } from '../../../../types';
import '../../list-item'
import { property } from 'lit/decorators.js';

const starTemplate = html`<svg viewBox="0 0 512 512"><path d="M512 198.525l-176.89-25.704-79.11-160.291-79.108 160.291-176.892 25.704 128 124.769-30.216 176.176 158.216-83.179 158.216 83.179-30.217-176.176 128.001-124.769z"></path></svg>`
const zeroStarTemplate = html`<svg viewBox="0 0 512 512">
    <g stroke-width="80" stroke-linecap="square">
      <path d="M91.5 442.5l317.866-317.866M90.986 124.986l318.198 318.198"/>
    </svg>`

/**
 * Star group field
 */
export abstract class Star extends
  SingleMixin(
    IllustrationMixin(
      Choice)) {

  protected fieldName = 'star';
  protected override readonly assertiveOnFocus = false;

  /**
   * The number of stars to display
   */
  @property({type: Number}) starNumber = 5
  /**
   * when true, add a star with value 0
   */
  @property({type: Boolean}) allowNoStar = false

  

  // @ts-ignore
	override get items() {
		return  [...this._queryItems('input') as NodeListOf<HTMLInputElement>]
	}

  override get _selectedItems() {
		return this.items
      .filter((item) => item.checked) 
	}

  protected override renderChoiceOptions(_options: Option[]) {
    const array = [...Array(this.starNumber * 1)].map((_, i) => i + 1)
    if(this.allowNoStar) {
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
            <span class="sr-only">${st} ${st <2 ? this.tr('star') : this.tr('stars')}</span>
            ${st === 0 ? zeroStarTemplate :  starTemplate}
          </label>
          `
      })}
    ${this.renderOutput()}
    `
  }
  handleClick(e: HTMLEvent) {
    const input= e.currentTarget.parentElement?.querySelector('input')
		if (input && input !== e.target) {
			e.stopPropagation()
			input.checked = true
			input.dispatchEvent(new Event('change', {bubbles: true}))
		}
	}

  renderOutput() {
    return html`<output>${this._selectedItems[0]?.nextElementSibling?.textContent}</output>`;
  }

  override getReadAloud(readHelper: boolean) {
    const min = this.allowNoStar ? 0 : 1;
    const max = this.starNumber;

    return this._value === undefined ?
      (getInnerText(this.label) + (readHelper && this.supportingText ? ('. ' + this.getTranslate('hint') + ': ' + this.supportingText) + '. ' : '') + this.getTranslate('giveRate', { min: min, max: max })) :
      (this.getTranslate('givenRate', { count: this._value, max: max }) + getInnerText(this.label));
  }

}

