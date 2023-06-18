import { PropertyValues, ReactiveElement } from 'lit';
import { state } from 'lit/decorators.js';
import { consume, provide, createContext, ContextProvider } from '@lit-labs/context';

export const dataContext = createContext('data-context');

type Constructor<T = {}> = new (...args: any[]) => T;

/**
 * ConsumeDataMixin a mixin that consumes data context
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
 * ProvideDataMixin a mixin that provides data context
 
 */
export const ProvideDataMixin = <T extends Constructor<ReactiveElement>>(superClass: T) => {

	class ContextProvideDataMixinClass extends superClass {

		@consume({ context: dataContext, subscribe: true })
		@state() parentData!: any;

		@state() data!: any;

		provider = new ContextProvider(this, dataContext, this.data);

		override willUpdate(prop: PropertyValues) {

			// we set parentData as prototype of data if data and parentData are set
			if (prop.has('parentData') || prop.has('data')) {
				if(this.data === null && this.parentData) {
					this.data = {}
				}
				if(this.data) {
					if(Object.getPrototypeOf(this.data) === Object.prototype && this.parentData) {
						Object.setPrototypeOf(this.data, this.parentData);
					}
				}
				this.provider.setValue(this.data);
				
			}
			super.willUpdate(prop);

		}

	};

	return ContextProvideDataMixinClass as unknown as Constructor<DataMixinInterface> & T;
}
