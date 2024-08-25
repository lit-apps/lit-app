import { Variant } from "@lit-app/cmp/field/field/internal/a11y-field-mixin";
import { html, css, LitElement, nothing } from "lit";
import { customElement, property } from 'lit/decorators.js';
import ValueChangedEvent from '@lit-app/event/value-changed';
import './continent';
import './country';

type ChangeT = {
  continent: string | undefined;
  country: string | undefined;
}
/**
 *  
 */

@customElement('lapp-location-continent-country')
export default class lappLocationContinentCountry extends LitElement {

  static override styles = css`
      :host {
        display: contents
      }
    `;

  @property() continent!: string;
  @property() country!: string;
  @property({ type: Boolean, attribute: 'show-flag' }) showFlag: boolean = false;
  @property({attribute: 'country-label'}) countryLabel: string = 'Select a Country';
  @property({attribute: 'continent-label'}) continentLabel: string = 'Select a Continent';
  @property({attribute: 'continent-supporting-text'}) continentSupportingText!: string;
  @property({attribute: 'country-supporting-text'}) countrySupportingText!: string;
  @property({ type: Boolean }) required: boolean = false;
  @property({ type: Boolean }) disabled: boolean = false;
  @property({ type: Boolean }) readonly: boolean = false;
  @property() variant!: Variant;

  private dispatchChange() {
    this.dispatchEvent(new ValueChangedEvent<ChangeT>({ continent: this.continent, country: this.country }));
  }

  override render() {
    const onContinentInput = (e: any) => {
      this.continent = e.target.value;
      this.country = '';
      this.dispatchChange();
    }
    const onCountryInput = (e: any) => {
      this.country = e.target.value;
      this.dispatchChange();
    }
    return html`
      <lapp-location-continent 
        class="field" 
        .label=${this.continentLabel}
        .supportingText=${this.continentSupportingText}
        .disabled=${this.disabled}
        .required=${this.required}
        .variant=${this.variant}
        .value=${this.continent ||''}
        @input=${onContinentInput}></lapp-location-continent>
      ${this.continent ? html`
        <lapp-location-country 
          class="field" 
          .label=${this.countryLabel}
          .supportingText=${this.countrySupportingText}
          .showFlag=${this.showFlag} 
          .disabled=${this.disabled}
          .required=${this.required}
          .variant=${this.variant}
          .continent=${this.continent} 
          .value=${this.country ||''}
          @input=${onCountryInput}></lapp-location-country>
      ` : nothing}
    `;
  }

}

declare global {
  interface HTMLElementTagNameMap {
    'lapp-location-continent-country': lappLocationContinentCountry;
  }
}
