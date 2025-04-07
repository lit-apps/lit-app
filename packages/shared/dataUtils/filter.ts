


import { NestedKeys } from '../types.js';
import { get } from './deep';
import normalizeEmptyValue from './normalizeEmptyValue';

export type FilterT<T> = {
  path: NestedKeys<T>
  value: T
}

export function filter<T extends object = any>(items: T[] | undefined | null, filters: FilterT<T>[]) {
  if (!items) {
    return [];
  }
  return items.filter((item) => {
    return filters.filter(f => {
      const value = normalizeEmptyValue(get(f.path, item));
      const filterValueLowercase = normalizeEmptyValue(f.value).toString().toLowerCase();
      return value.toString().toLowerCase().indexOf(filterValueLowercase) === -1;
    }).length === 0;
  });
}
