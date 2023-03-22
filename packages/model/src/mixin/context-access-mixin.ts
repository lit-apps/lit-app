import { LitElement, PropertyValueMap, PropertyValues } from 'lit';
// import Base from '../entity/base';
import { property } from 'lit/decorators.js'
import { Unsubscribe, State } from '@lit-app/state';
import { provide, consume } from '@lit-labs/context';
// import { tokenState, Claims } from '@preignition/preignition-state';
import {
	entityStatusContext,
	entityAccessContext,

} from '../context';

// import { tokenState, Claims } from '@preignition/preignition-state';

import {
	Dirty,
	Reset,
	Edit,
	// Delete,
	// Create,
	Write,
	Close,
	Open
} from '../events';

import { } from '../context';
import { Access, GetAccess, EntityStatus,	EntityAccess } from '../types';
import DataMixin, { DataMixinInterface } from './data-mixin';

declare global {
	interface HTMLElementEventMap {

	}
}

type Constructor<T = {}> = new (...args: any[]) => T;
export declare class ContextAccessMixinInterface extends DataMixinInterface {
	static getAccess: GetAccess;
	entityStatus: EntityStatus; // context storing document status
	entityAccess: EntityAccess; // context storing document access rules
}

const statusInit: EntityStatus = {
	isDirty:  false,
	isEditing: false,
	isSaving:  false,
	isLoading: false,
	isDeleting: false,
};

/**
 * ContextAccessMixin 
 * A mixin to be applied to entities at root level. It set context providers for the entity: 
 * - entityStatusContext
 */
export const ContextAccessMixin = <T extends Constructor<LitElement>>(superClass: T, getAccess: GetAccess) => {

	class ContextAccessMixinClass extends DataMixin(superClass) {
		
		static getAccess = getAccess;

		/** context storing document status*/
		@provide({ context: entityStatusContext })
		@property() entityStatus: EntityStatus = {...statusInit};

		/** context storing document access  */
		@provide({ context: entityAccessContext })
		@property() entityAccess!: EntityAccess;

		protected override firstUpdated(props: PropertyValues) {
			super.firstUpdated(props);
			this.addEventListener(Dirty.eventName, (e: Dirty) => {
				if(this.entityStatus.isDirty !== e.detail.dirty) {
					this.entityStatus.isDirty = e.detail.dirty;
					this.entityStatus = { ...this.entityStatus }
				};
			});
			this.addEventListener(Edit.eventName, () => {
				if(this.entityStatus.isDirty !== true) {
					this.entityStatus.isEditing = true;
					this.entityStatus = { ...this.entityStatus };
				}
			});
			this.addEventListener(Write.eventName, async (e) => {
					this.entityStatus.isSaving = true;
					this.entityStatus = { ...this.entityStatus };
					await e.detail.promise;
					this.entityStatus = {...statusInit}
			});
			this.addEventListener(Reset.eventName, async (e) => {
				await e.detail.promise;
				this.entityStatus = {...statusInit}
				
			});
		}

		override willUpdate(changedProperties: PropertyValues) {
			super.willUpdate(changedProperties);
			if (changedProperties.has('data')) {
				// this.updateStatus(this.data);
				this.updateAccess(this.data)
			}
		}

		protected updateStatus(data: any) {
			const { isDirty, isEditing, isSaving, isLoading, isDeleting } = data;
			this.entityStatus = {
				isDirty: isDirty ?? false,
				isEditing: isEditing ?? false,
				isSaving: isSaving ?? false,
				isLoading: isLoading ?? false,
				isDeleting: isDeleting ?? false,
			}
		}

		protected _getAccessData(data: any): Access {
			return data?.metaData?.access;
		}
		/**
		 * 
		 * @param data entity data - to be evaluated for access
		 * @returns void
		 */
		protected updateAccess(data: any) {
			const accessData = this._getAccessData(data);
			if (!accessData) {
				this.entityAccess = {
					isOwner: false,
					canEdit: false,
					canView: false,
					canDelete: false,
				}
				return;
			}
			const getAccess = (this.constructor as typeof ContextAccessMixinClass).getAccess;
			this.entityAccess = {
				isOwner: getAccess.isOwner.call(this, accessData, data),
				canEdit: getAccess.canEdit.call(this, accessData, data),
				canView: getAccess.canView.call(this, accessData, data),
				canDelete: getAccess.canDelete.call(this, accessData, data)
			}

		}
	};
	// Cast return type to your mixin's interface intersected with the superClass type
	return ContextAccessMixinClass as unknown as Constructor<ContextAccessMixinInterface> & T;
}

export default ContextAccessMixin;

