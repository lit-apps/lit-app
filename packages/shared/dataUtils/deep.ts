

/**
 * Applies a deep action on an object based on a given path.
 * 
 * @param action - The action to be applied on the object.
 * @param obj - The object to apply the action on.
 * @param keys - The path to the property in the object.
 * @returns The result of applying the action on the object.
 */
const deep = (action, obj, keys, id, key) => {
  keys = keys.split('.');
  id = keys.splice(-1, 1);
  for (key in keys) obj = obj[keys[key]] = obj[keys[key]] || {};
  return action(obj, id);
};
const get = (obj, prop) => obj[prop];
const deepget = (obj, path) => deep(get, obj, path);

export {
  deep,
  deepget
}