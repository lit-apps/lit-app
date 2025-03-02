import { css } from "lit";
import { customElement } from 'lit/decorators.js';
import FieldTranslate from './src/cmp/field-translate.js';

/**
 *  
 */

@customElement('lapp-field-translate')
export default class lappFieldTranslate extends FieldTranslate {

  static override styles = css`
    :host {
      display: flex;
      flex-direction: column;
      gap: var(--space-small);
    }

    /* we need !important because of flex layout*/
    :host([hidden]) {
      display: none !important;
    }
    
    .source, .translation {
      width: 100%;
      flex: 1;
    }

    .empty {
      color: var(--color-secondary-text);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    [name='empty']::slotted(*) {
      color: var(--color-secondary-text);
    }
    `;
}

declare global {
  interface HTMLElementTagNameMap {
    'lapp-field-translate': lappFieldTranslate;
  }
}
