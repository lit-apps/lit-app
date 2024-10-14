/**
 * Converts an object or string value to a string representation.
 * If the input is an object and has only one key, it recursively converts nested objects to dot-separated strings.
 * If the input is already a string, it returns the input as is.
 * 
 * This is meant to be used against snapshot.value:
 * 
 * ```
 * {stateName: 'pending'} => 'stateName.pending'
 * ```
 *
 * @param obj - The object or string value to convert.
 * @returns The string representation of the input value.
 */

const convertValueToKey = (obj: object | string): string => {
  if (typeof obj === 'string') return obj;
  const keys = Object.keys(obj);
  if (keys.length === 1) {
    const key = keys[0];
    const value = (obj as { [key: string]: string | object })[key];
    if (typeof value === 'object') {
      return `${key}.${convertValueToKey(value)}`;
    } else {
      return `${key}.${value}`;
    }
  } else {
    return JSON.stringify(obj);
  }
};
export default convertValueToKey;
