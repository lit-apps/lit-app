import {customElement} from 'lit/decorators.js';
import {MdFab} from '@material/web/fab/fab.js';
import { Fab } from './internal/fab';
import  styles  from './internal/styles';
import  outlinedStyles  from './internal/outlined-styles';

declare global {
  interface HTMLElementTagNameMap {
    'lapp-outlined-fab': LappOutlinedFab;
  }
}

@customElement('lapp-outlined-fab')
export class LappOutlinedFab extends Fab {
  static override styles = [...MdFab.styles, styles, outlinedStyles];
}
