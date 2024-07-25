import { consume, createContext, provide } from '@lit/context';
import { ReactiveElement, PropertyValues } from 'lit';
import { property } from 'lit/decorators.js';
import {
	EntityStatus,
} from '../types/entity';

import {
	Dirty,
	Edit,
	Reset,
	Delete,
	// MarkDeleted,
	EntityAction,
	// Create,
	Write, 
	BaseEvent
} from '../events';


export const entityStatusContext = createContext<EntityStatus>('entity-status-context');
declare global {
	interface HTMLElementEventMap {

	}
}

type Constructor<T = {}> = abstract new (...args: any[]) => T;
export declare class EntityStatusMixinInterface {
	entityStatus: EntityStatus; // context storing document status
}

const statusInit: EntityStatus = {
	isDirty:  false,
	isEditing: false,
	isSaving:  false,
	isLoading: false,
	isDeleting: false,
	isNew: false,
};

const statusProcessedSymbol = Symbol('statusProcessed');
type S<T> = T & { [statusProcessedSymbol]?: boolean };
/**
 * ProvideEntityStatusMixin 
 * A mixin to be applied to entities at root level. It set context providers for the entity status
 * Entity Status stores status information about the entity, like `isDirty`, `isEditing`, `isSaving`, `isLoading`, `isDeleting
 */
export const ProvideEntityStatusMixin = <T extends Constructor<ReactiveElement>>(superClass: T) => {

	abstract class ProvideEntityStatusMixinClass extends superClass {
		
		entityName: string | undefined;
		Entity: any;
		
		/** context storing document status*/
		@provide({ context: entityStatusContext })
		@property() entityStatus: EntityStatus = {...statusInit};
	
		@property() isNew: boolean = false;

		override willUpdate(props: PropertyValues<this>) {
			super.willUpdate(props);
			if (props.has('isNew')) {
				this.entityStatus = { ...this.entityStatus, isNew: this.isNew };
			}
		}

		protected override firstUpdated(props: PropertyValues) {
			// only process event that have not been processed by this mixin and that are the same entity
			
			const canHandle = (event: BaseEvent<any> & { [statusProcessedSymbol]?: boolean }) => {
				if (event[statusProcessedSymbol] || !event.canProcess) return false;
				// TODO: event might need confirmation - this is not taken into account yet
				const entityName = this.entityName || this.Entity?.entityName;
				return entityName && entityName === event.detail.entityName;
			};
			super.firstUpdated(props);
			this.addEventListener(Dirty.eventName, (e: S<Dirty>) => {
				if(!canHandle(e)) return;
				e[statusProcessedSymbol] = true
				if(this.entityStatus.isDirty !== e.detail.dirty) {
					this.entityStatus.isDirty = e.detail.dirty;
					this.entityStatus = { ...this.entityStatus }
				};
			});
			this.addEventListener(Edit.eventName, (e: S<Edit>) => {
				if(!canHandle(e)) return;
				e[statusProcessedSymbol] = true
				if(this.entityStatus.isDirty !== true) {
					this.entityStatus.isEditing = true;
					this.entityStatus = { ...this.entityStatus };
				}
			});
			this.addEventListener(Write.eventName, async (e: S<Write>) => {
				if(!canHandle(e)) return;
					e[statusProcessedSymbol] = true
					this.entityStatus.isSaving = true;
					this.entityStatus = { ...this.entityStatus };
					await e.detail.promise;
					this.entityStatus = {...statusInit}
			});
			this.addEventListener(Reset.eventName, async (e: S<Reset>) => {
				if(!canHandle(e)) return;
				e[statusProcessedSymbol] = true
				await e.detail.promise;
				this.entityStatus = {...statusInit, isNew: this.isNew}
				
			});
			this.addEventListener(Delete.eventName, async (e: S<Delete>) => {
				console.info('delete-action', e)
				if(!canHandle(e)) return;
				markDeleting(e)
				
			});
			this.addEventListener(EntityAction.eventName, async (e: S<EntityAction>) => {
				console.info('entity-action', e)
				if(!canHandle(e)) return;
				if(e.actionName === 'markDeleted') {
					markDeleting(e)
				}
			});
			const markDeleting = async (e:S<Delete> | S<EntityAction>) => {
				e[statusProcessedSymbol] = true
				this.entityStatus.isDeleting = true;
				this.entityStatus = { ...this.entityStatus };
				await e.detail.promise;
			}
		}

		protected updateStatus(data: any) {
			const { isDirty, isEditing, isSaving, isLoading, isDeleting, isNew } = data;
			this.entityStatus = {
				isDirty: isDirty ?? false,
				isEditing: isEditing ?? false,
				isSaving: isSaving ?? false,
				isLoading: isLoading ?? false,
				isDeleting: isDeleting ?? false,
				isNew: isNew ?? false,
			}
		}

	};
	// Cast return type to your mixin's interface intersected with the superClass type
	return ProvideEntityStatusMixinClass as unknown as Constructor<EntityStatusMixinInterface> & T;
}


/**
 * A mixin that consume EntityStatus context
 * Entity Status stores status information about the entity, like `isDirty`, `isEditing`, `isSaving`, `isLoading`, `isDeleting
 */
export const ConsumeEntityStatusMixin = <T extends Constructor<ReactiveElement>>(superClass: T) => {

	abstract class ContextConsumeEntityStatusMixinClass extends superClass {
		/** context storing document status*/
		@consume({ context: entityStatusContext, subscribe: true })
		@property() entityStatus!: EntityStatus ;

	};
	return ContextConsumeEntityStatusMixinClass as unknown as Constructor<EntityStatusMixinInterface> & T;
}

