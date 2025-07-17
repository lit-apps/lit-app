/**
 * Returns the deepest active element, traversing into shadow roots if necessary.
 */
export function deepActiveElement(doc: Document | ShadowRoot = document): Element | null {
  let activeElement = doc.activeElement;
  while (activeElement && activeElement.shadowRoot && activeElement.shadowRoot.activeElement) {
    activeElement = activeElement.shadowRoot.activeElement;
  }
  return activeElement;
}