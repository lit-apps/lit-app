import { property } from 'lit/decorators.js';
// import { GenericI } from '../generic/generic';

declare global {
	interface HTMLElementEventMap {
		
	}
}


type Constructor<T = {}> = abstract new (...args: any[]) => T;
export declare class CompatMixinInterface {
	// Define the interface for the mixin
	helper: string
}
/**
 * CompatMixin
 * allows to use MD2 property for MD3 fields
 */
export const CompatMixin = <T extends Constructor<{supportingText: string}>>(superClass: T) => {

 
	abstract class CompatMixinClass extends superClass  {
		/**
		 * let us know that this is a MD3 field
		 * this is usefull when processing errors - which is done differently in MD3
		 */
		isMD3: boolean = true;
	 
		@property()
		get helper() {
			return this.supportingText;
		}
		set	helper(value) {
			this.supportingText = value;
		}

	};
	// Cast return type to your mixin's interface intersected with the superClass type
	return CompatMixinClass as unknown as Constructor<CompatMixinInterface> & T;
}

export default CompatMixin;

