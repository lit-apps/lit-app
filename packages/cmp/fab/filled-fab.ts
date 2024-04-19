import {customElement} from 'lit/decorators.js';
import {MdFab} from '@material/web/fab/fab.js';
import { Fab } from './internal/fab';
import  styles  from './internal/styles';
import  filledStyles  from './internal/filled-styles';

declare global {
  interface HTMLElementTagNameMap {
    'lapp-filled-fab': LappFilledFab;
  }
}

@customElement('lapp-filled-fab')
export class LappFilledFab extends Fab {
  static override styles = [...MdFab.styles, styles, filledStyles];
}
