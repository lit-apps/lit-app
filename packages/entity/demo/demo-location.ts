import { html, LitElement, PropertyValues } from "lit";
import { customElement, property } from 'lit/decorators.js';


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
    return html`
      DEMO2

    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'demo-location': demoLocation;
  }
}
