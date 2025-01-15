import { css } from 'lit';
import { Snackbar } from '@material/mwc-snackbar';
import { customElement } from 'lit/decorators.js';


/**
 * extention of mwc-snackbar adding some extra styling variables
 * see: https://github.com/material-components/material-web/issues/1978
 * value changes
 */

@customElement('lapp-snackbar')
export default class LappSnackbar extends Snackbar {

  static override styles = [
    ...Snackbar.styles,
    css`
      .mdc-snackbar {
        z-index: var(--z-index-toast, 8);
      }
      :host([type=warn]) {
        --mdc-snackbar-action-color: var(--color-warning);
      }
      :host([type=error]) {
        --mdc-snackbar-action-color: var(--color-warning);
      }
      `
  ];

  // @property({ reflect: true }) type: SnackType = 'info';


}

declare global {
  interface HTMLElementTagNameMap {
    'lapp-snackbar': LappSnackbar;
  }
}
