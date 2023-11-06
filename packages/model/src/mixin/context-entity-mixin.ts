import { ReactiveElement } from 'lit';
import { state } from 'lit/decorators.js';
import { consume, provide, createContext } from '@lit-labs/context';
// import type {EntityI} from '../types/entity';
import type Entity from '../entity';

// type Actions = Record<string, Action>;
// context for holding the entity id
export const entityContext = createContext<typeof Entity>('entity-class-context');

type Constructor<T = {}> = new (...args: any[]) => T;

export declare class EntityMixinInterface {
	Entity: typeof Entity;
}

/**
 * ConsumeEntityMixin a mixin that consumes an Entity context.
 * 
 */
export const ConsumeEntityMixin = <T extends Constructor<ReactiveElement>>(superClass: T) => {

	class ContextConsumeEntityMixinClass extends superClass {
		@consume({ context: entityContext, subscribe: true })
		@state() Entity!: typeof Entity;
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
		@state() Entity!: typeof Entity;
		

	};

	return ContextProvideEntityMixinClass as unknown as Constructor<EntityMixinInterface> & T;
}
