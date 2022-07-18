
import {State } from '../state'
import { decorateProperty } from '@lit/reactive-element/decorators/base.js';
import { PropertySignature } from './property';
import { parse } from './parse';
import { functionValue } from '../functionValue';
export type StorageOptions = {
	key?: string,
	prefix?: string
}

const defaultOptions: StorageOptions = {
	prefix: import.meta.env.VITE_LOCALSTORAGE_PREFIX || '_ls'
}


/**
 * A decorator for syncing state values with localStorage
 * 
 * A state property marked with @storage will read the value 
 * from the associated localStorage item, parse it depending on 
 * its type and make it available to the state. 
 * 
 * Anytime the state propery changes, the change is reflected 
 * to localStorage. 
 * 
 * A default prefix (`_ls` for `Lit State` which can be overriden 
 * on build with `env` configuration: `VITE_LOCALSTORAGE_PREFIX`)
 * 
 * @storage must be placed before @property for this to work.
 * 
 * How to use: 
 * ```js
 * class MyState extends State {
 * 
 *   @storage({key: 'storage_path'})
 *   @property({value: 1}) a;
 * }
 * const s = new S()
 * 
 * localStorage.getItem('_ls_storage_path') 
 *  
 * ```
 * 
 * @param options 
 * @returns PropertySignature
 */
export function storage(options?: StorageOptions) {
	options = { ...defaultOptions, ...options }
	// console.info('storage options', options)
	return decorateProperty({
		// @ts-ignore ctor is typof State and not typeof ReactiveElement
		finisher: (ctor: typeof State, name: string) => {
			// console.info('storage ', name)
			const descriptor = Object.getOwnPropertyDescriptor(ctor.prototype, name);
			if (!descriptor) {
				throw new Error('@local-storage decorator need to be called after @property')
			}
			const key: string = `${options?.prefix || ''}_${options?.key || String(name)}`;
			const definition = ctor.propertyMap.get(name);
			const type = definition?.type
			if(definition) {
				const previousValue = definition.initialValue
				definition.initialValue = () => parse(localStorage.getItem(key), type) ?? functionValue(previousValue);
				ctor.propertyMap.set(name, {...definition, ...options})
			}
			// const oldGetter = descriptor?.get;
			const oldSetter = descriptor?.set;
			const setter = function (this: State, value: unknown) {
				if (value !== undefined) {
					localStorage.setItem(key,
						(type === Object ||
							type === Array) ? JSON.stringify(value) : value as string);
				}
				if (oldSetter) {
					oldSetter.call(this, value);
				}
			}
			const newDescriptor = {
				...descriptor,
				set: setter
			};
			Object.defineProperty(ctor.prototype, name, newDescriptor);
		}
	}) as unknown as PropertySignature
}
