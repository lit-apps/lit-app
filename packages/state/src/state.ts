import { functionValue } from './functionValue.js';
import { StateEvent } from './state-event.js';
import { Hook } from './hook.js';
import { PropertyOptions } from './decorators/property.js';
import { StorageOptions } from './decorators/storage.js';
import { QueryOptions } from './decorators/query.js';

export interface HasChanged {
  (value: unknown, old: unknown): boolean;
}

export interface Unsubscribe {
  (): void
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
{ initialValue: any, hook?: { [key: string]: any }, resetValue: any }

/**
 * Callback function - used as callback subscription to a state change 
 */
export type Callback = (key: string, value: any, state: State) => void

/**
 * A state, firing `lit-state-change` when any of it property changes
 *  
 */
export class State extends EventTarget {

  // a map holding decorators definition.
  // it set in the @property decorator
  static propertyMap: Map<PropertyKey, PropertyMapOptions>

  static properties: PropertyOptions;
  static finalized: boolean = false;

  static initPropertyMap() {
    if (!this.propertyMap) {
      this.propertyMap = new Map<string, PropertyMapOptions>()
    }
  }
  
  get propertyMap() {
    return (this.constructor as typeof State).propertyMap
  }

  get stateValue() {
    return Object.fromEntries([...this.propertyMap].map(([key]) => [key, (this as {} as { [key: string]: unknown })[key as string]]))
  }

  // hold a reference to hooks
  hookMap: Map<string, Hook> = new Map()

  constructor() {
    super();
    (this.constructor as typeof State).finalize();
    // make sure all getter and setters are called once as some work is 
    // being done in @decorator getter and setter. For instance, @storage 
    // stores the value to local storage in setter.
    if (this.propertyMap) {
      [...this.propertyMap].forEach(([key, definition]) => {
        if (definition.initialValue !== undefined) {
          const value: any = functionValue(definition.initialValue);
          (this as {} as { [key: string]: unknown })[key as string] = value;
          definition.value = value;
        }
      })
    }
  }

  protected static finalize() {
    if (this.finalized) {
      return false;
    }
    this.finalized = true;
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
    name: PropertyKey,
    options?: PropertyOptions
  ) {
    // Note, since this can be called by the `@property` decorator which
    // is called before `finalize`, we ensure finalization has been kicked off.
    this.finalize();
    const key = typeof name === 'symbol' ? Symbol() : `__${name}`;
    const descriptor = this.getPropertyDescriptor(String(name), key, options);
    Object.defineProperty(this.prototype, name, descriptor);
  }

  protected static getPropertyDescriptor(
    name: string,
    key: PropertyKey,
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
   * Reset the state to its original values, skipping 
   * properties marked as skipReset
   */
  reset() {
    // reset all hooks first;
    this.hookMap.forEach(hook => hook.reset());

    [...this.propertyMap]
      // @ts-ignore
      .filter(([key, definition]) => !(definition.skipReset === true || definition.resetValue === undefined))
      .forEach(([key, definition]) => {
          (this as {} as { [key: string]: unknown })[key as string] = definition.resetValue;
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
  subscribe(callback: Callback, nameOrNames?: string | string[], options?: AddEventListenerOptions): Unsubscribe {

    if (nameOrNames && !Array.isArray(nameOrNames)) {
      nameOrNames = [nameOrNames]
    }
    const cb = (event: StateEvent) => {
      if (!nameOrNames || (nameOrNames as string[]).includes(event.key)) {
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


