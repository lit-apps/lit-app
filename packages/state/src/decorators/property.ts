
import { State, PropertyMapOptions} from '../state.js'
import { decorateProperty } from '@lit/reactive-element/decorators/base.js';

export type PropertyTypes = Array<unknown> | Boolean | Object | String | Number
/**
 * Defines options for a property.
 */
export type PropertyOptions =  {

  /**
   * The value to initiate the state with
   */
  value?: unknown;

  /**
   * State.reset reset all property values to their initial {value: value}
   * value. This is not the wanted behavior in some cases. For instance, we can
   * have a state property for language, with an initial value (english). The 
   * state will be reset on user sign-out, but we want to keep the actual 
   * state value for language, if the user has modified it. 
   */
  skipReset?: boolean

  /** 
   * the type of the property. Used to Stringify/parse depending on wich 
   * other decorators are in use. For instance, @storage strignify before
   * storing to localStorage. 
   */
  type?: PropertyTypes;

  /**
   * A function that indicates if a property should be considered changed when
   * it is set. The function should take the `newValue` and `oldValue` and
   * return `true` if an update should be requested.
   */
  hasChanged?(value: unknown, oldValue: unknown): boolean;
}

export type PropertySignature = (protoOrDescriptor: State, name?: string | undefined) => any

export function property(options?: PropertyOptions) {
	// console.info('property options',options)
  return decorateProperty({
		// @ts-ignore ctor is typof State and not typeof ReactiveElement
    finisher: (ctor: typeof State, name: string) => {
			// console.info('property ', name)

      if(Object.getOwnPropertyDescriptor(ctor.prototype, name)) {
				throw new Error('@property must be called before all state decorators')
			};

			if(!ctor.propertyMap) {
				ctor.propertyMap = new Map<string, PropertyMapOptions>()
			}
			ctor.propertyMap.set(name, {...options, ...{initialValue: options?.value, resetValue: options?.value}}) 
			return ctor.createProperty(name, options )
    }
	}) as unknown as PropertySignature
    
}
