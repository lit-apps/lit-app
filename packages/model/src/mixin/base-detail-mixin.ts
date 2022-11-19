/**
 * Mixin to be applied to all entity detail pages
 */

import { LitElement, PropertyValues } from 'lit';
// import { property } from 'lit/decorators.js'

import ContextProvide, { ContextProvideInterface } from './context-provide-mixin';
import DataMixin, { DataMixinInterface } from './data-mixin';


type Constructor<T = {}> = new (...args: any[]) => T;
export declare class BaseDetailMixinInterface extends ContextProvideInterface {
}
/**
 * EntityBaseMixin 
 */
export const BaseDetailMixin = <T extends Constructor<LitElement>>(superClass: T, getAccess: GetAccess) => {

	class BaseDetailMixinClass extends  
		ContextProvide(
			DataMixin(superClass), getAccess) {
	};
	// Cast return type to your mixin's interface intersected with the superClass type
	return BaseDetailMixinClass as unknown as Constructor<BaseDetailMixinInterface> & T;
}


export default BaseDetailMixin;

