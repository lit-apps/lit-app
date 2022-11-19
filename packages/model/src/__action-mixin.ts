import { html } from 'lit';
import { LitElement, PropertyValues } from 'lit';
import ContextProvide, { ContextProvideInterface } from './mixin/context-provide-mixin';
import DataMixin, { DataMixinInterface } from './mixin/data-mixin';
import { state } from 'lit/decorators.js'
// import { userState } from '@preignition/preignition-state';
import { set, ellipsis } from '@preignition/preignition-util';
// import '@preignition/pwi-tab-badge'
import { serverTimestamp } from 'firebase/firestore';
import { GetAccess } from './types';




/**
 * Entity Action Mixin is mixid into entityBase
 * 
 */


// @event entity-edit - fired to indicate that the entity shall be in edit mode

// @event entity-reset - fired to indicate that the entity shall be reset


// @event entity-write - fired to indicate that the entity shall be saved
// const writeEvent = new CustomEvent('entity-write', { detail: {}, bubbles: true, composed: true })

// @event app-action - fired to indicate that an action is to be executed
// const writeEvent = new CustomEvent('entity-update', { detail: {}, bubbles: true, composed: true })

// @event entity-collection-add - fired to indicate that new data shall be added to collection



declare global {
  interface HTMLElementEventMap {

  }
}
// declare class  extendedDataMixintInterface extends DataMixinInterface {}
// declare class  extendedContextProvideInterface extends extendedDataMixintInterface  {}

type Constructor<T = {}> = new (...args: any[]) => T;
export declare class ActionMixinInterface extends ContextProvideInterface {
  // isEditing: boolean
  // dirty: boolean
}
/**
 * ActionMixin 
 */
export const ActionMixin = <T extends Constructor<LitElement>>(superClass: T, getAccess: GetAccess) => {

  class ActionMixinClass extends 
      ContextProvide(
        DataMixin(superClass), getAccess) {

    _previousStatus!: string

    // true when the entity is in edit mode
    // @state() isEditing!: boolean;
    // true when local data is different from persistence data
    // @state() dirty!: boolean;

    get reviewStatus() {
      return this.data?.metaData?.reviewStatus;
    }

    get accessStatus() {
      return this.data?.metaData?.access?.status;
    }

    get isPublic() {
      return this.accessStatus === 'public';
    }

    constructor(..._args: any[]) {
      super();
      this.addEventListener('input', e => {
        this.dirty = true;
      })
    }

    override update(props) {
      if (props.has('dirty')) {
        const dirtyEvent = new CustomEvent('entity-dirty', { detail: { dirty: this.dirty }, bubbles: true, composed: true })
        this._dispatch(dirtyEvent);
      }
      super.update(props)
    }

    private _persist() {
      this.data = { ...this.data };
      const writeEvent = new CustomEvent('entity-write', { detail: {}, bubbles: true, composed: true })
      writeEvent.detail.data = { ...this.data }
      this._dispatch(writeEvent);
    }

    private _setEvent(type) {
      // set(`metaData.event.${type}`, { by: 'test', timestamp: serverTimestamp() }, this.data)
      set(`metaData.event.${type}`, { by: getAccess.getUid(), timestamp: serverTimestamp() }, this.data)
      // this.setProp(`data.metaData.events.${type}`, { by: userState.uid, timestamp: serverTimestamp() });
    }

    private _dispatch(event) {
      event.detail.entity = this.entity;
      event.detail.groupID = this.groupID;
      // if (this.entityID && !event.detail.id) event.detail.id = this.entityID;
      if (this.id && !event.detail.id) event.detail.id = this.id;

      this.dispatchEvent(event);
    }

    dispatchAction(action, detail = {}) {
      const event = new CustomEvent('app-action', { detail: { action: action, ...detail }, bubbles: true, composed: true });
      this._dispatch(event);
      return event;
    }

    edit() {
      const editEvent = new CustomEvent('entity-edit', { detail: {}, bubbles: true, composed: true })
      this._dispatch(editEvent);
      this._previousStatus = this.data?.metaData?.reviewStatus;
      this.isEditing = true
      return;
    }

    save() {
      set('metaData.event.reviewStatus', 'modified', this.data)
      // this.setProp('data.metaData.reviewStatus', 'modified');
      this._setEvent('updated');
      this._persist();
      this.pushHistory('save');
      this.isEditing = false;
      this.dirty = false;
      return;
    }

    async cancel() {
      const resetEvent = new CustomEvent('entity-reset', { detail: {}, bubbles: true, composed: true })
      this._dispatch(resetEvent);
      const data = resetEvent.detail.data;
      if (data?.metaData?.reviewStatus && this._previousStatus) {
        data.metaData.reviewStatus = this._previousStatus
      }
      this.isEditing = false;
      // we need to await updateComplete to ensure we are not readOnly anymore
      // otherwise updates are not taken into account.
      await this.updateComplete;
      this.data = data;
      this.dirty = false;
      return;
    }


    async pushHistory(action) {
      const data = { ...this.data };
      const createEvent = new CustomEvent('entity-create', { detail: {}, bubbles: true, composed: true })
      delete data.metaData;
      createEvent.detail.collection = 'history';
      createEvent.detail.data = {
        action: action,
        uid: getAccess.getUid(),
        timestamp: serverTimestamp(),
        data
      };
      this.dispatchEvent(createEvent);
      const promise = await createEvent.detail.promise;
    }

    renderAction() {
      if (!this.canEdit) return '';
      return html`
      <div class="layout horizontal  button-container">
        ${this.isEditing ? this.renderIsEditing() : this.renderIsNotEditing()}
      </div>`
    }

    renderIsEditing() {
      return this.data?.metaData?.deleted === true ?
        html`
          <mwc-button .label=${'restore'} outlined .icon=${'restore_from_trash'} @click=${e => this.dispatchAction('restore')}></mwc-button>
          <mwc-button .label=${'cancel'} outlined .icon=${'cancel'} @click=${e => this.cancel()}></mwc-button>
        ` :
        html`
          <div class="layout horizontal ">
          <mwc-button .label=${'save'} .unelevated=${this.dirty} .outlined=${!this.dirty}  .icon=${'save'} @click=${e => this.save()}></mwc-button>
          <mwc-button .label=${'cancel'} outlined .icon=${'cancel'} @click=${e => this.cancel()}></mwc-button>
          </div>
          <span class="flex"></span>
          <div class="layout horizontal wrap end-justified">
            ${this.renderEditActionButton()}
            <mwc-button .label=${'delete'} .icon=${'delete'} @click=${e => this.deleteConfirmDialog.open = true}></mwc-button>
          </div>
          ${this.renderRemoveConfirmDialog()}
          `
    }

    renderIsNotEditing() {
      return html`
      <mwc-button .label=${'edit'} unelevated .icon=${'edit'} @click=${e => this.edit()}></mwc-button>
      <span class="flex"></span>
      ${this.renderActionButton()}
      `
    }

    renderActionButton() {
      return html`
      <mwc-button .label=${'compose email'} outlined .icon=${'email'} @click=${e => this.dispatchAction('openEmailDialog')}></mwc-button>
      `
    }

    renderEditActionButton() {
      return ''
      // return html`
      // <mwc-button .label=${'duplicate'} outlined .icon=${'content_copy'} @click=${e => this._confirmCopyDialogOpen = true}></mwc-button>
      // `
    }

    get deleteConfirmDialog() {
      return this.renderRoot?.querySelector('#deleteConfirmDialog');
    }

    renderRemoveConfirmDialog() {
      const onClosed = (e) => {
        if (e.detail.action === 'ok') {
          this.dispatchAction('delete');
        }
      };
      return html`
      <mwc-dialog 
        id="deleteConfirmDialog"
        .heading=${'Please Confirm'} @closed=${onClosed}>
        <p>You are about to remove <span class="badge">${ellipsis(this.data?.name || this.data?.detail || this.entity, 60)}</span> from the active list.</p>
        <p>It will still be visible from the "deleted" list and can be restored.</p>
        <mwc-button outlined label="cancel" slot="secondaryAction" dialogAction="cancel"></mwc-button>
        <mwc-button unelevated label="confirm" slot="primaryAction" dialogAction="ok"></mwc-button>
      </mwc-dialog>`;
    }


  };
  // Cast return type to your mixin's interface intersected with the superClass type
  return ActionMixinClass as unknown as Constructor<ActionMixinInterface> & T;
}

export default ActionMixin;

