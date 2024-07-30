import { consume, ContextProvider, createContext } from '@lit/context';
import { LitElement } from 'lit';
import { state } from 'lit/decorators.js';
import type Actor from './actor';
import watch from '@lit-app/shared/decorator/watch';
import { StateController } from '@lit-app/state';

// context for holding surveyContext
export const ActorContext = createContext<Actor<any, any>>('actor-context');

type Constructor<T = {}> = new (...args: any[]) => T;

/**
 * ConsumeActorMixin a mixin that consumes survey context:
 * - @property -Actor - actor<any, SurveyEventT>
 */
export declare class ContextActorMixinInterface {
	actor: Actor<any, any>;
}

export const ConsumeActorMixin = <T extends Constructor<LitElement>>(superClass: T) => {

	class ContextConsumeActorMixinClass extends superClass {
		_bindActor!: StateController<Actor<any, any>>;

		@consume({ context: ActorContext, subscribe: true })
		@state() actor!: Actor<any, any>;

		@watch('actor')
		_actorChanged(_oldActor: Actor<any, any>,  actor: Actor<any, any>) {
			this._bindActor = new StateController(this, actor);
			
		}
	};
	return ContextConsumeActorMixinClass as unknown as Constructor<ContextActorMixinInterface> & T;
}

export declare class ContextProvideActorMixinInterface {
	actorProvider: ContextProvider<typeof ActorContext>;
}
/**
 * ProvideActorMixin a mixin that consumes survey context:
 * - @property - uid - true when test
 */
export const ProvideActorMixin = <T extends Constructor<LitElement>>(superClass: T) => {

	class ContextProvideActorMixinClass extends superClass {
		actorProvider = new ContextProvider(this, { context: ActorContext });
	};

	return ContextProvideActorMixinClass as unknown as Constructor<ContextProvideActorMixinInterface> & T;
}
