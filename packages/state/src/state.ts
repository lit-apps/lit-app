import { LitStateEvent } from './state-event';

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


/**
 * Defines options for a property accessor.
 */
export interface PropertyDeclaration<Type = unknown> {
  
  /**
   * The value to initiate the state with
   */
  value?: unknown;

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
  hasChanged?(value: Type, oldValue: Type): boolean;
}

/**
 * Map of properties to PropertyDeclaration options. For each property an
 * accessor is made, and the property is processed according to the
 * PropertyDeclaration options.
 */
export interface PropertyDeclarations {
  readonly [key: string]: PropertyDeclaration ;
}

// type callback =  {default: (value: unknown, unsubscribe?: () => void) => void, unsubscribe: () => void}
// type callback = {
//   (key: PropertyKey, value: unknown, state: State, unsubscribe?: () => void): void,
//   unsubscribe: () => void
// }

export type PropertyTypes = Array<unknown> | Boolean | Object | String | Number
/**
 * A state, fireing `lit-state-change` when any of it property changes
 *  
 */
export class State extends EventTarget {

  // subscriptionMap = new Map<PropertyKey, callback[] | null | undefined>()
  static typeMap: Map<PropertyKey, PropertyTypes>

  static properties: PropertyDeclarations;
  static finalized: boolean = false;

  constructor() {
    super();
    (this.constructor as typeof State).finalize();
    // make sure all getter and setters are called once as some owrk is 
    // being done in @decorator getter and setter. For instance, @storage 
    // stores the value to local storage in setter. 
    this.propertyKeys.forEach((key: PropertyKey) => {
      (this as {} as {[key: string]: unknown})[key as string] = (this as {} as {[key: string]: unknown})[key as string];
    })
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
    name: PropertyKey,
    options?: PropertyDeclaration
  ) {
    // Note, since this can be called by the `@property` decorator which
    // is called before `finalize`, we ensure finalization has been kicked off.
    this.finalize();
    const key = typeof name === 'symbol' ? Symbol() : `__${name}`;
    const descriptor = this.getPropertyDescriptor(name, key, options);
    Object.defineProperty(this.prototype, name, descriptor);
  }

  protected static getPropertyDescriptor(
    name: PropertyKey,
    key: string | symbol,
    options?: PropertyDeclaration
  ): PropertyDescriptor {
    const hasChanged = options?.hasChanged || notEqual
    const value = options?.value
    const descriptor = {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      get(): any {
        return (this as { [key: string]: unknown })[key as string];
      },
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
    const get = function (this: PropertyDescriptor) { return (this as { [key: string]: unknown })[key as string] };
    let initiated = false
    const valueGet = function (this: PropertyDescriptor) {
      if (!initiated) {
        initiated = true;
        // set value the first time we read
        (this as {} as { [key: string]: unknown })[key as string] = value;
      }
      return get.call(this)
    };
    descriptor.get = value !== undefined ? valueGet : get
    return descriptor
  }

  get propertyKeys(): PropertyKey[] {
    const Cls = <typeof State>this.constructor;
    return [...new Set([
      ...Object.keys(Cls.properties || {}),
      ...ancestors(this)
    ])]
  }

  private dispatchStateEvent(key: PropertyKey, eventValue: unknown, state: State) {
    this.dispatchEvent(new LitStateEvent(key, eventValue, state))
  }
}


function ancestors(obj: Object) {
  let keys: string[] = [];
  while (obj = Object.getPrototypeOf(obj)) {
    if (obj.constructor === State) {
      break;
    }
    if (obj && obj.constructor) {
      keys = keys.concat(Object.keys(obj));
    }
  }
  return keys;
};

