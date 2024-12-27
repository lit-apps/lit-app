
type ActionT= (obj: unknown, id: string ) => unknown;

/**
 * Applies a deep action on an object based on a given path.
 * 
 * @param action - The action to be applied on the object.
 * @param obj - The object to apply the action on.
 * @param keys - The path to the property in the object.
 * @returns The result of applying the action on the object.
 */
const deep = (action: ActionT, obj: unknown, keys: string | string[], id?: string[], key?: string) => {
  keys = (keys as string).split('.');
  id = keys.splice(-1, 1);
  for (key in keys) obj = (obj as any)[keys[key]] = (obj as any)[keys[key]] || {};
  return action(obj, id );
};
const get = (obj: any, prop: string ) => obj[prop];
const deepget = (obj: any, path: string) => deep(get, obj, path);

export {
  deep,
  deepget
}