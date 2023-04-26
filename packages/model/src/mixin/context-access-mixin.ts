import { consume, createContext, provide } from '@lit-labs/context';
import { ReactiveElement, PropertyValues } from 'lit';
import { property } from 'lit/decorators.js';
import {
	EntityAccess
} from '../types/entity';


import type { Access } from '../types/dataI';
import type { GetAccess } from '../types/getAccess';

export const entityAccessContext = createContext<EntityAccess>('entity-access-context');

type Constructor<T = {}> = new (...args: any[]) => T;
export declare class AccessMixinInterface {
	entityAccess: EntityAccess; // context storing document access rules
	data: any; // entity data - to be evaluated for access
}

export declare class ProvideAccessMixinInterface extends AccessMixinInterface {
	static getAccess: GetAccess;
}

/**
 * ProvideAccessMixin 
 * A mixin to be applied to entities at root level. It set context providers for the entity: 
 */
export const ProvideAccessMixin = <T extends Constructor<ReactiveElement> >(superClass: T, getAccess: GetAccess) => {

	class ProvideAccessMixinClass extends superClass {

		static getAccess = getAccess;
		/** context storing document access  */
		@provide({ context: entityAccessContext })
		@property() entityAccess!: EntityAccess;

		@property() data!: any;

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
			const getAccess = (this.constructor as typeof ProvideAccessMixinClass).getAccess;
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


export const ConsumeAccessMixin = <T extends Constructor<ReactiveElement>>(superClass: T) => {

	class ContextConsumeAccessMixinClass extends superClass {

		/** context storing document access  */
		@consume({ context: entityAccessContext, subscribe: true })
		@property() entityAccess!: EntityAccess;
	};
	return ContextConsumeAccessMixinClass as unknown as Constructor<AccessMixinInterface> & T;
}

