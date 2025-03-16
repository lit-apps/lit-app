import { consume, createContext, provide } from '@lit/context';
import { PropertyValues, ReactiveElement } from 'lit';
import { state } from 'lit/decorators.js';
// import type {EntityI} from '../types/entity';
import { MixinBase, MixinReturn } from '@lit-app/shared/types.js';
import type { EntityI } from '../types';

// type Actions = Record<string, Action>;
// context for holding the entity id
export const entityContext = createContext<EntityI>('entity-class-context');

export declare class EntityMixinInterface {
	Entity: EntityI;
}

/**
 * ConsumeEntityMixin a mixin that consumes an Entity context.
 * 
 */
export const ConsumeEntityMixin = <T extends MixinBase<ReactiveElement>>(
	superClass: T
): MixinReturn<T, EntityMixinInterface> => {

	abstract class ContextConsumeEntityMixinClass extends superClass {
		@consume({ context: entityContext, subscribe: true })
		@state() Entity!: EntityI;
	};
	return ContextConsumeEntityMixinClass;
}

/**
 * ProvideEntityMixin a mixin that Provides an Entity context.
 * 
 */
export const ProvideEntityMixin = <T extends MixinBase<ReactiveElement>>(
	superClass: T
): MixinReturn<T, EntityMixinInterface> => {

	abstract class ContextProvideEntityMixinClass extends superClass {
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

	return ContextProvideEntityMixinClass;
}
