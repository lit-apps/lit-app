import { LitElement, PropertyValues } from 'lit';
import { property } from 'lit/decorators.js'

type Constructor<T = {}> = new (...args: any[]) => T;
export declare class DataMixinInterface extends LitElement {
	id: string;
	data: any | undefined
}
/**
 * EntityDataMixin 
 * very simple mixin, just adding data property
 */
export const DataMixin = <T extends Constructor<LitElement>>(superClass: T) => {

	class DataMixinClass extends superClass  {
	 
		@property() data!: any;

	};
	// Cast return type to your mixin's interface intersected with the superClass type
	return DataMixinClass as unknown as Constructor<DataMixinInterface> & T;
}

export default DataMixin;

