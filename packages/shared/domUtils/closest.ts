/**
 * Finds the closest ancestor of an element that matches the given selector.
 * In contrast to Element.closest(), this function pierces through shadow DOM boundaries.
 * 
 * @param element - The element to start the search from.
 * @param selector - The CSS selector to match against.
 * @returns The closest ancestor element that matches the selector, or null if no match is found.
 */
export default function closestWithShadow<T = Element>(element: Element, selector: string): T | null {
	while (element) {
		if (element.matches(selector)) {
			return element as T;
		}
		element = element.parentElement || (element.getRootNode() as ShadowRoot).host;
	}
	return null;
}
