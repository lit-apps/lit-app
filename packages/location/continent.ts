import { html } from "lit";
import { customElement, property, state } from 'lit/decorators.js';
import continentData from './src/continent.json'
import locale from './public/i18n/continent/en.json';
import { assetTranslate, Strings } from '@preignition/preignition-util/translate-mixin';
import '@lit-app/cmp/field/select'
import Base from './src/base';

/**
 *  A select field to choose a continent
 */
@customElement('lapp-location-continent')
export default class lappLocationContinent extends assetTranslate(Base, locale as Strings, 'continent') {

  @state() override items: string[] = continentData;
  @property() override label: string = 'Select a continent';

  protected override renderItems(items: string[]) {
    const value = this.value;
    return html`${items.map((item: any) => html`
    <md-select-option value="${item}" >
      <div slot="headline">${this.tr(item)}</div>
    </md-select-option>
    `)}`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lapp-location-continent': lappLocationContinent;
  }
}
