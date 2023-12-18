import { ReactiveElement } from 'lit';
import { state } from 'lit/decorators.js';
import { consume, provide, createContext } from '@lit-labs/context';
// import type {EntityI} from '../types/entity';
import type EntityI from '../entityAbstract';

// type Actions = Record<string, Action>;
// context for holding the entity id
export const entityContext = createContext<typeof EntityI>('entity-class-context');

type Constructor<T = {}> = new (...args: any[]) => T;

export declare class EntityMixinInterface {
	Entity: typeof EntityI;
}

/**
 * ConsumeEntityMixin a mixin that consumes an Entity context.
 * 
 */
export const ConsumeEntityMixin = <T extends Constructor<ReactiveElement>>(superClass: T) => {

	class ContextConsumeEntityMixinClass extends superClass {
		@consume({ context: entityContext, subscribe: true })
		@state() Entity!: typeof EntityI;
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
		@state() Entity!: typeof EntityI;
		

	};

	return ContextProvideEntityMixinClass as unknown as Constructor<EntityMixinInterface> & T;
}
