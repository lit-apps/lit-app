import {customElement} from 'lit/decorators.js';
import Closable from './internal/closable-tab-mixin.js';
import {MdSecondaryTab} from '@material/web/tabs/secondary-tab.js';
import { styles } from './internal/styles';

declare global {
  interface HTMLElementTagNameMap {
    'lapp-secondary-tab-closable': LappClosableTab;
  }
}

@customElement('lapp-secondary-tab-closable')
export class LappClosableTab extends Closable(MdSecondaryTab) {
  static override styles = [...MdSecondaryTab.styles, styles];
}
