
import {State } from '../state.js'
import { parse } from './parse.js';
import { functionValue } from '../functionValue.js';
export type StorageOptions = {
	key?: string,
	prefix?: string
}

const defaultOptions: StorageOptions = {
	prefix: '_ls'
}


/**
 * A decorator for syncing state values with localStorage
 * 
 * A state property marked with @storage will read the value 
 * from the associated localStorage item, parse it depending on 
 * its type and make it available to the state. 
 * 
 * Anytime the state property changes, the change is reflected 
 * to localStorage. 
 * 
 * A default (`_ls` for `Lit State`) prefix is set 
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
	
	return (
    proto: State,
    name: PropertyKey
  ) => {
		const descriptor = Object.getOwnPropertyDescriptor(proto, name);
		if (!descriptor) {
			throw new Error('@local-storage decorator need to be called after @property')
		}	
		const key: string = `${options?.prefix || ''}_${options?.key || String(name)}`;
		const ctor = (proto).constructor as typeof State;
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
		return undefined
	}
}
