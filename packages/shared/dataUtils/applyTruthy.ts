/**
 * Applies properties from multiple partial objects to a single result object,
 * only including properties with truthy values.
 *
 * @param args - An array of partial objects to merge. Properties from later objects
 *               will overwrite properties from earlier objects if they have truthy values.
 * @returns A new object with properties from the input objects that have truthy values.
 *          The return type is the fully defined type `T`.
 *
 * @typeParam T - The type of the object to create, defaults to `object`.
 */
export function applyTruthy<T extends object = object>(...args: (Partial<T>)[]): T {
  const result: Partial<T> = {};

  for (const arg of args) {
    if (arg && typeof arg === 'object') {
      for (const [key, value] of Object.entries(arg)) {
        if (value) {
          (result as any)[key] = value;
        }
      }
    }
  }

  return result as T;
}