
import { State } from '../state.js'

export type PropertyTypes = Array<unknown> | Boolean | Object | String | Number
/**
 * Defines options for a property.
 */
export type PropertyOptions = {

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

export function property(
  options?: PropertyOptions,

) {
  return (
    proto: State,
    name: PropertyKey
  ): void => {

    if (Object.getOwnPropertyDescriptor(proto, name)) {
      throw new Error('@property must be called before all state decorators')
    };
    const ctor = (proto).constructor as typeof State;
    ctor.initPropertyMap()
    const hasOwnProperty = proto.hasOwnProperty(name);
    ctor.propertyMap.set(name, {
      ...options,
      ...{ initialValue: options?.value, resetValue: options?.value }
    })
    ctor.createProperty(name, options);

    // For accessors (which have a descriptor on the prototype) we need to
    // return a descriptor, otherwise TypeScript overwrites the descriptor we
    // define in createProperty() with the original descriptor. We don't do this
    // for fields, which don't have a descriptor, because this could overwrite
    // descriptor defined by other decorators.
    // @ts-ignore
    return hasOwnProperty
      ? Object.getOwnPropertyDescriptor(proto, name)
      : undefined;
  }

}
