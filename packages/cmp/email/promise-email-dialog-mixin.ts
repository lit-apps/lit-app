import '@material/web/button/filled-button';
import '@material/web/button/outlined-button';
import '@material/web/dialog/dialog';
import type { MdDialog } from '@material/web/dialog/dialog';
import type { MixinBase, MixinReturn } from '@material/web/labs/behaviors/mixin.js';
import { html, LitElement, nothing, PropertyValues, TemplateResult } from 'lit';
import { query } from 'lit/decorators.js';
import { emailRenderer, EmailRendererT } from './emailRenderer.js';

/**
 * We are migrating the old approach to using this promise-based dialog for emails
 * 
 * TODO: 
 * - [x] Revise event 
 * - [x] create new just template renderer for email
 * - [x] add renderer for potential templates
 * - [x] add mixin to gds admin 
 * - [x] add mixin to gds settings
 * - [x] revise sendEmail action for Commitment
 * - [x] revise sendEmail action for Organisation
 * - [x] add instructions for when Dear ... is added to the email
 * - [x] revise sendEmail action for templates
 * - [ ] remove functions actions
 * - [ ] remove old email dialog
 * - [x] Add style for width. 
 */

type DialogConfigTemplateT = {
  template: TemplateResult
  title?: never
}
type DialogConfigTitleT = {
  title: string
  icon?: string
  template?: never
}
/**
 * Template must contain a headline slot, possibly an icon slot 
*/
type DialogConfigT = DialogConfigTemplateT | DialogConfigTitleT
function isTemplate(config: DialogConfigT): config is DialogConfigTemplateT {
  return 'template' in config;
}
export type promiseEventDialogDetail<D = any> = DialogConfigT & {
  render: (data: D, host: LitElement) => TemplateResult
  data: D
  promise?: Promise<D>
}

/**
 * This event is fired to trigger the main application hoist an element
 */
export class PromiseEmailDialogEvent<D extends EmailRendererT = EmailRendererT> extends CustomEvent<promiseEventDialogDetail<D>> {
  static readonly eventName = 'PromiseEventDialog';
  constructor(detail: promiseEventDialogDetail<D>) {
    super(PromiseEmailDialogEvent.eventName, {
      bubbles: true,
      composed: true,
      detail: detail
    });
  }
}

declare global {
  interface HTMLElementEventMap {
    'PromiseEventDialog': PromiseEmailDialogEvent<any>,
  }
}


export declare class PromiseEventDialogMixinInterface {
}

type BaseT = LitElement & {}
/**
 * PromiseEventDialogMixin a mixin that adds a dialog opening when  app-promise-dialog-event is fired
 * and returns a promise with the result of the dialog when the dialog is closed 
 */
export const PromiseEventDialogMixin = <D extends EmailRendererT = EmailRendererT>() => <T extends MixinBase<BaseT>>(
  superClass: T
): MixinReturn<T, PromiseEventDialogMixinInterface> => {

  let event: PromiseEmailDialogEvent<D>;
  let resolve: (value: D | PromiseLike<D>) => void;
  let reject: () => void;
  abstract class PromiseEventDialogMixinClass extends superClass {

    @query('#promiseEmailDialog') _promiseEMailDialog!: MdDialog;

    override firstUpdated(_changedProperties: PropertyValues<this>) {
      super.firstUpdated(_changedProperties);
      this.addEventListener(
        PromiseEmailDialogEvent.eventName,
        async (e: PromiseEmailDialogEvent<D>) => {
          event = e;
          event.detail.promise = new Promise((r, rej) => {
            resolve = r;
            reject = rej;
            this.requestUpdate();
            this.updateComplete.then(() => {
              this._promiseEMailDialog.show()
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
      console.log('event', event)
      if (!event) return nothing;
      const render = event.detail.render.bind(this);
      const { data } = event.detail;
      const onClose = async () => {
        if (this._promiseEMailDialog.returnValue === 'ok') {
          resolve(data);
        }
        else {
          reject();
        }
      }
      const layoutStyle = 'display:flex; flex-direction: column; gap: var(--space-small);'
      const dialogStyle = 'min-width: var(--lapp-email-dialog-width, min(80vw, 1200px));min-height:var(--lapp-email-dialog-height, min(80vh, 900px));'
      return html`
      <md-dialog 
        style=${dialogStyle}
        @close=${onClose}
        id="promiseEmailDialog">
        ${isTemplate(event.detail) ? event.detail.template :
          html`
        <div slot="headline">${event.detail.title}</div>
        `} 
        <form id="promise-email-dialog-form" method="dialog" slot="content" novalidate="">
          ${render(data, this)}
          <div style=${layoutStyle}> 
            ${emailRenderer.bind(data)({ hideTo: true, hideCC: true })}
          </div>
        </form>
        <div slot="actions">
          <md-outlined-button
            form="promise-email-dialog-form"
            value="cancel">Cancel</md-outlined-button>
          <md-filled-button
            form="promise-email-dialog-form"
            value="ok">send<lapp-icon slot="icon">send</lapp-icon>
          </md-filled-button>
        </div>
      </md-dialog>`
    }
  };
  return PromiseEventDialogMixinClass
}

export default PromiseEventDialogMixin;

