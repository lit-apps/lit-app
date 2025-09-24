import DataHasChanged from '@lit-app/shared/event/data-has-changed';
import type { MixinBase, MixinReturn } from '@lit-app/shared/types.js';
import { consume, ContextProvider, createContext, provide } from '@lit/context';
import { dedupeMixin } from '@open-wc/dedupe-mixin';
import { PropertyValues, ReactiveElement } from 'lit';
import { property, state } from 'lit/decorators.js';

export const dataContext = createContext<any>('data-context');
export const dataIsArrayContext = createContext<boolean>('data-is-array-context');

/**
 * ConsumeDataMixin a mixin that consumes data context
 */
export declare class DataMixinInterface<D> {
	data: D;
	dataIsArray: boolean;
}
export declare class DataMixinConsumeInterface<D> extends DataMixinInterface<D> {
	// preventConsume: boolean;
	/**
 	* whether the data has changed for a given entity and path
 	*/
	hasChanged(path: string, entityName: string): boolean;
	contextData: D;
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
export const ConsumeDataMixin = <D = any>() => dedupeMixin(<T extends MixinBase<ReactiveElement>>(
	superClass: T
): MixinReturn<T, DataMixinConsumeInterface<D>> => {

	abstract class ContextConsumeDataMixinClass extends superClass {

		/**
 		* the data consumed from the context - we are not using `data` so that it is possible
 		* to set data independently, via the `data` property, backed by `_data
 		*/
		@consume({ context: dataContext, subscribe: true })
		@state() contextData!: any;

		// TODO: check if we still need prevent-consume as having data and contextData as separate props should be enough
		@consume({ context: dataIsArrayContext, subscribe: true })
		@state() dataIsArray!: boolean;

		private _data!: D;
		@property()
		set data(val: D) {
			this._data = val;
		}
		get data() {
			return this._data !== undefined ? this._data : this.contextData
		}

		/**
 		* whether the data has changed for a given entity and path
 		*/
		hasChanged(path: string, entityName: string): boolean {
			const hasChangedEvent = new DataHasChanged(path, entityName);
			this.dispatchEvent(hasChangedEvent);
			return !!hasChangedEvent.detail.hasChanged;
		}

	};
	return ContextConsumeDataMixinClass;
})

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
export const ProvideDataMixin = <D = any>() => dedupeMixin(<T extends MixinBase<ReactiveElement>>(
	superClass: T
): MixinReturn<T, DataMixinInterface<D> & { parentData: D }> => {

	// const [Symbol] = 

	abstract class ContextProvideDataMixinClass extends superClass {

		declare loading: boolean;
		@consume({ context: dataContext, subscribe: true })
		@state() parentData!: any;

		@state() data!: D //| undefined;

		@provide({ context: dataIsArrayContext })
		@state() dataIsArray!: boolean;

		/**
 		* Whether to relay changes in the parent data to the child data.
 		* This is useful when components need to re-render when the parent data changes.
 		*/
		@property({ type: Boolean }) relayParentChange = false;

		provider = new ContextProvider(this, { context: dataContext, initialValue: this.data });

		/**
 		* A flag to know if we have a parent Provider
 		* we only set provider values when: 
 		* - we do not have parentData
 		* - we have parentData and both data and parentData are set
 		*/
		// private _hasParentProvider = false;

		override willUpdate(prop: PropertyValues) {
			// if (prop.has('path')) {
			// 	this.data = undefined;
			// }

			// we set parentData as prototype of data if data and parentData are set
			if (prop.has('parentData') || prop.has('data')) {
				if (this.data !== undefined) {

					// we might get parentData while data is still loading 
					if (!prop.has('data') && this.loading === true) {
						return;
					}

					// console.info('SET DATA', this.data, this.parentData)
					if (this.data === null) {
						this.data = {} as D
					}
					const activateParentChange = this.relayParentChange && prop.has('parentData') //&& !!prop.get('parentData');
					const force = Array.isArray(this.data) || activateParentChange;
					if (activateParentChange && this.data) {
						const d = { ...this.data }
						Object.setPrototypeOf(d, this.parentData);
						this.data = d
					} else if (this.data && this.parentData) {
						if (Object.getPrototypeOf(this.data) === Object.prototype) {
							// if (this.data !== this.parentData && Object.getPrototypeOf(this.data) !== this.parentData) {
							Object.setPrototypeOf(
								this.data,
								this.parentData)
						}
					}

					this.provider.setValue(this.data, force);
				}

			}
			super.willUpdate(prop);
		}
	};

	return ContextProvideDataMixinClass;
})
