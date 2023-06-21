import { consume, createContext, provide } from '@lit-labs/context';
import { ReactiveElement, PropertyValues } from 'lit';
import { property } from 'lit/decorators.js';
import {
	EntityAccess
} from '../types/entity';


import type { Access } from '../types/dataI';
import type { GetAccess } from '../types/getAccess';
import type {EntityI} from '../types/entity';

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

export declare class ProvideAccessMixinInterface extends AccessMixinInterface {
	static getAccess: GetAccess;
}

const defaultAccessFalse = (_access: Access, _data: any) => {
	process.env.DEV && console.warn('No access function provided for entity');
	return false
}
const defaultAccessTrue = (_access: Access, _data: any) => {
	process.env.DEV && console.warn('No access function provided for entity');
	return true
}
const getAccess: GetAccess = {
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
export const ProvideAccessMixin = <T extends Constructor<ReactiveElement & {Entity: typeof EntityI, data: any}> >(superClass: T, getAccessFn: GetAccess = getAccess) => {

	class ProvideAccessMixinClass extends superClass {

		/** entity used to evaluate access */
		entity!: EntityI;

		/** context storing document access  */
		@provide({ context: entityAccessContext })
		@property() entityAccess!: EntityAccess;

		// @property() data!: any;

		override willUpdate(changedProperties: PropertyValues) {
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
			// TODO: getAccess should come from Entity
			const getAccess = this.Entity.getAccess || (this.entity?.constructor as typeof EntityI)?.getAccess || getAccessFn;
			this.entityAccess = {
				isOwner: getAccess.isOwner.call(this, accessData, data),
				canEdit: getAccess.canEdit.call(this, accessData, data),
				canView: getAccess.canView.call(this, accessData, data),
				canDelete: getAccess.canDelete.call(this, accessData, data)
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

	class ContextConsumeAccessMixinClass extends superClass {

		/** context storing document access  */
		@consume({ context: entityAccessContext, subscribe: true })
		@property() entityAccess!: EntityAccess;

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
	return ContextConsumeAccessMixinClass as unknown as Constructor<AccessMixinInterface> & T;
}

