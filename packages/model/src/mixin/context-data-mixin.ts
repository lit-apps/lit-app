import DataHasChanged from '@lit-app/shared/event/data-has-changed';
import { MixinBase, MixinReturn } from '@lit-app/shared/types.js';
import { consume, ContextConsumer, ContextProvider, createContext, provide } from '@lit/context';
import { PropertyValues, ReactiveElement } from 'lit';
import { property, state } from 'lit/decorators.js';

export const dataContext = createContext<any>('data-context');
export const dataIsArrayContext = createContext<boolean>('data-is-array-context');


/**
 * ConsumeDataMixin a mixin that consumes data context
 */
export declare class DataMixinInterface<D = any> {
	data: D;
	dataIsArray: boolean;
}
export declare class DataMixinConsumeInterface<D = any> extends DataMixinInterface<D> {
	preventConsume: boolean;
	/**
	 * whether the data has changed for a given entity and path
	 */
	hasChanged(path: string, entityName: string): boolean;
}

/**
 * A mixin function that provides data consumption capabilities to a LitElement-based component.
 * 
 * @template D - The type of data to be consumed.
 * @template T - The type of the superclass, which extends ReactiveElement.
 * 
 * @param superClass - The superclass to be extended by the mixin.
 * 
 * @returns A class that extends the provided superclass with data consumption capabilities.
 * 
 * @property {D} data - The data consumed from the context.
 * @property {boolean} preventConsume - A flag to prevent data consumption.This is useful for new entities not yet saved to the database.
 * 
 * @event DataHasChanged - Dispatched to check if the data has changed.
 * 
 * @example
 * ```typescript
 * class MyElement extends ConsumeDataMixin<DataType>()(LitElement) {
 *   // Your element implementation
 * }
 * ```
 */
export const ConsumeDataMixin = <D = any>() => <T extends MixinBase<ReactiveElement>>(
	superClass: T
): MixinReturn<T, DataMixinConsumeInterface<D>> => {

	abstract class ContextConsumeDataMixinClass extends superClass {

		@state() data!: D;
		@property({ type: Boolean, attribute: 'prevent-consume' }) preventConsume = false;

		@consume({ context: dataIsArrayContext, subscribe: true })
		@state() dataIsArray!: boolean;

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
	return ContextConsumeDataMixinClass;
}

/**
 * A mixin function that provides context data to a LitElement component.
 * 
 * This mixin consumes data from a parent context and provides it to child components
 * using the `ContextProvider`. It ensures that the `data` property is set as the prototype
 * of `parentData` if both are defined, and updates the context provider with the current data.
 * 
 * @template D - The type of data to be provided.
 * @returns A class that extends the given superclass with context data providing capabilities.
 * 
 * @property {D} data - The data provided by the context.
 * 
 * @example
 * ```typescript
 * class MyElement extends ProvideDataMixin<MyDataType>()(LitElement) {
 *   // Your element implementation
 * }
 * ```
 */
export const ProvideDataMixin = <D = any>() => <T extends MixinBase<ReactiveElement>>(
	superClass: T
): MixinReturn<T, DataMixinInterface<D>> => {

	abstract class ContextProvideDataMixinClass extends superClass {

		@consume({ context: dataContext, subscribe: true })
		@state() parentData!: any;

		@state() data!: D;

		@provide({ context: dataIsArrayContext })
		@state() dataIsArray!: boolean;

		/**
		 * Whether to relay changes in the parent data to the child data.
		 * This is useful when components need to re-render when the parent data changes.
		 */
		@property({ type: Boolean }) relayParentChange = false;

		provider = new ContextProvider(this, { context: dataContext, initialValue: this.data });

		override willUpdate(prop: PropertyValues) {

			// we set parentData as prototype of data if data and parentData are set
			if (prop.has('parentData') || prop.has('data')) {
				if (this.data === null && this.parentData) {
					this.data = {} as D
				}
				const force = Array.isArray(this.data) ||
					(this.relayParentChange && prop.has('parentData') && !!prop.get('parentData'));
				if (this.data && this.parentData) {
					const dataProto = Object.getPrototypeOf(this.data);
					if (force || dataProto === Object.prototype) {
						const newData = { ...this.data };
						Object.setPrototypeOf(newData, this.parentData);
						this.data = newData;
					}
				}

				this.provider.setValue(this.data, force);

			}
			super.willUpdate(prop);
		}
	};

	return ContextProvideDataMixinClass;
}
