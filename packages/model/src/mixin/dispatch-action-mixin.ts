import { LitElement, PropertyValues } from 'lit';
// import { property } from 'lit/decorators.js'
// import DataMixin from './data-mixin';
import BaseDetailMixin,  { BaseDetailMixinInterface } from './base-detail-mixin';
import Entity from '../entity';
import { 
	EntityAction,
 } from '../events';
import { Action, Actions } from '../types';

type Constructor<T = {}> = new (...args: any[]) => T;
export declare class DispatchActionMixinInterface extends BaseDetailMixinInterface {
	/**
	 * Creates an event dispatcher for the given action
	 * @param action 
	 * @param actionName 
	 */
	entity: Entity | undefined
	// get entityName(): string
	dispatchAction(action: Action, actionName: string,  entity: Entity): CustomEvent;
	protected _dispatchTriggerEvent(event: Event): typeof CustomEvent;
}
/**
 * DispatchActionMixin 
 * A mixin to dispatch entity actions. It needs to be mixed into classes that
 * use the this.entity.renderAction() method to render actions.
 */
export const DispatchActionMixin = <T extends Constructor<LitElement >>(superClass: T) => {

 
	class DispatchActionMixinClass extends superClass  {
	 
		dispatchAction(action: Action, actionName: string, entity: Entity):  CustomEvent {
			 const event = new EntityAction({id: this.id, entityName: entity.entityName}, action, actionName);
			 return this._dispatchTriggerEvent(event);
		}
 
		protected _dispatchTriggerEvent(event: CustomEvent) {
		 this.dispatchEvent(event);
		 return event
		}

	};
	// Cast return type to your mixin's interface intersected with the superClass type
	return DispatchActionMixinClass as unknown as Constructor<DispatchActionMixinInterface> & T;
}

export default DispatchActionMixin;

