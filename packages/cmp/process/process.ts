
import { customElement } from 'lit/decorators.js';

import styles from './styles';
import { Process } from './internal/process';

declare global {
  interface HTMLElementTagNameMap {
    'lapp-process': LappProcess;
  }
}

/**
 * Process 
 * 
 * An element that display a process reflecting 
 * the progress of a task.
 * @final
 */
@customElement('lapp-process')
export class LappProcess extends Process {
  static override styles = [
    styles, 
  ];
}
