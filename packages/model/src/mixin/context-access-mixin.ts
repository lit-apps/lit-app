import { consume, createContext, provide } from '@lit/context';
import { ReactiveElement, PropertyValues } from 'lit';
import { property } from 'lit/decorators.js';
import {
	EntityAccess
} from '../types/entity';


import type { Access } from '../types/dataI';
import type { GetAccess } from '../types/getAccess';
import type {EntityI} from '../types';
import { EntityMixinInterface } from './context-entity-mixin';

export const entityAccessContext = createContext<EntityAccess>('entity-access-context');

type Constructor<T = {}> = new (...args: any[]) => T;
export declare class AccessMixinInterface {
	entityAccess: EntityAccess; // context storing document access rules
	// data: any; // entity data - to be evaluated for access
	get isOwner(): boolean;
	get canEdit(): boolean;
	get canView(): boolean;
	get canDelete(): boolean;
}

/**
 * ApplyGetterMixin applies access getters to an element.
 */
export const ApplyGetterMixin = <T extends Constructor<ReactiveElement >>(superClass: T) => {

	class ApplyGetterMixinClass extends superClass {

		entityAccess!: EntityAccess
		get isOwner() {
			return this.entityAccess?.isOwner;
		}
		get canEdit() {
			return this.entityAccess?.canEdit;
		}
		get canView() {
			return this.entityAccess?.canView;
		}
		get canDelete() {
			return this.entityAccess?.canDelete;
		}

	};
	return ApplyGetterMixinClass as unknown as Constructor<AccessMixinInterface> & T;
}

export declare class ProvideAccessMixinInterface extends AccessMixinInterface {
	accessDataGetter: (data: any) => Access
	updateAccess: (data: any) => void;
}

// const defaultAccessFalse = (_access: Access, _data: any) => {
// 	console.warn('No access function provided for entity');
// 	return false
// }
// const defaultAccessTrue = (_access: Access, _data: any) => {
// 	return true
// }
function getAccessDefault(
	this: EntityMixinInterface, 
	_access: Access, 
	_data: any): EntityAccess {
	console.warn(`No access function provided for ${this.Entity?.entityName || 'No Entity' }`);
	return {
		isOwner: false,
		canEdit: false,
		canView: true,
		canDelete: false,
	}
}  ;

/**
 * ProvideAccessMixin 
 * A mixin to be applied to entities at root level. It set entityAccess for the entity: 
 * Entity Access stores access information about the entity, like `isOwner`, `canEdit`, `canView`, `canDelete`
 * 
 * if getAccessFn is not provided, it uses Entity.getAccess or getAccessDefault
 */
export const ProvideAccessMixin = <A extends EntityAccess = EntityAccess>(getAccessFn?: GetAccess) => 
	<T extends Constructor<ReactiveElement & {Entity?: EntityI, data: any}> >(superClass: T) => {

	class ProvideAccessMixinClass extends ApplyGetterMixin(superClass) {

		/** context storing document access  */
		@provide({ context: entityAccessContext })
		@property() override entityAccess!: EntityAccess;

		@property({attribute: false}) accessDataGetter: (data: any) => Access = (data: any) => {
			console.info('AccessDataGetter', data?.metaData?.access)
			return data?.metaData?.access;
		};

		override willUpdate(changedProperties: PropertyValues<this>) {
			super.willUpdate(changedProperties);
			if (changedProperties.has('data') || changedProperties.has('accessDataGetter')) {
				this.updateAccess(this.data)
			}
		}

		// getAccessData(data: any): Access {
		// 	return data?.metaData?.access;
		// }

		/**
		 * @param data entity data - to be evaluated for access
		 * @returns void
		 */
		async updateAccess(data: any) {
			const accessDataGetter = this.Entity?.accessDataGetter || this.accessDataGetter ;
			const accessData =  await accessDataGetter(data);
			if (!accessData) {
				this.entityAccess = {
					isOwner: false,
					canEdit: false,
					canView: false,
					canDelete: false,
				}
				return;
			}
			const getAccess = getAccessFn || this.Entity?.getAccess || getAccessDefault;
			this.entityAccess = await getAccess.call(this as EntityMixinInterface, accessData, data);
		}
	};
	// Cast return type to your mixin's interface intersected with the superClass type
	return ProvideAccessMixinClass as unknown as Constructor<ProvideAccessMixinInterface> & T;
}

/**
 * ConsumeAccessMixin consumes entityAccessContext for an entity.
 * Entity Access stores access information about the entity, like `isOwner`, `canEdit`, `canView`, `canDelete`
 */
export const ConsumeAccessMixin = <T extends Constructor<ReactiveElement>>(superClass: T) => {

	class ContextConsumeAccessMixinClass extends ApplyGetterMixin(superClass) {

		/** context storing document access  */
		@consume({ context: entityAccessContext, subscribe: true })
		@property() override entityAccess!: EntityAccess;

	};
	return ContextConsumeAccessMixinClass as unknown as Constructor<AccessMixinInterface> & T;
}

