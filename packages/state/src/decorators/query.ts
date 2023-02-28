
import {State } from '../state.js'
import { decorateProperty } from '@lit/reactive-element/decorators/base.js';
import { PropertySignature } from './property.js';
import { functionValue } from '../functionValue.js';
import { parse } from './parse.js';

export type QueryOptions = {
	parameter?: string,
	skipAsync?: boolean
}

const url = new URL(window.location.href)

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
				const parameterValue = url.searchParams.get(parameter)

				// register the fact that this property is set by a query parameter
				if(parameterValue !== null) {
					definition.skipAsync = true
				}
				definition.initialValue = () => parse(parameterValue, type) ?? functionValue(previousValue);
				ctor.propertyMap.set(name, {...definition, ...options})
			}
		}
	}) as unknown as PropertySignature
}

