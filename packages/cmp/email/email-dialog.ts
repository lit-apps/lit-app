import '@lit-app/cmp/field/md-editor';
import { css, html, LitElement } from "lit";
import { customElement, property, state } from 'lit/decorators.js';
import { emailRenderer } from './emailRenderer.js';
import type { EmailDialogT, EmailT } from './types';
import('@material/web/button/filled-button.js');
import('@material/web/button/outlined-button.js');
import('@material/web/dialog/dialog.js');
import('@lit-app/cmp/field/text-field')
export type { EmailDialogT, EmailT } from './types';

/**
 * pwi-email is an element to compose email.
 * 
 */
@customElement('lapp-email-dialog')
export class LappEmailDialog extends LitElement {

  static override styles = css`
    :host {
      --lapp-email-dialog-width: min(1000px, 80vw);
      min-width: var(--lapp-email-dialog-width);
      max-width: var(--lapp-email-dialog-width);
    }

    md-dialog {
      min-width: var(--lapp-email-dialog-width);
    }

    .layout {
      display:flex;
      flex-direction: column;
      gap: var(--space-small);
    }
    .actions {
      align-self: center;
      flex: 1; 
      margin-right: 50px;
    }
    
    .flex {
      flex: 1;
    }
    ::slotted([slot="actions"]) {
      font-size: 0.875rem;
    }
  `;

  /* label of the send button */
  @property() sendLabel: string = 'Send';
  /* heading of the dialog */
  @property() heading: string = 'Email';
  /* email replyTo field */
  @property() replyTo!: string;
  /* the helper text for the to field */
  @property() toHelper!: string;
  /* email address of the recipient */
  @property() to!: string;
  /* email address of the cc recipient */
  @property() cc!: string;
  /* email address of the bcc recipient */
  @property() bcc!: string;
  /* email subject */
  @property() subject!: string;
  /* email body */
  @property() text!: string;
  /* hide recipient address (e.g. when delegated to the app). When true, `send` button is active even when no to field */
  @property({ type: Boolean }) hideTo!: boolean;
  /* hide cc field */
  @property({ type: Boolean }) hideCC!: boolean;
  /* prevent closing the window on clicking send */
  @property({ type: Boolean }) preventClose!: boolean;
  /* whether the dialog is open  */
  @state() open: boolean = false;

  override render() {
    if (!this.open) { return '' }
    const onClose = () => {
      this._clearContent()
      this.close()
    };

    const send = () => {
      this.dispatchEvent(new CustomEvent<EmailT>('send', {
        detail: {
          to: this.to || null,
          replyTo: this.replyTo || null,
          cc: this.cc || null,
          subject: this.subject || null,
          text: this.text || null,
        }, composed: true
      }));
      if (!this.preventClose) {
        this.close()
      }
    }

    return html`
      <md-dialog open @close=${onClose}>
        <div slot="headline">${this.heading}</div>
        <form id="form-email" method="dialog" slot="content" novalidate="">
          <slot></slot>
          ${this.renderContent()}
          <slot name="footer"></slot>
        </form>
        <div slot="actions">
          <div class="actions">
            <slot name="actions"></slot>
          </div> 
          <md-outlined-button 
            form="form-email"
            value="close">Cancel</md-outlined-button>
          <md-filled-button 
            @click=${send}
            .disabled=${!this.text || !this.subject || (!this.to && !this.hideTo)} 
            value="ok"><lapp-icon slot="icon">send</lapp-icon>${this.sendLabel}</md-filled-button>
        </div>
      </md-dialog>`;
  }

  renderContent() {
    return html`
     <div class="layout" >
        ${emailRenderer.bind(this)()}
      </div>
    `
  }

  _clearContent() {
    this.cc = this.to = this.text = this.subject = '';
  }

  applyConfig(config: EmailDialogT) {
    this.heading = config.heading ?? this.heading
    this.to = config.to ?? this.to
    this.replyTo = config.replyTo ?? this.replyTo
    this.cc = config.cc ?? this.cc
    this.subject = config.subject ?? this.subject
    this.text = config.text ?? this.text
  }

  show(config?: EmailDialogT) {
    if (config) {  // if config is passed, use it
      this.applyConfig(config)
    }
    this.open = true;
  }
  close() {
    this.open = false
  }

}

declare global {
  interface HTMLElementTagNameMap {
    'lapp-email-dialog': LappEmailDialog;
  }
}
