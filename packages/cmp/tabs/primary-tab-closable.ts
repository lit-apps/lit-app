import {customElement} from 'lit/decorators.js';
import Closable from './internal/closable-tab-mixin.js';
import {MdPrimaryTab} from '@material/web/tabs/primary-tab.js';
import { styles } from './internal/styles';

declare global {
  interface HTMLElementTagNameMap {
    'lapp-primary-tab-closable': LappClosableTab;
  }
}

@customElement('lapp-primary-tab-closable')
export class LappClosableTab extends Closable(MdPrimaryTab) {
  static override styles = [...MdPrimaryTab.styles, styles];
}
