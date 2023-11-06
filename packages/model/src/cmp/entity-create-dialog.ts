import { html, LitElement } from "lit";
import { property, state, query } from 'lit/decorators.js';
import { ConsumeEntityMixin } from '../mixin/context-entity-mixin';
import Entity from '../entity';
import type { MdDialog } from '@material/web/dialog/dialog.js';
import { EntityAccess, EntityElement, EntityStatus } from '../types';
import('@material/web/dialog/dialog.js');

export interface entityCreateDialogDetail {
	data: any;
	entity: Entity;
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

export default class entityCreateDialog extends ConsumeEntityMixin(LitElement) {

	// @property({ attribute: false }) Entity!: typeof Entity;
	@state() data: any = {};
	@state() entity!: Entity;
	@query('md-dialog') dialog!: MdDialog

	override render() {
		return html`
			<md-dialog 
				@open=${this.onOpen}
				@close=${this.onClose}>
				<slot slot="headline" name="headline"></slot>
        <form id="entity-create" method="dialog" slot="content">
					<slot slot="content" name="content"></slot>
      		${this.entity?.renderCreateDialog(this.data)}
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
			isDeleting: false
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
		this.entity = new this.Entity(this as EntityElement);
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
