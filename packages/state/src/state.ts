import { functionValue } from './functionValue';
import { StateEvent } from './state-event';
import { PropertyOptions } from './decorators/property';
import { StorageOptions } from './decorators/storage';
import { QueryOptions } from './decorators/query';

export interface HasChanged {
  (value: unknown, old: unknown): boolean;
}

/**
 * Change function that returns true if `value` is different from `oldValue`.
 * This method is used as the default for a property's `hasChanged` function.
 */
export const notEqual: HasChanged = (value: unknown, old: unknown): boolean => {
  // This ensures (old==NaN, value==NaN) always returns false
  return old !== value && (old === old || value === value);
};

export type PropertyMapOptions = PropertyOptions &
   StorageOptions &
   QueryOptions &
   { computedValue: unknown, hook?: {[key:string]: unknown}}

/**
 * Callback function - used as callback subscription to a state change 
 */
export type Callback = (key: string, value: unknown, state: State) => void

/**
 * A state, fireing `lit-state-change` when any of it property changes
 *  
 */
export class State extends EventTarget {

  // a map holding decorators definition.
  static propertyMap: Map<string, PropertyMapOptions>
    
  static properties: PropertyOptions;
  static finalized: boolean = false;

  get propertyMap() {
   return (this.constructor as typeof State).propertyMap
  }

  constructor() {
    super();
    (this.constructor as typeof State).finalize();
    // make sure all getter and setters are called once as some owrk is 
    // being done in @decorator getter and setter. For instance, @storage 
    // stores the value to local storage in setter.
    if(this.propertyMap) {
      [...this.propertyMap].forEach(([key, definition]) => {
        if (definition.computedValue !== undefined) {
          (this as {} as { [key: string]: unknown })[key as string] = functionValue(definition.computedValue)
        }
      })
    }
  }

  protected static finalize() {
    if (this.finalized) {
      return false;
    }
    this.finalized = true;
    // finalize any superclasses
    // const superCtor = Object.getPrototypeOf(this) as typeof ReactiveElement;
    // superCtor.finalize();
    const propKeys = Object.keys(this.properties || {})
    // This for/of is ok because propKeys is an array
    for (const p of propKeys) {
      // note, use of `any` is due to TypeScript lack of support for symbol in
      // index types
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.createProperty(p, (this.properties as any)[p]);
    }
    return true
  }

  static createProperty(
    name: string,
    options?: PropertyOptions
  ) {
    // Note, since this can be called by the `@property` decorator which
    // is called before `finalize`, we ensure finalization has been kicked off.
    this.finalize();
    const key = typeof name === 'symbol' ? Symbol() : `__${name}`;
    const descriptor = this.getPropertyDescriptor(name, key, options);
    Object.defineProperty(this.prototype, name, descriptor);
  }

  protected static getPropertyDescriptor(
    name: string,
    key: string | symbol,
    options?: PropertyOptions
  ): PropertyDescriptor {
    const hasChanged = options?.hasChanged || notEqual

    return {
      get(): unknown { return (this as {} as { [key: string]: unknown })[key as string] },
      set(this: State, value: unknown) {
        const oldValue = (this as {} as { [key: string]: unknown })[
          name as string
        ];
        (this as {} as { [key: string]: unknown })[key as string] = value;
        if (hasChanged(value, oldValue) === true) {
          this.dispatchStateEvent(name, value, this);
        };
      },
      configurable: true,
      enumerable: true,
    };

  }

  /**
   * Reset the state to hte original values, skipping 
   * properties marked as skipReset
   */
  reset() {
    [...this.propertyMap]
      // @ts-ignore
      .filter(([key, definition]) => definition.skipReset !== true )
      .forEach(([key, definition]) => {
        if (definition.computedValue !== undefined) {
          (this as {} as { [key: string]: unknown })[key as string] = functionValue(definition.computedValue)
        }
      })
  }

  /**
   * subscribe to state change event. The callback will be called anytime 
   * a state property change if `nameOrNames` is undefined, or only for matching
   * property values specified by `nameOrNames`
   * @param callback the callback function to call
   * @param nameOrNames 
   * @returns a unsubscribe function. 
   */
  subscribe(callback: Callback, nameOrNames?: string | string[], options?: AddEventListenerOptions ): () => void {
    
    if (nameOrNames && !Array.isArray(nameOrNames)) {
      nameOrNames = [nameOrNames]
    }
    const cb = (event: StateEvent) => {
      if(!nameOrNames || (nameOrNames as string[]).includes(event.key)) {
        callback(event.key, event.value, this)
      }
    }
    this.addEventListener(StateEvent.eventName, cb as EventListener, options) 
    return () => this.removeEventListener(StateEvent.eventName, cb as EventListener) 
  }

  private dispatchStateEvent(key: string, eventValue: unknown, state: State) {
    this.dispatchEvent(new StateEvent(key, eventValue, state))
  }
}


