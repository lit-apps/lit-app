/**
 * Recursively searches for an item in a cache structure that matches the given predicate.
 *
 * The cache consists of an array of items and optional sub-caches, which are themselves caches.
 * The function traverses the items in the current cache and, if not found, recursively searches in sub-caches.
 *
 * @typeParam T - The type of items stored in the cache.
 * @param cache - The cache object containing items and optional sub-caches.
 * @param predicate - A function that tests each item for a condition.
 * @returns The first item that matches the predicate, or `undefined` if no such item is found.
 */
export function findInCache<T>(
  cache: { items: T[]; subCaches?: { [key: number]: typeof cache } },
  predicate: (item: T) => boolean
): T | undefined {
  for (const item of cache.items) {
    if (predicate(item)) {
      return item;
    }
  }
  if (cache.subCaches) {
    for (const key in cache.subCaches) {
      const found = findInCache(cache.subCaches[key], predicate);
      if (found) {
        return found;
      }
    }
  }
  return undefined;
}