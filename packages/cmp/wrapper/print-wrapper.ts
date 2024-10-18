import { html, css, LitElement } from "lit";
import { customElement, property, state } from 'lit/decorators.js';
import '@material/web/button/filled-button.js';
import '@material/web/divider/divider.js';
import '@material/web/elevation/elevation.js';
/**
 *  An element used to wrap a print view
 */

@customElement('lapp-print-wrapper')
export default class lappPrintWrapper extends LitElement {

  static override styles = css`
      :host {
        display: block;
        position: relative;
        max-width: 800px;
        margin: var(--space-xx-large, 36px) auto;
        padding: var(--space-xx-large, 36px);
        --md-elevation-level: 1;
      }
      
      table {
        font-size: var(--font-size-small);
        border-spacing: 0;
      }



      tr td:first-child {
        font-weight: var(--font-weight-bold);
        text-align: right;
      }

      md-divider {
        margin: var(--space-xx-large, 36px) 0;
      }

      @media print {
        :host {
          max-width: 100%;
          margin: 0;
          padding: 0;
        }
        .no-print {
          display: none;
        }
        md-divider {
           margin: var(--space-small, 10px) 0;
        }  
      }
    `;

  /**
   * Then name of the person printing
   */
  @property() displayName!: string;

  override render() {
    const d = new Date();
    return html`
      <div style="display: flex;">
      <md-filled-button class="no-print" @click=${this.printDocument}>Print
        <lapp-icon slot="icon">print</lapp-icon>
      </md-filled-button>
      <span  style="flex: 1;"></span>
      <table>
        <tr>
          <td>Printed by:</td>
          <td>${this.displayName}</td>
        </tr>
        <tr>
          <td>On:</td>
          <td>${d.toLocaleDateString()} ${d.toLocaleTimeString()}</td>
        </tr>
      </table>
      </div>
      <md-divider></md-divider>
      <md-elevation class="no-print"></md-elevation>
      <slot></slot>
    `;
  }

  private printDocument() {
    window.print();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lapp-print-wrapper': lappPrintWrapper;
  }
}
