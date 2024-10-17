import { consume, ContextProvider, createContext } from '@lit/context';
import { LitElement } from 'lit';
import { state } from 'lit/decorators.js';
import type Actor from './actor';
import watch from '@lit-app/shared/decorator/watch';
import { StateController } from '@lit-app/state';

// context for holding surveyContext
export const ActorContext = createContext<Actor>('actor-context');

type Constructor<T = {}> = new (...args: any[]) => T;

/**
 * ConsumeActorMixin a mixin that consumes actor context:
 * - @property - Actor<any,any>
 */
export declare class ContextActorMixinInterface {
	actor: Actor;
}

export const ConsumeActorMixin = <T extends Constructor<LitElement>>(superClass: T) => {

	class ContextConsumeActorMixinClass extends superClass {
		_bindActor!: StateController<Actor>;

		@consume({ context: ActorContext, subscribe: true })
		@state() actor!: Actor;

		@watch('actor')
		_actorChanged(actor: Actor) {
			this._bindActor = new StateController(this, actor);
			
		}
	};
	return ContextConsumeActorMixinClass as unknown as Constructor<ContextActorMixinInterface> & T;
}

export declare class ContextProvideActorMixinInterface {
	actorProvider: ContextProvider<typeof ActorContext>;
}
/**
 * ProvideActorMixin a mixin that consumes actor context:
 */
export const ProvideActorMixin = <T extends Constructor<LitElement>>(superClass: T) => {

	class ContextProvideActorMixinClass extends superClass {
		actorProvider = new ContextProvider(this, { context: ActorContext });
	};

	return ContextProvideActorMixinClass as unknown as 
		Constructor<ContextProvideActorMixinInterface> & T;
}
