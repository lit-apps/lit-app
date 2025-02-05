
/**
 * A template function that allows for string interpolation with named or indexed keys.
 *
 * @param {TemplateStringsArray} strings - The template strings array.
 * @param {...any[]} keys - The keys used for interpolation, which can be either integers (for indexed values) or strings (for named values).
 * @returns {Function} - A function that takes values for the keys and returns the interpolated string.
 *
 * @example
 * const t = template`Hello, ${'name'}! You have ${0} new messages.`;
 * console.log(t({ name: 'Alice' }, 5)); // "Hello, Alice! You have 5 new messages."
 */
export function template<T extends Record<string, any>>(strings: TemplateStringsArray, ...keys: (keyof T | number)[]) {
  return (...values: any[]) => {
    const dict = values[values.length - 1] || {};
    const result = [strings[0]];
    keys.forEach((key, i) => {
      const value = typeof key === 'number' ? values[key] : dict[key as keyof T];
      result.push(value, strings[i + 1]);
    });
    return result.join("");
  };
}