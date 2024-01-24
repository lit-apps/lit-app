import { consume, ContextConsumer, ContextProvider, createContext } from '@lit/context';
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

		@state() data!: any;
		@property({type: Boolean, attribute: 'prevent-consume'}) preventConsume = false;

		private cachedData!: any; 
		consumer = new ContextConsumer(this, {
			context: dataContext,
			subscribe: true,
			callback: (value: any) => {
				if(this.preventConsume) {
					this.cachedData = value;
					// this.requestUpdate();
				} else {
					this.data = value;
				}
			}
		});

		override willUpdate(prop: PropertyValues) {
			if (prop.has('preventConsume')) {
				const old = prop.get('preventConsume');
				if(old === false && this.preventConsume === true && this.cachedData) {
					this.data = this.cachedData;
				}
			}
			super.willUpdate(prop);
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

		provider = new ContextProvider(this, {context: dataContext, initialValue: this.data});

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
				const force = Array.isArray(this.data) ? true : false;
				this.provider.setValue(this.data, force);
				
			}
			super.willUpdate(prop);

		}

	};

	return ContextProvideDataMixinClass as unknown as Constructor<DataMixinInterface<D>> & T;
}
