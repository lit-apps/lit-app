
const cache = new Map<string, number>();

/**
 * Distributes a given seed uniformly across a range of numbers.
 *
 * This function takes a string seed and a number `n`, and returns a number
 * between 0 and `n-1` based on a hash of the seed. The seed is truncated
 * to the last 10 characters to ensure a consistent hash length.
 *
 * @param seed - The input string used to generate a hash.
 * @param n - The range within which the result should fall (0 to `n-1`).
 * @returns A number between 0 and `n-1` based on the hashed seed.
 */
export default function distributeUniformly(seed: string, n: number): number {
  if (cache.has(seed+n)) {
    return cache.get(seed+n)!;
  }
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const random = (hash >>> 0) / 4294967295;
  const result = Math.floor(random * n);
  cache.set(seed+n, result);
  return result;
}
