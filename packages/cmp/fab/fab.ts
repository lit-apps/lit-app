/**
 * `LappFab` is a custom element that extends the `Fab` class.
 * It uses the `@customElement` decorator to define the custom element with the tag name `lapp-fab`.
 * 
 * This class combines styles from `MdFab` and its own internal styles.
 * 
 * @extends Fab
 * 
 * @element lapp-fab
 */
import { customElement } from 'lit/decorators.js';
import { MdFab } from '@material/web/fab/fab.js';
import { Fab } from './internal/fab';
import styles from './internal/styles';

declare global {
  interface HTMLElementTagNameMap {
    'lapp-fab': LappFab;
  }
}

@customElement('lapp-fab')
export class LappFab extends Fab {
  static override styles = [...MdFab.styles, styles];
}
