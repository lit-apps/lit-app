import {customElement} from 'lit/decorators.js';
import {MdFab} from '@material/web/fab/fab.js';
import { Fab } from './internal/fab';
import  styles  from './internal/styles';

declare global {
  interface HTMLElementTagNameMap {
    'lapp-fab': LappFab;
  }
}

@customElement('lapp-fab')
export class LappFab extends Fab {
  static override styles = [...MdFab.styles, styles];
}
