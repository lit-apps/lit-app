import { describe, it, expect } from 'vitest';
import  distributeUniformly  from './distributeUniformly.js';

describe('distributeUniformly', () => {
  it('should return a number between 0 and n-1', () => {
    const n = 8;
    const seed = 'test-seed';
    const result = distributeUniformly(seed, n);
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThan(n);
  });

  it('should return consistent results for the same seed and n', () => {
    const n = 8;
    const seed = 'consistent-seed';
    const result1 = distributeUniformly(seed, n);
    const result2 = distributeUniformly(seed, n);
    expect(result1).toBe(result2);
  });

  it('should return different results for different seeds', () => {
    const n = 8;
    const seed1 = 'seed-one';
    const seed2 = 'seed-twotwo';
    const result1 = distributeUniformly(seed1, n);
    const result2 = distributeUniformly(seed2, n);
    expect(result1).not.toBe(result2);
  });

  it('should handle empty seed', () => {
    const n = 8;
    const seed = '';
    const result = distributeUniformly(seed, n);
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThan(n);
  });

  it('should handle very long seed', () => {
    const n = 8;
    const seed = 'a'.repeat(1000);
    const result = distributeUniformly(seed, n);
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThan(n);
  });

  it('should return uniformly distributed results for 10000 different random seeds', () => {
    const n = 8;
    const results = new Array(n).fill(0);
    for (let i = 0; i < 10000; i++) {
      const seed = Math.random().toString(36).substring(2, 15);
      const result = distributeUniformly(seed, n);
      results[result]++;
    }
    const average = 10000 / n;
    const tolerance = average * 0.2; // 20% tolerance
    // console.info('Results', results);
    results.forEach(count => {
      expect(count).toBeGreaterThanOrEqual(average - tolerance);
      expect(count).toBeLessThanOrEqual(average + tolerance);
    });
  });
});