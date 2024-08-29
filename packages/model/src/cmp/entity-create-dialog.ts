import type { MdDialog } from '@material/web/dialog/dialog.js';
import { html, LitElement } from "lit";
import { query, state } from 'lit/decorators.js';
import {entityI, RenderConfig} from '../types';
import { ConsumeAppIdMixin } from '../mixin/context-app-id-mixin';
import { ConsumeEntityMixin } from '../mixin/context-entity-mixin';
import { EntityAccess, EntityElement, EntityStatus } from '../types';
import('@material/web/dialog/dialog.js');

export interface entityCreateDialogDetail {
	data: any;
	entity: entityI;
}

/**
 * This event is fired to trigger the main application hoist an element
 */
export class entityCreateDialogEvent extends CustomEvent<entityCreateDialogDetail> {
	static readonly eventName = 'entity-create-ok';
	constructor(detail: entityCreateDialogDetail) {
		super(entityCreateDialogEvent.eventName, {
			// bubbles: true,
			composed: true,
			detail: detail
		});
	}
}

declare global {
	interface HTMLElementEventMap {
		'entity-create-ok': entityCreateDialogEvent,
	}
}

/**
 *  create dialog for entity
 */

export default class entityCreateDialog extends 
	ConsumeAppIdMixin(
		ConsumeEntityMixin(LitElement)) {

	@state() data: any = {};
	@state() entity!: entityI;
	@query('md-dialog') dialog!: MdDialog

	override render() {
		return html`
			<md-dialog 
				@open=${this.onOpen}
				@close=${this.onClose}>
				<slot slot="headline" name="headline"></slot>
        <form id="entity-create" method="dialog" slot="content">
					<slot slot="content" name="content"></slot>
      		${this.entity?.renderFormNew(this.data, {} as RenderConfig)}
				</form>
				<div slot="actions"> 
					<md-outlined-button 
            form="entity-create"
            value="close">Cancel</md-outlined-button>
          <md-filled-button 
            form="entity-create"
            .disabled=${!this.ready}
            value="ok">Confirm</md-filled-button>
        </div>
			</md-dialog>
		`;
	}
	get entityStatus(): EntityStatus {
		return {
			isDirty: false,
			isEditing: true, // always editing
			isSaving: false,
			isLoading: false,
			isDeleting: false,
			isNew: true,
		}
	}
	get entityAccess(): EntityAccess {
		return {
			isOwner: true,
			canEdit: true,
			canView: true,
			canDelete: true
		}
	}
	get formReady() {
		return !!(this.data?.name);
	}
	get ready() {
		return this.formReady;
	}
	protected get okDetail() {
		return { data: this.data, entity: this.entity };
	}
	private onOpen() {
		if(!this.Entity) {
			throw 'missing Entity'
		}
		this.entity = new this.Entity(this as unknown as EntityElement) ;
	}
	private onClose() {
		if (this.dialog.returnValue === 'ok') {
			const event = new entityCreateDialogEvent(this.okDetail);
			this.dispatchEvent(event);
			this.data = {};
		}
	}
	close() {
		this.dialog.close();
	}
	show() {
		this.dialog.show()
	}
}
