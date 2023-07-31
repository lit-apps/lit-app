import { LitElement, PropertyValues } from 'lit';
import { property } from 'lit/decorators.js'
import { ResizeController } from '@lit-labs/observers/resize-controller.js'

type Constructor<T = {}> = new (...args: any[]) => T;
export declare class ResizeControllerMixinInterface {
	/** true when width of the element is less than threshold */
	get isNarrow(): boolean
}

/**
 * ResizeControllerMixin 
 * 
 * add isNarrow getter - which is true when the width of the element is less than the threshold
 */
export const ResizeControllerMixin = <T extends Constructor<LitElement>>(superClass: T, threshold: number = 600) => {

	class ResizeControllerMixinClass extends superClass {
		get isNarrow() {
			return this.resizeController.value;
		}
		resizeController = new ResizeController(this, { callback: () => this.clientWidth < threshold })
		
	};
	// Cast return type to your mixin's interface intersected with the superClass type
	return ResizeControllerMixinClass as unknown as Constructor<ResizeControllerMixinInterface> & T;
}

export default ResizeControllerMixin;

