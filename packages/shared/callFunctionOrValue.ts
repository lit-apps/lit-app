/**
 * Calls the given input if it is a function, otherwise returns the input value.
 *
 * For types to work correctly, this should be passed through `bind` ( `call`does not set the correct response type)
 * 
 * `const callFunction = callFunctionOrValue.bind(this)`
 * 
 * @template T - The type of the input and return value.
 * @param {T | ((...args: any[]) => T)} input - The input value or function to be called.
 * @param {...any[]} args - The arguments to pass to the function if the input is a function.
 * @returns {T} - The result of the function call or the input value.
 */
export function callFunctionOrValue<T>(this: unknown, input: T | ((...args: any[]) => T), ...args: any[]): T {
  if (typeof input === 'function') {
    return (input as (...args: any[]) => T).apply(this, args);
  }
  return input;
}

