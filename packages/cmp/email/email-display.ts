import { parse } from '@lit-app/shared/md/index.js';
import md from '@lit-app/shared/styles/md.js';
import { css, html, LitElement } from "lit";
import { customElement, property } from 'lit/decorators.js';


/**
 * lapp-email-display is an element to view composed email.
 * 
 */
@customElement('lapp-email-display')
export default class pwiEmailDisplay extends LitElement {

  static override styles = [...md, css`
    :host {
      display: flex;
      flex-direction: column;
      flex: 1;
      height: 100%;
    }

    .body {
      flex: 1;
      margin-top: var(--space-medium);
    }
    .head {
      margin-bottom: var(--space-xx-small);
    }
    .label {
      min-width: 70px;
      display: inline-flex;
      font-weight: var(--font-weight-thin);
    }
    #subject {
      font-weight: var(--font-weight-semi-bold);
    } 

  `];

  // email address of the recipient*/
  @property() to!: string;
  // email address of the cc recipient*/
  @property() cc!: string;
  // email address of the bcc recipient*/
  @property() bcc!: string;
  // email subject*/
  @property() subject!: string;
  //  text email in markdown*/
  @property() md!: string;
  // email body*/
  @property() text!: string;

  override render() {
    return html`
    <div class="head" id="subject"><i class="label">Subject: </i>${this.subject || ''}</div>
    <div class="head" id="to"><i class="label">to: </i>${this.to || ''}</div>
    ${this.cc ? html`
      <div class="head" id="cc"><i class="label">cc: </i>${this.cc || ''}</div>
    `: ''}
    ${this.bcc ? html`
      <div class="head" id="bcc"><i class="label">bcc: </i>${this.bcc || ''}</div>
    `: ''}
    <div class="body">
      ${this.md ? parse(this.md) : this.text}
    </div>
   `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lapp-email-display': pwiEmailDisplay;
  }
}

