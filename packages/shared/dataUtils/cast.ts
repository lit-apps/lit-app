/**
 * Cast a value to a specific type
 * @param value The value to cast
 * @param type The type to cast to ('string', 'number', 'boolean', 'date', 'array')
 * @returns The casted value
 */
export function cast(value: unknown, type: 'string' | 'number' | 'boolean' | 'date' | 'array'):
  string | number | boolean | Date | unknown {
  if (value === null || value === undefined) {
    return value;
  }

  switch (type) {
    case 'string':
      return String(value);
    case 'number':
      const num = Number(value);
      return isNaN(num) ? 0 : num;
    case 'boolean':
      if (typeof value === 'string') {
        return value.toLowerCase() === 'true' || value === '1';
      }
      return Boolean(value);
    case 'date':
      if (value instanceof Date) return value;
      const date = new Date(value as string | number);
      return isNaN(date.getTime()) ? null : date;
    case 'array':
      if (Array.isArray(value)) return value;
      return [value];
    default:
      return value;
  }
}