import { consume, ContextConsumer, ContextProvider, createContext } from '@lit/context';
import { PropertyValues, ReactiveElement } from 'lit';
import { state, property } from 'lit/decorators.js';
import DataHasChanged from '@lit-app/event/data-has-changed'

export const dataContext = createContext<any>('data-context');

type Constructor<T = {}> = abstract new (...args: any[]) => T;

/**
 * ConsumeDataMixin a mixin that consumes data context
 */
export declare class DataMixinInterface<D = any> {
	data: D;
}
export declare class DataMixinConsumeInterface<D = any> extends DataMixinInterface<D> {
	preventConsume: boolean;
	/**
	 * whether the data has changed for a given entity and path
	 */
	hasChanged(path: string, entityName: string): boolean;
}

export const ConsumeDataMixin = <D = any>() => <T extends Constructor<ReactiveElement>>(superClass: T) => {

	abstract class ContextConsumeDataMixinClass extends superClass {

		@state() data!: D;
		@property({ type: Boolean, attribute: 'prevent-consume' }) preventConsume = false;

		/**
		 * whether the data has changed for a given entity and path
		 */
		hasChanged(path: string, entityName: string): boolean {
			const hasChangedEvent = new DataHasChanged(path, entityName);
			this.dispatchEvent(hasChangedEvent);
			return !!hasChangedEvent.detail.hasChanged;
		}

		private cachedData!: any;
		consumer = new ContextConsumer(this, {
			context: dataContext,
			subscribe: true,
			callback: (value: any) => {
				if (this.preventConsume) {
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
				if (old === false && this.preventConsume === true && this.cachedData) {
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
export const ProvideDataMixin = <D = any>() => <T extends Constructor<ReactiveElement>>(superClass: T) => {

	abstract class ContextProvideDataMixinClass extends superClass {

		@consume({ context: dataContext, subscribe: true })
		@state() parentData!: any;

		@state() data!: D;

		provider = new ContextProvider(this, { context: dataContext, initialValue: this.data });

		override willUpdate(prop: PropertyValues) {

			// we set parentData as prototype of data if data and parentData are set
			if (prop.has('parentData') || prop.has('data')) {
				if (this.data === null && this.parentData) {
					this.data = {} as D
				}
				if (this.data) {
					if (Object.getPrototypeOf(this.data) === Object.prototype && this.parentData) {
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
