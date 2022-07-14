/**
 * Returns a value it is is a val;ue, 
 * or the result of the function if is is a function
 * @param value a value or a function
 * @returns a value
 */
export function functionValue(value: unknown): unknown {
  return typeof value === 'function' ? value() : value;
}
