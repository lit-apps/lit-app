import '@material/web/button/outlined-button.js';
import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import '../copy/copy.js';

@customElement('lapp-button-fetch')
export class ButtonFetch extends LitElement {
  static override styles = css`
    :host {
      display: inline-flex;
      flex-direction: row;
      flex-wrap: wrap;
      gap: var(--space-medium);
    }

  `;

  @property()
  label = 'Fetch Data';

  @property()
  url = '';

  @property({ attribute: false })
  format = (data: any) => JSON.stringify(data);

  @property({ attribute: false })
  headers = {};

  @property()
  response = '';

  @state() private loading = false;

  async handleClick() {
    try {
      this.loading = true;
      const response = await fetch(this.url, { headers: this.headers });
      const data = await response.json();
      this.loading = false;
      this.response = this.format(data);
    } catch (error) {
      this.loading = false;
      console.error('Error fetching data:', error);
      this.response = 'Error fetching data';
    }
  }

  override render() {
    return html`
      <md-outlined-button  @click=${this.handleClick}>${this.label}</md-outlined-button>
      <div>
        ${this.loading ? html`Loading...` : ''}
        ${this.response ? html`<lapp-copy class="response">${this.response}</lapp-copy>` : ''}

      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'button-fetch': ButtonFetch;
  }
}