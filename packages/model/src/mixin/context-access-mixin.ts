import { consume, createContext, provide } from '@lit/context';
import { PropertyValues, ReactiveElement } from 'lit';
import { property } from 'lit/decorators.js';
import { } from '../types/entity';


// import type { Access } from '../types/dataI';
import type { EntityI } from '../types';
import type { AccessT, AuthorizationT, GetAccessT } from '../types/access';
import { EntityMixinInterface } from './context-entity-mixin';

export const entityAccessContext = createContext<AuthorizationT>('entity-access-context');

type Constructor<T = {}> = abstract new (...args: any[]) => T;
export declare class AccessMixinInterface {
	authorization: AuthorizationT; // context storing document access rules
	// data: any; // entity data - to be evaluated for access
	get isOwner(): boolean;
	get canEdit(): boolean;
	get canView(): boolean;
	get canDelete(): boolean;
}

/**
 * ApplyGetterMixin applies access getters to an element.
 */
export const ApplyGetterMixin = <T extends Constructor<ReactiveElement>>(superClass: T) => {

	abstract class ApplyGetterMixinClass extends superClass {

		authorization!: AuthorizationT

		get isOwner() {
			return this.authorization?.isOwner;
		}
		get canEdit() {
			return this.authorization?.canEdit;
		}
		get canView() {
			return this.authorization?.canView;
		}
		get canDelete() {
			return this.authorization?.canDelete;
		}

	};
	return ApplyGetterMixinClass as unknown as Constructor<AccessMixinInterface> & T;
}

export declare class ProvideAccessMixinInterface<A extends AuthorizationT = AuthorizationT> extends AccessMixinInterface {
	accessDataGetter: (data: any) => AccessT
	updateAccess: (data: any) => void;
	authorization: A;
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
	_access: AccessT,
	_data: any): AuthorizationT {
	console.warn(`No access function provided for ${this.Entity?.entityName || 'No Entity'}`);
	return {
		isOwner: false,
		canEdit: false,
		canView: true,
		canDelete: false,
	}
};

/**
 * ## ProvideAccessMixin 
 * 
 * A mixin to be applied to entities at root level. It set authorization for the entity: 
 * Entity Access stores access information about the entity, like `isOwner`, `canEdit`, `canView`, `canDelete`
 * 
 * if getAccessFn is not provided, it uses Entity.getAccess or getAccessDefault
 */
export const ProvideAccessMixin = <A extends AuthorizationT = AuthorizationT, G extends GetAccessT = GetAccessT>(getAccessFn?: G) =>
	<T extends Constructor<ReactiveElement & { Entity?: EntityI, data: any }>>(superClass: T) => {

		class ProvideAccessMixinClass extends ApplyGetterMixin(superClass) {

			/** context storing document access  */
			@provide({ context: entityAccessContext })
			@property({ attribute: false }) override authorization!: AuthorizationT;

			@property({ attribute: false }) accessDataGetter: (data: any) => AccessT = (data: any) => {
				// console.info('AccessDataGetter', data?.metaData?.access)
				return data?.metaData?.access;
			};

			override willUpdate(changedProperties: PropertyValues<this>) {
				super.willUpdate(changedProperties);
				if (changedProperties.has('data') || changedProperties.has('accessDataGetter')) {
					this.updateAccess(this.data)
				}
			}
			/**
			 * @param data entity data - to be evaluated for access
			 * @returns void
			 */
			async updateAccess(data: any) {
				const accessDataGetter = this.Entity?.accessDataGetter || this.accessDataGetter;
				const accessData = await accessDataGetter(data);
				console.info('AccessData', accessData)
				if (!accessData) {
					this.authorization = {
						isOwner: false,
						canEdit: false,
						canView: false,
						canDelete: false,
					}
					return;
				}
				const getAccess = getAccessFn || this.Entity?.getAccess || getAccessDefault;
				this.authorization = await getAccess.call(this as EntityMixinInterface, accessData, data);
			}
		};
		// Cast return type to your mixin's interface intersected with the superClass type
		return ProvideAccessMixinClass as unknown as Constructor<ProvideAccessMixinInterface<A>> & T;
	}

/**
 * ConsumeAccessMixin consumes entityAccessContext for an entity.
 * Entity Access stores access information about the entity, like `isOwner`, `canEdit`, `canView`, `canDelete`
 */
export const ConsumeAccessMixin = <T extends Constructor<ReactiveElement>>(superClass: T) => {

	abstract class ContextConsumeAccessMixinClass extends ApplyGetterMixin(superClass) {

		/** context storing document access  */
		@consume({ context: entityAccessContext, subscribe: true })
		@property() override authorization!: AuthorizationT;

	};
	return ContextConsumeAccessMixinClass as unknown as Constructor<AccessMixinInterface> & T;
}

