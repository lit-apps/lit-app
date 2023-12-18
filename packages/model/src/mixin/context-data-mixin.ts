import { consume, ContextProvider, createContext } from '@lit-labs/context';
import { PropertyValues, ReactiveElement } from 'lit';
import { state, property } from 'lit/decorators.js';

export const dataContext = createContext('data-context');

type Constructor<T = {}> = new (...args: any[]) => T;

/**
 * ConsumeDataMixin a mixin that consumes data context
 */
export declare class DataMixinInterface<D = any> {
	data: D;
}
export declare class DataMixinConsumeInterface<D = any> extends DataMixinInterface<D> {
	preventConsume: boolean;
}

export const ConsumeDataMixin = <D, T extends Constructor<ReactiveElement>>(superClass: T) => {

	class ContextConsumeDataMixinClass extends superClass {
		@consume({ context: dataContext, subscribe: true })
		@state() data!: any;

		@property({type: Boolean, attribute: 'prevent-consume'}) preventConsume = false;

		constructor(...args: any[]) {
			super(...args);

			this.addEventListener('context-request', (e) => {
				this.preventConsume && e.context === dataContext && e.stopPropagation();
			})
		}

	};
	return ContextConsumeDataMixinClass as unknown as Constructor<DataMixinConsumeInterface<D>> & T;
}

/**
 * ProvideDataMixin a mixin that provides data context
 
 */
export const ProvideDataMixin = <D, T extends Constructor<ReactiveElement>>(superClass: T) => {

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

	return ContextProvideDataMixinClass as unknown as Constructor<DataMixinInterface<D>> & T;
}
