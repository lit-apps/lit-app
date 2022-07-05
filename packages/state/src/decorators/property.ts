
import { PropertyDeclaration, State, PropertyTypes} from '../state'
import { decorateProperty } from '@lit/reactive-element/decorators/base.js';

export type propertySignature = (protoOrDescriptor: State, name?: PropertyKey | undefined) => any

export function property(options?: PropertyDeclaration) {
	console.info('property options',options)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return decorateProperty({
		// @ts-ignore ctor is typof State and not typeof ReactiveElement
    finisher: (ctor: typeof State, name: PropertyKey) => {
      if(Object.getOwnPropertyDescriptor(ctor.prototype, name)) {
				throw new Error('@property must be called before all state decorators')
			};
			if(!ctor.typeMap) {
				ctor.typeMap = new Map<PropertyKey, PropertyTypes>()
			}
			if(options?.type) {
				ctor.typeMap.set(name, options.type)
			}
			return ctor.createProperty(name, options )
    }
	}) as unknown as propertySignature
    
}
