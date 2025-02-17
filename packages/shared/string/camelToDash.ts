const map: { [key: string]: string } = {};
const CAMEL_TO_DASH = /([A-Z])/g;

/**
 * Converts a camelCase string to a dash-case string.
 *
 * @param camel - The camelCase string to be converted.
 * @returns The converted dash-case string. If the input is an empty string, returns an empty string.
 */
export const camelToDash = (camel: string): string => {
  if (!camel) {
    return '';
  }
  return map[camel] || (
    map[camel] = camel.replace(CAMEL_TO_DASH, '-$1').toLowerCase()
  );
};
