import { LitElement } from 'lit';
import { property } from 'lit/decorators.js'
import { consume, provide, createContext } from '@lit/context';
// context for holding the entity id
export const appIdContext = createContext<string>('app-id-context');

type Constructor<T = {}> = new (...args: any[]) => T;

/**
 * ConsumeAppIdMixin a mixin that consumes appId context:
 * - @property - appId - true when test
 */
export declare class ContextAppIdMixinInterface {
	appID: string;
}

export const ConsumeAppIdMixin = <T extends Constructor<LitElement>>(superClass: T) => {

	class ContextConsumeAppIdMixinClass extends superClass {
		@consume({ context: appIdContext })
		@property() appID!: string;
	};
	return ContextConsumeAppIdMixinClass as unknown as Constructor<ContextAppIdMixinInterface> & T;
}

/**
 * ProvideAppIdMixin a mixin that consumes appId context:
 * - @property - appId - true when test
 */
export const ProvideAppIdMixin = <T extends Constructor<LitElement>>(superClass: T) => {

	class ContextProvideAppIdMixinClass extends superClass {
		@provide({ context: appIdContext })
		@property() appID!: string;
	};

	return ContextProvideAppIdMixinClass as unknown as Constructor<ContextAppIdMixinInterface> & T;
}
