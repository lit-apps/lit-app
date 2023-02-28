
import {State } from '../state.js'
import { decorateProperty } from '@lit/reactive-element/decorators/base.js';
import { PropertySignature } from './property';


export type HookOptions = {[key:string]: unknown}

/**
 * A decorator to be consumed by state hooks. A state hook acts as a interface
 * between state and other services reacting to state change or acting on the state.
 * 
 * a hook exposes `toState` and `fromState` methods for handling hte synchronization.
 * 
 * For instance, a state can be synced to a remote database, throught this mechanism.
 * 
 * 
 * @param options 
 * @returns 
 */
export function hook(hookName: string, options?: HookOptions) {
	
	return decorateProperty({
		// @ts-ignore ctor is typof State and not typeof ReactiveElement
		finisher: (ctor: typeof State, name: strubg) => {
			
			const descriptor = Object.getOwnPropertyDescriptor(ctor.prototype, name);
			if (!descriptor) {
				throw new Error('@hook decorator need to be called after @property')
			}
			const definition = ctor.propertyMap.get(name);
			if(definition) {
				const hook =  {...definition.hook , ...{[hookName]: options || {}}}
				ctor.propertyMap.set(name, {...definition, ...{hook: hook}})
			}
		}
	}) as unknown as PropertySignature
}

