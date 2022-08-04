/**
 * Returns a value if it is a value, 
 * or the result of the function if is is a function
 * @param value a value or a function
 * @returns a value
 */
export function functionValue(value: unknown): unknown {
  return typeof value === 'function' ? value() : value;
}
