import { HTMLEvent } from '@lit-app/shared/types.js';
import type { MdDialog } from '@material/web/dialog/dialog.js';
import { html, LitElement } from "lit";
import { property, query, state } from 'lit/decorators.js';
import { ConsumeAppIdMixin } from '../mixin/context-app-id-mixin';
import { ConsumeEntityMixin } from '../mixin/context-entity-mixin';
import { AuthorizationT, EntityElement, entityI, EntityStatus, RenderConfig } from '../types';
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
			bubbles: true,
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
	@state() isValid: boolean = false;
	@property() createLabel = 'Create';
	@query('md-dialog') dialog!: MdDialog

	override render() {
		const onInput = (e: HTMLEvent<HTMLInputElement, HTMLFormElement>) => {
			this.isValid = e.currentTarget?.checkValidity();
		}
		const onCancel = (e: Event) => {
			e.preventDefault();
			this.dialog.close('cancel');
		}
		return html`
			<md-dialog 
				@cancel=${onCancel}
				@open=${this.onOpen}
				@close=${this.onClose}>
				<slot slot="headline" name="headline"></slot>
        <form id="entity-create" method="dialog" slot="content" novalidate="" @input=${onInput}>
					<slot slot="content" name="content"></slot>
      		${this.entity?.renderFormNew(this.data, {} as RenderConfig)}
				</form>
				<div slot="actions"> 
					<md-outlined-button 
            form="entity-create"
            value="close">Cancel</md-outlined-button>
          <md-filled-button 
            form="entity-create"
            .disabled=${!this.isValid}
            value="ok">${this.createLabel}</md-filled-button>
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
	get authorization(): AuthorizationT {
		return {
			isOwner: true,
			canEdit: true,
			canView: true,
			canDelete: true
		}
	}
	protected get okDetail() {
		return { data: this.data, entity: this.entity };
	}
	private onOpen() {
		if (!this.Entity) {
			throw 'missing Entity'
		}
		this.entity = new this.Entity(this as unknown as EntityElement);
		this.data = this.entity.getDefaultData();
	}
	private onClose() {
		if (this.dialog.returnValue === 'ok') {
			const event = new entityCreateDialogEvent(this.okDetail);
			this.dispatchEvent(event);
		}
	}
	close(reason?: string) {
		this.dialog.close(reason);
	}
	show() {
		this.dialog.show()
	}
}
