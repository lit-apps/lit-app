import { html, LitElement, PropertyValues } from "lit";
import { customElement, property } from 'lit/decorators.js';

import '../form.js';
import '@lit-app/cmp/field/text-field.js'


/**
 * A demo component 
 */

@customElement('demo-form')
export default class demoForm extends LitElement {

  @property() team!: string;
  @property() team2!: string;
  @property() team3!: string;

  override async firstUpdated(props: PropertyValues) {
    super.firstUpdated(props);

  }

  override render() {
    const onInput = (name: string) => (e: Event) => {
      const target = e.target as HTMLInputElement;
      // @ts-expect-error - we are setting a property on the instance
      this[name] = target.value;
    }
    return html`
      <a11y-form>
        <lapp-text-field name="team" label="Team" @input=${onInput('team')} .value=${this.team || ''}></lapp-text-field>
        <lapp-text-field name="team2" label="Team required" @input=${onInput('team2')} required .value=${this.team2 || ''}></lapp-text-field>
        <lapp-text-field name="team3" label="Team3 required" @input=${onInput('team3')} required .value=${this.team3 || ''}></lapp-text-field>
      </a11y-form>

    `;
  }
} 

declare global {
  interface HTMLElementTagNameMap {
    'demo-form': demoForm;
  }
}
