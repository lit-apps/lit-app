import { ReactiveElement } from 'lit';
import { state } from 'lit/decorators.js';
import { consume, provide, createContext } from '@lit-labs/context';

export const dataContext = createContext('data-context');

type Constructor<T = {}> = new (...args: any[]) => T;

/**
 * ConsumeDataMixin a mixin that consumes Action context:
 * - @property - Action - true when test
 */
export declare class DataMixinInterface {
	data: any;
}

export const ConsumeDataMixin = <T extends Constructor<ReactiveElement>>(superClass: T) => {

	class ContextConsumeDataMixinClass extends superClass {
		@consume({ context: dataContext, subscribe: true })
		@state() data!: any;
	};
	return ContextConsumeDataMixinClass as unknown as Constructor<DataMixinInterface> & T;
}

/**
 * ProvideDataMixin a mixin that consumes Action context:
 * - @property - Action - true when test
 */
export const ProvideDataMixin = <T extends Constructor<ReactiveElement>>(superClass: T) => {

	class ContextProvideDataMixinClass extends superClass {
		
		@provide({ context: dataContext })
		@state() data!: any;

		get dataIsArray() {
			return Array.isArray(this.data)
		}

	};

	return ContextProvideDataMixinClass as unknown as Constructor<DataMixinInterface> & T;
}
