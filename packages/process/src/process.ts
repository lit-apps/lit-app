import type { DocumentReference } from 'firebase/firestore';
import { nothing } from 'lit';
import { StateController } from '@lit-app/state'
import { customElement, property } from 'lit/decorators.js';
import { LitElement, html, css } from 'lit';
import { ProcessState, ProcessData } from './processState.js';
import { watch } from "@lit-app/shared/decorator";
import { choose } from 'lit/directives/choose.js';


/**
 * This event is fired to trigger the main application hoist an element
 */
export class ProcessCompletedEvent extends CustomEvent<ProcessState> {
  static readonly eventName = 'process-completed';
  constructor(detail: ProcessState) {
    super(ProcessCompletedEvent.eventName, {
      // bubbles: true,
      composed: true,
      detail: detail
    });
  }
}


declare global {
  interface HTMLElementTagNameMap {
    'lapp-process': LappProcess;
  }
  interface HTMLElementEventMap {
    'process-completed': ProcessCompletedEvent,
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
export class LappProcess extends LitElement {
  static override styles = [
    css`
      :host {
        display: block;
        position: relative;
        width: 100%;
        overflow: hidden;
      }
    .error {
      color: var(--color-error);
    }

    .success {
      color: var(--color-success, var(--color-primary));
    }

    `
  ];

  @property({ attribute: false })
  process!: ProcessState | undefined;

  @property({ attribute: false })
  ref!: DocumentReference<ProcessData>;

  private _boundStateController?: StateController<ProcessState>;

  @watch('process')
  async processChanged(process: ProcessState, old: ProcessState) {
    if (!process) return;
    if (old && this._boundStateController) {
      this._boundStateController.dispose();
    };
    this._boundStateController = new StateController(this, process);
    await process.processCompleted;
    this.dispatchEvent(new ProcessCompletedEvent(process));
    this.process = undefined
  }

  @watch('ref')
  refChanged(ref: DocumentReference<ProcessData>) {
    if (!ref || this.process) return;
    this.process = new ProcessState(ref);
  }

  override render() {
    if (!this.process) return nothing
    const { progress, message, error, status } = this.process;

    return html`
       <md-linear-progress 
      .indeterminate=${!progress} 
      .value=${(progress || 0) / 100} 
      aria-label="progress status"></md-linear-progress>
      ${choose(status, [
      ['error', () => html`<lapp-icon class="error">error</lapp-icon><span class="message error">${error}</span>`],
      ['success', () => html`<lapp-icon class="success">check_circle</lapp-icon><span class="message success">Success: ${message}</span>`],
      ['pending', () => html`<span class="message"> ... processing </span><span class="message">${message || ''}</span>`],
    ])}
    `;
  }

  

} 