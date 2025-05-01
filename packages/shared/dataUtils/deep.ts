import { NestedKeys } from "../types.js";

type ActionT = <T = any>(obj: unknown, id: string) => T;

/**
 * Applies a deep action on an object based on a given path.
 * 
 * @param action - The action to be applied on the object.
 * @param obj - The object to apply the action on.
 * @param keys - The path to the property in the object.
 * @returns The result of applying the action on the object.
 */
export const deep = (action: ActionT, obj: any, keys: string) => {
  const k = keys.split('.');
  const id = k.splice(-1, 1)[0];
  for (const key in k)
    obj = obj[k[key]] = obj[k[key]] || {};
  return action(obj, id);
};

// export const deep = (action: ActionT, obj: unknown, keys: string | string[], id?: string[], key?: string) => {
//   keys = Array.isArray(keys) ? keys : keys.split('.');
//   id = keys.splice(-1, 1);
//   for (key in keys) obj = (obj as any)[keys[key]] = (obj as any)[keys[key]] || {};
//   // this works as a['b'] == a[['b']]
//   return action(obj, id as unknown as string);
// };


/**
 * Applies a deep action on an object based on a given path, but maintains immutability.
 * Creates new objects along the path instead of mutating the original.
 * 
 * @param action - The action to be applied on the object.
 * @param obj - The object to apply the action on.
 * @param keys - The path to the property in the object.
 * @returns A new object with the action applied at the specified path.
 */
export const deepPure = (action: ActionT, obj: unknown, keys: string | string[]): any => {
  keys = Array.isArray(keys) ? keys : keys.split('.');
  if (keys.length === 0) {
    return obj;
  }

  const [currentKey, ...remainingKeys] = keys;

  if (remainingKeys.length === 0) {
    // We've reached the end of the path, apply the action
    return action(obj, currentKey)
    //   ...(obj as object || {}),
    //   [currentKey]: 
    // };
  }

  // Continue down the path with a recursive call
  return deepPure(
    action,
    (obj as any)?.[currentKey] || {},
    remainingKeys
  )
};

const _get = (obj: any, prop: string) => obj[prop];
const _set = (n: any) => (obj: any, prop: string) => (obj[prop] = n);
// const _setOwnProperty = (n: any) => (obj: any, prop: string) => Object.defineProperty(obj, prop, { value: n, writable: true, enumerable: true, configurable: true });

/**
 * get a deep nested property
 * @param path the deep path to the property
 * @param obj the object to get the property from
 * @returns the value of the property at the given path
 */
// export const get = <D extends object, P extends NestedKeys<D>>(path: P, obj: D): NestedValue<D,P> => deep(_get, obj, path);
export const get = <D extends object>(path: NestedKeys<D>, obj: D) => deepPure(_get, obj, path);

/**
 * set a deep nested property
 * @param path the deep path to the property
 * @param value the value to set
 * @param obj the object to get the property from
 * @returns 
 */
export const set = <D extends object>(path: NestedKeys<D>, value: unknown, obj: D) => deep(_set(value), obj, path);