import { ReactiveElement } from 'lit';
import { state } from 'lit/decorators.js';
import { consume, provide, createContext } from '@lit-labs/context';
import type {EntityI} from '../types/entity';
import Entity  from '../entity';

// type Actions = Record<string, Action>;
// context for holding the entity id
export const entityContext = createContext<EntityI>('entity-class-context');

type Constructor<T = {}> = new (...args: any[]) => T;

/**
 * ConsumeEntityMixin a mixin that consumes Action context:
 * - @property - Action - true when test
 */
export declare class EntityMixinInterface {
	Entity: typeof EntityI;
}

export const ConsumeEntityMixin = <T extends Constructor<ReactiveElement>>(superClass: T) => {

	class ContextConsumeEntityMixinClass extends superClass {
		@consume({ context: entityContext, subscribe: true })
		@state() Entity!: typeof EntityI;
	};
	return ContextConsumeEntityMixinClass as unknown as Constructor<EntityMixinInterface> & T;
}

/**
 * ProvideEntityMixin a mixin that consumes Action context:
 * - @property - Action - true when test
 */
export const ProvideEntityMixin = <T extends Constructor<ReactiveElement>>(superClass: T) => {

	class ContextProvideEntityMixinClass extends superClass {
		@provide({ context: entityContext })
		@state() Entity!: typeof EntityI;
		

	};

	return ContextProvideEntityMixinClass as unknown as Constructor<EntityMixinInterface> & T;
}
