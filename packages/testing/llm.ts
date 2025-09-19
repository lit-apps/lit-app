/**
 * Normalizes a string by converting it to lowercase, removing punctuation, and trimming whitespace.
 * @param text The string to normalize.
 * @returns The normalized string.
 */
const normalizeText = (text?: string): string => {
  if (!text) return '';
  return text.toLowerCase().replace(/[?.,!]/g, '').replace(/\s+/g, ' ').trim();
};

/**
 * Recursively checks if two form items are semantically similar.
 * 
 * This is useful for validating AI-generated content where exact matches are unlikely,
 * but semantic equivalence is desired.
 * 
 * @param actual The actual generated item.
 * @param expected The expected item.
 * @returns True if the items are similar, false otherwise.
 */
function areItemsSimilar(actual: any, expected: any): boolean {
  if (actual.type !== expected.type || actual.subType !== expected.subType) {
    console.log(`Type mismatch: actual=${actual.type}/${actual.subType}, expected=${expected.type}/${expected.subType}`);
    return false;
  }

  if (normalizeText(actual.locale?.label) !== normalizeText(expected.locale?.label)) {
    console.log(`Label mismatch: actual='${normalizeText(actual.locale?.label)}', expected='${normalizeText(expected.locale?.label)}'`);
    return false;
  }

  const actualItems = actual.items || [];
  const expectedItems = expected.items || [];

  if (actualItems.length !== expectedItems.length) {
    console.log(`Item count mismatch: actual=${actualItems.length}, expected=${expectedItems.length}`);
    return false;
  }

  // Recursively check sub-items
  for (let i = 0; i < expectedItems.length; i++) {
    if (!areItemsSimilar(actualItems[i], expectedItems[i])) {
      return false;
    }
  }

  return true;
}

export { areItemsSimilar, normalizeText }; 