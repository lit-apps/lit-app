
export type action = (obj: any, id: string) => any;
/**
 *  @deprecated - use dataUtils/set instead
 */
export const deep = (action: action, obj: any, keys: string) => {
  const k = keys.split('.');
  const id = k.splice(-1, 1)[0];
  for (const key in k)
    obj = obj[k[key]] = obj[k[key]] || {};
  return action(obj, id);
};
const _get = (obj: any, prop: string) => obj[prop];
const _set = (n: any) => (obj: any, prop: string) => (obj[prop] = n);

/**
 * get a deep nested property
 * @param path the deep path to the property
 * @param obj the object to get the property from
 * @returns the value of the property at the given path
 * @deprecated - use dataUtils/get instead
 */
export const get = (path: string, obj: any = {}) => deep(_get, obj, path);

/**
 * set a deep nested property
 * @param path the deep path to the property
 * @param value the value to set
 * @param obj the object to get the property from
 * @returns 
 * @deprecated - use dataUtils/set instead
 */
export const set = (path: string, value: any, obj: any) => deep(_set(value), obj, path);