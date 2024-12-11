import { html, css, nothing, CSSResult } from "lit";
import { customElement, property, state } from 'lit/decorators.js';
import countryContinent from './src/countryContinent.json'
import locale from './public/i18n/country/en.json';
import { assetTranslate, Strings } from '@preignition/preignition-util/translate-mixin';
import '@lit-app/cmp/field/select'
import Base from './src/base';

/**
 *  A select field to choose a country
 * 
 * It filters countries by continent if continent is set
 */
@customElement('lapp-location-country')
export default class lappLocationCountry extends assetTranslate(Base, locale as Strings, 'country') {

  static override styles: CSSResult = [
    Base.styles,
    css`
     .flag {
        height: 1em;
      }
    `] as any

  @state() override items: string[][] = countryContinent;
  @property() override label: string = 'Select a country';

  @property() continent!: string;
  @property({ type: Boolean, attribute: 'show-flag' }) showFlag: boolean = false;

  protected override renderItems(items: string[][]) {

    // TODO: sort by alphabetic order for each language.
    // for the time being it is sorted for english

    // if continent is set, filter countries by continent
    if (this.continent) {
      items = countryContinent
        .filter((item: any) => item[1] === this.continent && (!this.filter || this.filter(item[0])))
    }

    const value = this.value;

    return html`${items.map((item: any) => html`
    <md-select-option value="${item[0]}" ?selected=${value === item[0]}>
      ${this.showFlag ? html`
        <img slot="start" class="flag" src="/flags/4x3/${item[0].toLowerCase()}.svg" alt="${item[0]}"/>
      ` : nothing}
      <div slot="headline">${this.tr(item[0])}</div>
    </md-select-option>
    `)}`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lapp-location-country': lappLocationCountry;
  }
}
