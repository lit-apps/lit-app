import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { FeedbackActivateEvent } from '../event.js';
import('@material/web/button/filled-button.js');

/**
 *  Button - a button to activate feedback dialog
 */
@customElement('lapp-feedback-button')
export default class Button extends LitElement {

  static override styles = css`
  
  :host {
    --md-filled-button-container-color: var(--color-accent, var(--mdc-theme-secondary));
  }

  md-filled-button {
    z-index: var(--z-index-modal, 900);
    position: fixed;
    bottom: 37vh;
    transform: rotate(-90deg);
    right: -10px;
    transform-origin: right center;
    will-change: right ;
    transition: right var(--transition-quickly);
  }
  
  :host([show]) md-filled-button {
    right: 11px;
  }
  :host([hide]) md-filled-button {
    right: -30px;
  }
  :host(:hover) md-filled-button, md-filled-button:focus, md-filled-button:active  {
    right: 16px;
  }
    `;

  @property() position: string = 'right';
  @property() label!: string;
  @property({ type: Boolean, reflect: true }) show!: boolean;
  @property({ type: Boolean, reflect: true }) hide!: boolean;

  override render() {
    const onClick = () => {
      const activateEvent = new FeedbackActivateEvent({});
      this.dispatchEvent(activateEvent)
    }
    return html`<md-filled-button 
      icon="chat" 
      aria-live="assertive"
      @click=${onClick} 
      >${this.label}</md-filled-button>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lapp-feedback-button': Button;
  }
}
