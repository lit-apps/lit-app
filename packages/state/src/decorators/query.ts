
import {State } from '../state'
import { decorateProperty } from '@lit/reactive-element/decorators/base.js';
import { PropertySignature } from './property';
import { functionValue } from '../functionValue';
import { parse } from './parse';

export type QueryOptions = {
	parameter?: string,
}

let url: URL;
try {
	 url = new URL(window.location.href)
} catch(e){
	// @ts-ignore - see https://stackoverflow.com/questions/54649465/how-to-do-try-catch-and-finally-statements-in-typescript#54649623
	if (e.code === 'ERR_INVALID_URL') {
		console.warn('new URL failing in test')
	} else {
		throw(e)
	}
}


/**
 * A decorator for setting state values from url parameters
 * 
 * Used together with @storage, it allows to persist such values. 
 * @query must be placed before @storage for this to work.
 * 
 *  * How to use: 
 * ```js
 * class MyState extends State {
 * 	
 *   @query({parameter: 'para'})
 *   @storage({key: 'storage_path'})
 *   @property({value: 1}) a;
 * }
 * const s = new S()
 * 
 * localStorage.getItem('_ls_storage_path') 
 * 
 * ```
 * @param options 
 * @returns 
 */
export function query(options?: QueryOptions) {

	// for tests 
	if(!url) {
		url = new URL(window.location.href)
	}
	return decorateProperty({
		// @ts-ignore ctor is typof State and not typeof ReactiveElement
		finisher: (ctor: typeof State, name: string) => {
		
			const descriptor = Object.getOwnPropertyDescriptor(ctor.prototype, name);
			if (!descriptor) {
				throw new Error('@local-storage decorator need to be called after @property')
			}
			const parameter: string = `${options?.parameter || String(name)}`;
			const definition = ctor.propertyMap.get(name);
			const type = definition?.type
			if(definition) {
				const previousValue = definition.initialValue
				definition.initialValue = () => parse(url.searchParams.get(parameter), type) ?? functionValue(previousValue);
				ctor.propertyMap.set(name, {...definition, ...options})
			}
		}
	}) as unknown as PropertySignature
}

