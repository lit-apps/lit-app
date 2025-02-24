/** Types utils used in other part of the app */

import type { Stripe } from 'stripe';


// import type {FirebaseFirestore} from 'firebase/firestore';

/**
 * Represents a custom HTML event with specific target and currentTarget types.
 *
 * @template T - The type of the event target, defaults to `HTMLElement`.
 * @template CT - The type of the event currentTarget, defaults to `HTMLElement`.
 */
export type HTMLEvent<
  T extends HTMLElement = HTMLElement,
  CT extends HTMLElement = HTMLElement> = Event & {
    target: T;
    currentTarget: CT;
  }

/**
 * Represents a custom HTML Custom event with specific target and currentTarget types.
 *
 * @template T - The type of the Custom event target, defaults to `HTMLElement`.
 * @template CT - The type of the Custom event currentTarget, defaults to `HTMLElement`.
 */
export type HTMLCustomEvent<
  T extends HTMLElement = HTMLElement,
  CT extends HTMLElement = HTMLElement> = CustomEvent & {
    target: T;
    currentTarget: CT;
  }

/**
 * A utility type that makes all properties of a given type `T` writable.
 * 
 * This type takes a type `T` and removes the `readonly` modifier from all its properties,
 * allowing them to be reassigned.
 * 
 * @template T - The type whose properties should be made writable.
 */
export type Writeable<T> = { -readonly [P in keyof T]: T[P] };

/**
 * Ensures that a given argument is neither `undefined` nor `null`.
 * Throws a `TypeError` with a provided message if the argument is invalid.
 *
 * @template T - The type of the argument.
 * @param {T | undefined | null} argument - The argument to check.
 * @param {string} [message='This value was promised to be there.'] - The error message to throw if the argument is invalid.
 * @returns {T} - The validated argument.
 * @throws {TypeError} - Throws if the argument is `undefined` or `null`.
 */
export function ensure<T>(argument: T | undefined | null, message: string = 'This value was promised to be there.'): T {
  if (argument === undefined || argument === null) {
    throw new TypeError(message);
  }
  return argument;
}

type Entries<T> = {
  [K in keyof Required<T>]: [K, T[K]]
}[keyof T][]


/**
 * Returns an array of a given object's own enumerable string-keyed property [key, value] pairs.
 * (see https://stackoverflow.com/questions/55012174/why-doesnt-object-keys-return-a-keyof-type-in-typescript/55012175#55012175)
 * 
 * @template T - The type of the object.
 * @param obj - The object whose enumerable own property [key, value] pairs are to be returned.
 * @returns An array of the object's own enumerable string-keyed property [key, value] pairs.
 */
export function entries<T extends object>(obj: T): Entries<Required<T>> {
  return Object.entries(obj) as any;
}

/**
 * Makes specified keys in a type optional while keeping the rest of the keys unchanged.
 *
 * @template T - The original type.
 * @template K - The keys within T that should be made optional.
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

/**
 * A type that represents a function parameter which distributes a type `T` to a function that returns type `R`.
 * 
 * This utility type uses conditional types to create a function type that takes an item of type `T` and returns a value of type `R`.
 * 
 * Not sure this is useful for functions
 * 
 * @template T - The type to be distributed.
 * @template R - The return type of the function.
 */
export type DistributeFunctionParamT<T, R> = T extends any ? ((item: T) => R) : never;

/**
 * Makes all properties in a type `T` recursively optional.
 *
 * @template T - The type to be made recursively optional.
 */
export type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends object ? RecursivePartial<T[P]> : T[P];
};

export type ProtoT<T, P> = T & { __proto__: P };
export type ProtoOfT<T extends { __proto__: any }> = T['__proto__'] extends infer P ? P : never;
/**
 * A utility type that extends a type `T` with another type `U`, ensuring that `U`'s properties are present in `T`.
 */
export type ProtoExtends<T, U> = U & Omit<T, keyof U>;

export type { MixinBase, MixinReturn } from './mixin/types.js';


/**
 * A utility type that makes all properties of a given type `T` writable, including nested objects.
 * We remove any document references from the type to avoid circular references.
 * 
 * This is used in models to make sure we only have appropriate keys. 
 * 
 * https://stackoverflow.com/questions/58434389/typescript-deep-keyof-0of-a-nested-object
 */
type DotPrefix<T extends string> = T extends "" ? "" : `.${T}`
type DocumentReference = {
  firestore: any
  path: string
  id: string
  parent: any
}
type ExcludedTypesT = Date | Function | Array<any> |
  DocumentReference | Stripe.Invoice | File
export type NestedKeys<T> = (
  T extends ExcludedTypesT ? "" : T extends object ?
  { [K in Exclude<keyof T, symbol>]: `${K}${DotPrefix<NestedKeys<T[K]>>}` }[Exclude<keyof T, symbol>]
  : "") extends infer D ? Extract<D, string> : never;

export type NestedValue<T, Key extends string> = Key extends `${infer K}.${infer Rest}` ?
  K extends keyof T ? NestedValue<T[K], Rest> : never :
  Key extends keyof T ? T[Key] : never;

// type Form = {
//   a: { b: string, c: number }
// }

// type FormKeys = NestedKeys<Form>
// const tes: NestedValue<Form, 'a.b'> = 'example'
// const tess: NestedValue<Form, 'a.c'> = 'example'

// type F = DistributeFunctionParamT<string | string[] | number, boolean>;
// const fn: F = (item: number) => item === 'a';

// type T1 = { a?: never; b: string };
// type T2 = { b?: never; a: string };
// type T = T1 | T2;
// type C = (T1 & { c: number }) | (T2 & { c: number });

// const c: C = { b: 'example', c: 1, a: 'example' };
// const t: T = { b: 'example' };

// function handleType(obj: T) {
//   if ('a' in obj) {
//     // obj is T2
//     console.log('T2:', obj.a);
//   } else if ('b' in obj) {
//     // obj is T1
//     console.log('T1:', obj.b);
//   } else {
//     throw new Error('Invalid type');
//   }
// }

// // Example usage
// const example1: T1 = { a: never, b: "example" };
// const example2: T2 = { b: never, a: "example" };

// handleType(example1); // Output: T1: example
// handleType(example2); // Output: T2: example