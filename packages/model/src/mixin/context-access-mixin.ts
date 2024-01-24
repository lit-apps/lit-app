import { consume, createContext, provide } from '@lit/context';
import { ReactiveElement, PropertyValues } from 'lit';
import { property } from 'lit/decorators.js';
import {
	EntityAccess
} from '../types/entity';


import type { Access } from '../types/dataI';
import type { GetAccess } from '../types/getAccess';
import type {EntityI} from '../types';

export const entityAccessContext = createContext<EntityAccess>('entity-access-context');

type Constructor<T = {}> = new (...args: any[]) => T;
export declare class AccessMixinInterface {
	entityAccess: EntityAccess; // context storing document access rules
	data: any; // entity data - to be evaluated for access
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
	static getAccess: GetAccess;
}

const defaultAccessFalse = (_access: Access, _data: any) => {
	console.warn('No access function provided for entity');
	return false
}
const defaultAccessTrue = (_access: Access, _data: any) => {
	console.warn('No access function provided for entity');
	return true
}
const getAccessDefault: GetAccess = {
	isOwner: defaultAccessFalse,
	canDelete: defaultAccessFalse,
	canEdit: defaultAccessFalse,
	canView: defaultAccessTrue,
};


/**
 * ProvideAccessMixin 
 * A mixin to be applied to entities at root level. It set entityAccess for the entity: 
 * Entity Access stores access information about the entity, like `isOwner`, `canEdit`, `canView`, `canDelete`
 */
export const ProvideAccessMixin = <T extends Constructor<ReactiveElement & {Entity: EntityI, data: any}> >(superClass: T, getAccessFn?: GetAccess) => {

	class ProvideAccessMixinClass extends ApplyGetterMixin(superClass) {

		/** entity used to evaluate access */
		entity!: EntityI;

		/** context storing document access  */
		@provide({ context: entityAccessContext })
		@property() override entityAccess!: EntityAccess;

		// @property() data!: any;

		override willUpdate(changedProperties: PropertyValues<this>) {
			super.willUpdate(changedProperties);
			if (changedProperties.has('data')) {
				this.updateAccess(this.data)
			}
		}

		protected _getAccessData(data: any): Access {
			return data?.metaData?.access;
		}

		/**
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
			const getAccess = getAccessFn || this.Entity.getAccess || (this.entity?.constructor)?.getAccess || getAccessDefault;
			this.entityAccess = {
				isOwner: typeof getAccess.isOwner === 'function' ? getAccess.isOwner.call(this, accessData, data) : getAccess.isOwner,
				canEdit: typeof getAccess.canEdit === 'function' ? getAccess.canEdit.call(this, accessData, data) : getAccess.canEdit,
				canView: typeof getAccess.canView === 'function' ? getAccess.canView.call(this, accessData, data) : getAccess.canView,
				canDelete: typeof getAccess.canDelete === 'function' ? getAccess.canDelete.call(this, accessData, data) : getAccess.canDelete
			}

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

