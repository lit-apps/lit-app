import { DialogDownload } from './internal/dialog-download';
import { customElement } from 'lit/decorators.js';

@customElement('lapp-dialog-download')
export class LappDialogDownload extends DialogDownload {
  static override styles = DialogDownload.styles;
}

declare global {
  interface HTMLElementTagNameMap {
    'lapp-dialog-download': LappDialogDownload;
  }
}