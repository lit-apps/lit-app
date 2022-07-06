export function functionValue(value: unknown): unknown {
  return typeof value === 'function' ? value() : value;
}
