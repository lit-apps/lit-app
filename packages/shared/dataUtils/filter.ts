


import { deepget } from './deep';
import normalizeEmptyValue from './normalizeEmptyValue';

export type FilterT = {
  path: string
  value: string
}

export default function filter(items: any[] | undefined | null, filters: FilterT[]) {
  if (!items) {
    return [];
  }
  return items.filter((item) => {
    return filters.filter(filter => {
      const value = normalizeEmptyValue(deepget(item, filter.path));
      const filterValueLowercase = normalizeEmptyValue(filter.value).toString().toLowerCase();
      return value.toString().toLowerCase().indexOf(filterValueLowercase) === -1;
    }).length === 0;
  });
}
