import { Copy } from './internal/copy';
import { customElement } from 'lit/decorators.js';

@customElement('lapp-copy')
export class LappCopy extends Copy {
  static override styles = [...Copy.styles];
}

declare global {
  interface HTMLElementTagNameMap {
    'lapp-copy': LappCopy;
  }
}