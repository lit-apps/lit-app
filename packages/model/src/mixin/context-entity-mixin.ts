import { consume, createContext, provide } from '@lit/context';
import { PropertyValues, ReactiveElement } from 'lit';
import { property, state } from 'lit/decorators.js';
// import type {EntityI} from '../types/entity';
import { MixinBase, MixinReturn } from '@lit-app/shared/types.js';
import type { EntityI } from '../types';

// type Actions = Record<string, Action>;
// context for holding the entity id
export const entityContext = createContext<EntityI>('entity-class-context');

export declare class EntityMixinInterface {
	Entity: EntityI;
}
export declare class ConsumeEntityMixinInterface extends EntityMixinInterface {
	contextEntity: EntityI;
}


/**
 * ConsumeEntityMixin a mixin that consumes an Entity context.
 * 
 */
export const ConsumeEntityMixin = <T extends MixinBase<ReactiveElement>>(
	superClass: T
): MixinReturn<T, ConsumeEntityMixinInterface> => {

	abstract class ContextConsumeEntityMixinClass extends superClass {
		@consume({ context: entityContext, subscribe: true })
		@state() contextEntity!: EntityI;

		private _Entity!: EntityI;
		@property({ attribute: false })
		set Entity(val: EntityI) {
			this._Entity = val;
		}
		get Entity(): EntityI {
			return this._Entity !== undefined ? this._Entity : this.contextEntity
		}
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
