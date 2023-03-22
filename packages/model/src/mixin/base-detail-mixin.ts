/**
 * Mixin to be applied to all entity detail pages
 */
console.warn('base-detail-mixin.ts is deprecated');

import { LitElement, PropertyValues } from 'lit';
import { GetAccess } from '../types';
// import { property } from 'lit/decorators.js'

import ContextAccess, { ContextAccessMixinInterface } from './context-access-mixin';
import DataMixin, { DataMixinInterface } from './data-mixin';


type Constructor<T = {}> = new (...args: any[]) => T;
export declare class BaseDetailMixinInterface extends ContextProvideInterface {
}
/**
 * BaseDetailMixin - a mixin that handles how access rights work for entities
 * 
 * It provides: 
 * - @property - entityAccess
 * - @property - entityStatus
 */
export const BaseDetailMixin = <T extends Constructor<LitElement>>(superClass: T, getAccess: GetAccess) => {

	class BaseDetailMixinClass extends  
		ContextAccess(
			DataMixin(superClass), getAccess) {
	};
	// Cast return type to your mixin's interface intersected with the superClass type
	return BaseDetailMixinClass as unknown as Constructor<BaseDetailMixinInterface> & T;
}


export default BaseDetailMixin;

