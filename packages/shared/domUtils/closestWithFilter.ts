/**
 * Finds the closest ancestor of an element that matches the given filter function.
 * Like closestWithShadow(), this function pierces through shadow DOM boundaries,
 * but instead of using a CSS selector, it accepts a predicate function.
 * 
 * @param element - The element to start the search from.
 * @param filter - A function that tests each element, returning true if it matches.
 * @returns The closest ancestor element that passes the filter function, or null if none is found.
 * 
 * @example
 * // Find closest element that has a specific property
 * const dialog = closestWithFilter(event.target, el => el.hasAttribute('open'));
 * 
 * // Find closest element with a specific type
 * const form = closestWithFilter(inputElement, el => el instanceof HTMLFormElement);
 */
export default function closestWithFilter<T = any>(
  element: Element,
  filter: (element: Element & T) => boolean
): Element & T | null {
  while (element) {
    if (filter(element as any)) {
      return element as any;
    }
    // Navigate upward, crossing shadow DOM boundaries if needed
    element = element.parentElement || (element.getRootNode() as ShadowRoot).host;
  }
  return null;
}
