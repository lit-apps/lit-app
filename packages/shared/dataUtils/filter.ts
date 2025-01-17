


import { get } from './deep';
import normalizeEmptyValue from './normalizeEmptyValue';

export type FilterT = {
  path: string
  value: string
}

export default function filter(items: object[] | undefined | null, filters: FilterT[]) {
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
