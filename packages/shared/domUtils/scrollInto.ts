import { LitElement } from "lit";

/**
 * Scrolls to a specified element within a LitElement's shadow DOM and focuses on it.
 *
 * @param selector - A string representing the CSS selector of the target element to scroll to.
 * @param el - The LitElement instance containing the target element within its shadow DOM.
 * @returns An asynchronous event handler function that prevents the default event behavior,
 *          stops event propagation, scrolls to the target element smoothly, and focuses on it.
 */
export function scrollInto(selector: string, el: LitElement) {
  return async (ev: Event) => {
    ev.preventDefault();
    ev.stopPropagation();
    const target = el.renderRoot?.querySelector(selector)
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    (target as HTMLElement).focus({ preventScroll: true });
  }
}