import { html, LitElement, PropertyValues } from "lit";
import { customElement, property } from 'lit/decorators.js';

import '../continent';
import '../country';
import '../continent-country';

/**
 * A demo component 
 */

@customElement('demo-location')
export default class demoLocation extends LitElement {

  @property() team!: string;

  override async firstUpdated(props: PropertyValues) {
    super.firstUpdated(props);

  }

  override render() {
    const onInput = (e: any) => {
      console.log('onInput', e.detail);
    }
    const onChange = (e: any) => {
      console.log('onChange', e.detail);
    }
    return html`
      <lapp-location-continent @change=${onChange} @input=${onInput}></lapp-location-continent>
      <lapp-location-country .continent=${'LAC'}></lapp-location-country>
      <lapp-location-continent-country></lapp-location-continent-country>

    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'demo-location': demoLocation;
  }
}
