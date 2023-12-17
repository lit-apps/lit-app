
import { State } from '../state.js'
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

	return (
		proto: State,
		name: PropertyKey
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	): PropertyDescriptor | undefined => {
		const descriptor = Object.getOwnPropertyDescriptor(proto, name);
		if (!descriptor) {
			throw new Error('@local-storage decorator need to be called after @property')
		}
		const ctor = (proto).constructor as typeof State;
		const parameter: string = `${options?.parameter || String(name)}`;
		const definition = ctor.propertyMap.get(name);
		const type = definition?.type
		if (definition) {
			const previousValue = definition.initialValue
			const parameterValue = url.searchParams.get(parameter)

			// register the fact that this property is set by a query parameter
			if (parameterValue !== null) {
				definition.skipAsync = true
			}
			definition.initialValue = () => parse(parameterValue, type) ?? functionValue(previousValue);
			ctor.propertyMap.set(name, { ...definition, ...options })
			
			return undefined
			// For accessors (which have a descriptor on the prototype) we need to
			// return a descriptor, otherwise TypeScript overwrites the descriptor we
			// define in createProperty() with the original descriptor. We don't do this
			// for fields, which don't have a descriptor, because this could overwrite
			// descriptor defined by other decorators.
			// return hasOwnProperty
			// 	? Object.getOwnPropertyDescriptor(proto, name)
			// 	: undefined;
		}
	}

}

