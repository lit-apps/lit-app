
import {State } from '../state'
import { decorateProperty } from '@lit/reactive-element/decorators/base.js';
import { PropertySignature } from './property';

export type FirebaseOptions = {
	path?: string,
}

/**
 * A decorator to mark the property as bound with a Firebase path (realtime database).
 * The state value and its associated Firebase value will be synched. 
 * 
 * The State must be declared with a Firebase hook holdind a reference. The path to the firebase 
 * value resolves relativelyu to hook.ref 
 * 
 * @param options 
 * @returns 
 */
export function firebase(options?: FirebaseOptions) {
	
	return decorateProperty({
		// @ts-ignore ctor is typof State and not typeof ReactiveElement
		finisher: (ctor: typeof State, name: PropertyKey) => {
		
			const descriptor = Object.getOwnPropertyDescriptor(ctor.prototype, name);
			if (!descriptor) {
				throw new Error('@local-storage decorator need to be called after @property')
			}
			const definition = ctor.propertyMap.get(name);
			if(definition) {
				ctor.propertyMap.set(name, {...definition, ...options})
			}
		}
	}) as unknown as PropertySignature
}

