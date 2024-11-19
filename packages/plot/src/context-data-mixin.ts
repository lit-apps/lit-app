import { ContextConsumer, createContext, provide } from '@lit/context';
import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';

// context for sharing data for plots
type dataT = { [key: string]: any };
export const plotDataContext = createContext<dataT[]>('plot-data-context');

type Constructor<T = {}> = new (...args: any[]) => T;

/**
 * ConsumeDataMixin a mixin that consumes plotData context:
 * - @property - data - data to plot
 * - @property - preventConsume - if true, data will not be consumed and shall be provided directly
 */
export declare class ContextDataMixinInterface {
	data: dataT[];
	preventConsume: boolean;
}

export const ConsumeDataMixin = <T extends Constructor<LitElement>>(superClass: T) => {

	class ContextConsumeDataMixinClass extends superClass {
		@property({ attribute: false }) data!: dataT[];
		@property({ type: Boolean, attribute: 'prevent-consume' }) preventConsume = false;

		private _dataConsumer = new ContextConsumer(this, {
			context: plotDataContext,
			subscribe: true,
			callback: (value: any) => {
				if (!this.preventConsume) {
					this.data = value;
				}
			}
		});

	};
	return ContextConsumeDataMixinClass as unknown as Constructor<ContextDataMixinInterface> & T;
}

/**
 * ProvideDataMixin a mixin that provides plotData context:
 * - @property - plotData - true when test
 */
export const ProvideDataMixin = <T extends Constructor<LitElement>>(superClass: T) => {

	class ContextProvideDataMixinClass extends superClass {
		@provide({ context: plotDataContext })
		@property({ attribute: false }) data!: dataT[];
	};

	return ContextProvideDataMixinClass as unknown as Constructor<ContextDataMixinInterface> & T;
}
