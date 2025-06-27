import '@material/web/button/filled-button';
import '@material/web/button/outlined-button';
import '@material/web/dialog/dialog';
import type { MdDialog } from '@material/web/dialog/dialog';
import type { MixinBase, MixinReturn } from '@material/web/labs/behaviors/mixin.js';
import { html, LitElement, nothing, PropertyValues, TemplateResult } from 'lit';
import { query } from 'lit/decorators.js';

type DialogConfigT = {
  /**
   * Template must contain a headline slot, possibly an icon slot 
   */
  template: TemplateResult
  title?: never
} | {
  title: string
  icon?: string
  template?: never
}

export type promiseEventDialogDetail<D = any> = DialogConfigT & {
  render: (data: D, host: LitElement) => TemplateResult
  data: D
  promise?: Promise<D>
}

/**
 * This event is fired to trigger the main application hoist an element
 */
export class PromiseEventDialogEvent<D> extends CustomEvent<promiseEventDialogDetail<D>> {
  static readonly eventName = 'PromiseEventDialog';
  constructor(detail: promiseEventDialogDetail<D>) {
    super(PromiseEventDialogEvent.eventName, {
      bubbles: true,
      composed: true,
      detail: detail
    });
  }
}

declare global {
  interface HTMLElementEventMap {
    'PromiseEventDialog': PromiseEventDialogEvent<any>,
  }
}


export declare class PromiseEventDialogMixinInterface {
}

type BaseT = LitElement & {}
/**
 * PromiseEventDialogMixin a mixin that adds a dialog opening when  app-promise-dialog-event is fired
 * and returns a promise with the result of the dialog when the dialog is closed 
 */
export const PromiseEventDialogMixin = <D = any>() => <T extends MixinBase<BaseT>>(
  superClass: T
): MixinReturn<T, PromiseEventDialogMixinInterface> => {

  let event: PromiseEventDialogEvent<D>;
  let resolve: (value: D | PromiseLike<D>) => void;
  let reject: (reason: 'cancelled') => void;
  abstract class PromiseEventDialogMixinClass extends superClass {

    @query('#promiseEventDialog') _promiseEventDialog!: MdDialog;

    override firstUpdated(_changedProperties: PropertyValues<this>) {
      super.firstUpdated(_changedProperties);
      this.addEventListener(
        PromiseEventDialogEvent.eventName,
        async (e: PromiseEventDialogEvent<D>) => {
          event = e;
          event.detail.promise = new Promise((r, rej) => {
            resolve = r;
            reject = rej;
            this.requestUpdate();
            this.updateComplete.then(() => {
              this._promiseEventDialog.show()
            })
          })
        }
      )
    }

    override render() {
      return html`
      ${super.render()}
      ${this._renderPromiseEventDialog()}
      `
    }

    _renderPromiseEventDialog() {
      // console.log('event', event)
      if (!event) return nothing;
      const render = event.detail.render.bind(this);
      const { data } = event.detail;
      const onClose = async () => {
        if (this._promiseEventDialog.returnValue === 'ok') {
          // TODO: we should be able to wait for resolve to resolved 
          // TODO: we sould be able to add a process indicator - under action
          resolve(data);
        }
        else {
          reject('cancelled');
        }
      }

      return html`
      <md-dialog 
        @close=${onClose}
        id="promiseEventDialog">
        ${'template' in event.detail ? event.detail.template :
          html`
          <div slot="headline">${event.detail.title}</div>
          <lapp-icon>${event.detail.icon || 'send'}</lapp-icon>
        `} 
        <form id="promise-event-dialog-form" method="dialog" slot="content" novalidate="">
          ${render(data, this)}
        </form>
        <div slot="actions">
          <md-outlined-button
            form="promise-event-dialog-form"
            value="cancel">Cancel</md-outlined-button>
          <md-filled-button
            form="promise-event-dialog-form"
            value="ok">OK</md-filled-button>
        </div>
      </md-dialog>`
    }
  };
  return PromiseEventDialogMixinClass
}

export default PromiseEventDialogMixin;

