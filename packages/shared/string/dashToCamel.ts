const map: { [key: string]: string } = {};
const DASH_TO_CAMEL = /-[a-z]/g;

/**
 * Converts a dash-separated string to camelCase.
 * 
 * This function takes a string with dash-separated words and converts it to camelCase.
 * If the input string is empty, it returns an empty string.
 * 
 * @param dash - The dash-separated string to convert.
 * @returns The camelCase version of the input string.
 */
export const dashToCamel = (dash: string): string => {
  if (!dash) {
    return '';
  }
  return map[dash] || (
    map[dash] = dash.indexOf('-') < 0 ? dash : dash.replace(DASH_TO_CAMEL,
      (m) => m[1].toUpperCase()
    )
  );
};
