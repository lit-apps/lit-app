
import {State } from '../state'
import { decorateProperty } from '@lit/reactive-element/decorators/base.js';
import { propertySignature } from './property';

export type localStorageOptions = {
	storageKey?: string,
	storagePrefix?: string
}

const defaultOptions: localStorageOptions = {
	storagePrefix: import.meta.env.VITE_LOCALSTORAGE_PREFIX || '_ls'
}

export function storage(options?: localStorageOptions) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	options = { ...defaultOptions, ...options }
	console.info('storage options', options)
	return decorateProperty({
		// @ts-ignore ctor is typof State and not typeof ReactiveElement
		finisher: (ctor: typeof State, name: PropertyKey) => {
			// const controllerMap = new WeakMap();
			// ctor.addInitializer((element: ReactiveElement): void => {
			//   controllerMap.set(element, new ContextProvider(element, context));
			// });
			// proxy any existing setter for this property and use it to
			// notify the controller of an updated value
			const descriptor = Object.getOwnPropertyDescriptor(ctor.prototype, name);
			if (!descriptor) {
				throw new Error('@local-storage decorator need to be called after @property')
			}
			const key: string = `${options?.storagePrefix || ''}_${options?.storageKey || String(name)}`;
			let value = localStorage.getItem(key)
			const type = ctor.typeMap.get(name)
			if (value !== undefined && value !== null && (
				type === Boolean ||
				type === Number ||
				type === Array ||
				type === Object)) {
				try {
					value = JSON.parse(value);
				} catch (e) {
					console.warn('cannot parse value', value)
				}
			}
			const oldGetter = descriptor?.get;
			let initiated = false
			const oldSetter = descriptor?.set;
			const setter = function (this: State, value: unknown) {
				if (value !== undefined) {
					localStorage.setItem(key,
						(type === Object ||
							type === Array) ? JSON.stringify(value) : value as string);
				}
				// controllerMap.get(this)?.setValue(value);
				if (oldSetter) {
					oldSetter.call(this, value);
				}
			}
			const newDescriptor = {
				...descriptor,
				get: function(this: State) {
					if (oldGetter && oldSetter) {
						// we need to call oldGetter to mark it as initiated
						oldGetter.call(this)
						if(!initiated && value !== undefined && value !== null) {
							initiated = true;
							setter.call(this, value)
						}
						return oldGetter.call(this)
					} 
				},
				set: setter
			};
			Object.defineProperty(ctor.prototype, name, newDescriptor);
		}
	}) as unknown as propertySignature
}
