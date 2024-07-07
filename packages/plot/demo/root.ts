import { html, css, LitElement } from "lit";
import { customElement, property, state } from 'lit/decorators.js';
import '../time-series';
import data from './data/time.json';

/**
 * Root component for Plot - used for dev purposes 
 */

@customElement('demo-root')
export default class DemoRoot extends LitElement {

  static override styles = css`
      :host {}
    `;

  override render() {

    const options = {
      items: [
        { key: 'provisioningSurvey', label: 'First Visit' },
        { key: 'form.ready', label: 'Started' },
        { key: 'submitted', label: 'Submitted' }
      ]
    }

    return html`
      <lapp-plot-time-series .data=${data} .options=${options}></lapp-plot-time-series>
    `;
  }

}

declare global {
  interface HTMLElementTagNameMap {
    'demo-root': DemoRoot;
  }
}
