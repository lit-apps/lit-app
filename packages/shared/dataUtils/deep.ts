
type ActionT = (obj: unknown, id: string) => unknown;

/**
 * Applies a deep action on an object based on a given path.
 * 
 * @param action - The action to be applied on the object.
 * @param obj - The object to apply the action on.
 * @param keys - The path to the property in the object.
 * @returns The result of applying the action on the object.
 */
export const deep = (action: ActionT, obj: unknown, keys: string | string[], id?: string[], key?: string) => {
  keys = (keys as string).split('.');
  id = keys.splice(-1, 1);
  for (key in keys) obj = (obj as any)[keys[key]] = (obj as any)[keys[key]] || {};
  // this works as a['b'] == a[['b']]
  return action(obj, id as unknown as string);
};

const _get = (obj: any, prop: string) => obj[prop];
const _set = (n: any) => (obj: any, prop: string) => (obj[prop] = n);

/**
 * get a deep nested property
 * @param path the deep path to the property
 * @param obj the object to get the property from
 * @returns the value of the property at the given path
 */
export const get = (path: string, obj: any = {}) => deep(_get, obj, path);

/**
 * set a deep nested property
 * @param path the deep path to the property
 * @param value the value to set
 * @param obj the object to get the property from
 * @returns 
 */
export const set = (path: string, value: any, obj: any) => deep(_set(value), obj, path);