
import { Variant } from "@lit-app/cmp/field/field/internal/a11y-field-mixin";
import { html, css, LitElement, nothing } from "lit";
import { customElement, property, query } from 'lit/decorators.js';
import ValueChangedEvent from '@lit-app/shared/event/value-changed';
import './continent';
import './country';
// import {
//   internals,
//   mixinElementInternals,
// } from '@material/web/labs/behaviors/element-internals.js';
// import {
// 	createValidator
// } from '@material/web/labs/behaviors/constraint-validation.js';
// import {RecordValidator} from './recordValidator';
// import { Validator } from '@material/web/labs/behaviors/validators/validator';
// import type { DistributeFunctionParamT as D} from "@lit-app/shared/types";
import type { FilterT } from "./src/base.js";

type ChangeT = {
  continent: string;
  country: string;
}

/**
 * Represents a custom element for selecting a continent and country.
 *
 * @fires value-changed<{country: string, continent: string}> - This event is fired when the continent or country selection is changed .
 */
@customElement('lapp-location-continent-country')
// export default class lappLocationContinentCountry extends mixinElementInternals(LitElement) {
export default class lappLocationContinentCountry extends LitElement {
  // static readonly formAssociated = true;

  static override styles = css`
      :host, form {
        display: contents
      }
    `;

  @property() continent!: string | undefined;
  @property() country!: string | undefined;
  @property({ type: Boolean, attribute: 'show-flag' }) showFlag: boolean = false;
  @property({attribute: 'country-label'}) countryLabel: string = 'Select a Country';
  @property({attribute: 'continent-label'}) continentLabel: string = 'Select a Continent';
  @property({attribute: 'continent-supporting-text'}) continentSupportingText!: string;
  @property({attribute: 'country-supporting-text'}) countrySupportingText!: string;
  @property({attribute: false}) continentFilter!: FilterT;

  @property({ type: Boolean }) required: boolean = false;
  @property({ type: Boolean }) disabled: boolean = false;
  @property({ type: Boolean }) hideCountry: boolean = false;
  @property({ type: Boolean, attribute: 'readonly' }) readOnly: boolean = false;
  @property({ type: Boolean, attribute: 'show-country-on-empty-continent' }) showCountryOnEmptyContinent: boolean = false;
  @property() variant!: Variant;
  @query('form') form!: HTMLFormElement;

  get value(): ChangeT {
    return { continent: this.continent || '', country: this.country || '' };
  }

  private dispatchChange() {
    this.dispatchEvent(new ValueChangedEvent<ChangeT>(this.value));
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
        .filter=${this.continentFilter}
        .label=${this.continentLabel}
        .supportingText=${this.continentSupportingText}
        .disabled=${this.disabled}
        .readOnly=${this.readOnly}
        .required=${this.required}
        .variant=${this.variant}
        .value=${this.continent ||''}
        @input=${onContinentInput}></lapp-location-continent>
      ${(this.continent || this.showCountryOnEmptyContinent) && !this.hideCountry? html`
        <lapp-location-country 
          class="field" 
          .label=${this.countryLabel}
          .supportingText=${this.countrySupportingText}
          .showFlag=${this.showFlag} 
          .disabled=${this.disabled}
          .readOnly=${this.readOnly}
          .required=${this.required}
          .variant=${this.variant}
          .continent=${this.continent || ''} 
          .value=${this.country ||''}
          @input=${onCountryInput}></lapp-location-country>
      ` : nothing}
    `;
  }
  get validity() {
    return this.form?.checkValidity();
  }
  // [createValidator](): Validator<unknown> {
	// 	return this.form.internals?.validator;
  //   //  new RecordValidator(() => this.inputOrTextarea as unknown as InputRecord || { required: this.required, value: this.value});
	// }

}

declare global {
  interface HTMLElementTagNameMap {
    'lapp-location-continent-country': lappLocationContinentCountry;
  }
}
