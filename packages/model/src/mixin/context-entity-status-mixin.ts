import { consume, createContext, provide } from '@lit-labs/context';
import { ReactiveElement, PropertyValues } from 'lit';
import { property } from 'lit/decorators.js';
import {
	EntityStatus,
} from '../types/entity';

import {
	Dirty,
	Edit,
	Reset,
	// Delete,
	// Create,
	Write
} from '../events';


export const entityStatusContext = createContext<EntityStatus>('entity-status-context');
declare global {
	interface HTMLElementEventMap {

	}
}

type Constructor<T = {}> = new (...args: any[]) => T;
export declare class EntityStatusMixinInterface {
	entityStatus: EntityStatus; // context storing document status
}

const statusInit: EntityStatus = {
	isDirty:  false,
	isEditing: false,
	isSaving:  false,
	isLoading: false,
	isDeleting: false,
};

/**
 * ProvideEntityStatusMixin 
 * A mixin to be applied to entities at root level. It set context providers for the entity status
 * - entityStatusContext
 */
export const ProvideEntityStatusMixin = <T extends Constructor<ReactiveElement>>(superClass: T) => {

	class ProvideEntityStatusMixinClass extends superClass {
		
		/** context storing document status*/
		@provide({ context: entityStatusContext })
		@property() entityStatus: EntityStatus = {...statusInit};

	
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

	};
	// Cast return type to your mixin's interface intersected with the superClass type
	return ProvideEntityStatusMixinClass as unknown as Constructor<EntityStatusMixinInterface> & T;
}


export const ConsumeEntityStatusMixin = <T extends Constructor<ReactiveElement>>(superClass: T) => {

	class ContextConsumeEntityStatusMixinClass extends superClass {
		/** context storing document status*/
		@consume({ context: entityStatusContext, subscribe: true })
		@property() entityStatus!: EntityStatus ;

	};
	return ContextConsumeEntityStatusMixinClass as unknown as Constructor<EntityStatusMixinInterface> & T;
}

