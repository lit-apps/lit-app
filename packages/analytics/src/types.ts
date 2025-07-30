import { AllBuildEntitiesT } from "@lit-app/app-survey/src/entity/types.recursive.js";

export function getItemsOfType<T extends AllBuildEntitiesT>(
  item: AllBuildEntitiesT,
  type: T['type']
): ReadonlyArray<T> {
  if (!('data' in item)) {
    return [];
  }
  if (!('items' in item.data)) {
    return [];
  }
  return item.data.items.filter(item => item.type === type) as ReadonlyArray<T>;
}