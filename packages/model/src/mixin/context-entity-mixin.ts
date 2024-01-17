import { PropertyValues, ReactiveElement } from 'lit';
import { state } from 'lit/decorators.js';
import { consume, provide, createContext } from '@lit/context';
// import type {EntityI} from '../types/entity';
import type {EntityI} from '../types';

// type Actions = Record<string, Action>;
// context for holding the entity id
export const entityContext = createContext<EntityI>('entity-class-context');

type Constructor<T = {}> = new (...args: any[]) => T;

export declare class EntityMixinInterface {
	Entity: EntityI;
}

/**
 * ConsumeEntityMixin a mixin that consumes an Entity context.
 * 
 */
export const ConsumeEntityMixin = <T extends Constructor<ReactiveElement>>(superClass: T) => {

	class ContextConsumeEntityMixinClass extends superClass {
		@consume({ context: entityContext, subscribe: true })
		@state() Entity!: EntityI;
	};
	return ContextConsumeEntityMixinClass as unknown as Constructor<EntityMixinInterface> & T;
}

/**
 * ProvideEntityMixin a mixin that Provides an Entity context.
 * 
 */
export const ProvideEntityMixin = <T extends Constructor<ReactiveElement>>(superClass: T) => {

	class ContextProvideEntityMixinClass extends superClass {
		@provide({ context: entityContext })
		@state() Entity!: EntityI;
		
		override willUpdate(props: PropertyValues<this>) {
			// we set the data-entity attribute to the entity name
			// so that we can query the dom for this entity - this is used 
			// by EntityResourceCreateMixin for example
			if (props.has('Entity')) {
				this.setAttribute('data-entity', this.Entity.entityName)
			}
			super.willUpdate(props);
		}

	};

	return ContextProvideEntityMixinClass as unknown as Constructor<EntityMixinInterface> & T;
}
