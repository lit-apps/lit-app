import { SpreadEventsDirective } from "@open-wc/lit-helpers";
import { directive } from "lit/directive.js";
type EventListenerWithOptions = EventListenerOrEventListenerObject &
  Partial<AddEventListenerOptions>;

export class SpreadDirective extends SpreadEventsDirective {
  override apply(data: { [key: string]: unknown }) {
    if (!data) return;
    const { prevData, element } = this;
    for (const key in data) {
      const value = data[key];
      if (value === prevData[key]) {
        continue;
      }
      const name = key.slice(1);
      switch (key[0]) {
        case '@': // event listener
          this.eventData[name] = value;
          this.applyEvent(name, value as EventListenerWithOptions);
          break;
        case '&': // property
          if (value != null) {
            element.setAttribute(name, String(value));
          } else {
            element.removeAttribute(name);
          }
          break;

        case '?': // boolean attribute
          if (value) {
            element.setAttribute(name, '');
          } else {
            element.removeAttribute(name);
          }
          break;
        default:
          // standard attribute
          // @ts-expect-error - element is not typed
          element[key] = value;
      }
    }
  }

  override groom(data: { [key: string]: unknown }) {
    const { prevData, element } = this;
    if (!prevData) return;
    for (const key in prevData) {
      const name = key.slice(1);
      if (!data || (!(key in data) && (element as any)[name] === prevData[key])) {
        switch (key[0]) {
          case '@': // event listener
            this.groomEvent(name, prevData[key] as EventListenerWithOptions)
            break;
          case '&':
            // standard attribute
            element.removeAttribute(name);
            break;
          case '?': // boolean attribute
            element.removeAttribute(name);
            break;
          default:
            // property
            // @ts-expect-error - 
            element[key] = undefined;
            break;
        }
      }
    }
  }
}


/**
 * A Lit directive that spreads properties, attributes, and event listeners onto an element.
 *
 * It is a different version of the `SpreadPropsDirective` from `@open-wc/lit-helpers` in the sense **that it
 * set values as default and not attributes**.
 * 
 * Attributes value MUST start with `&`
 * 
 * This directive provides a declarative way to apply a set of values to an element
 * from a single object. The keys of the object use special prefixes to determine
 * how the corresponding values are set on the element.
 *
 * - **`@` prefix: ** Sets an event listener. The key (without the prefix) is the event name.
 *   Example: `{'@click': this.handleClick}`
 * - **`&` prefix: ** Sets a standard attribute. The value is converted to a string. If the
 *   value is `null` or `undefined`, the attribute is removed.
 *   Example: `{'&aria-label': 'description'}`
 * - **`?` prefix: ** Sets a boolean attribute. The attribute is added if the value is truthy
 *   and removed if falsy.
 *   Example: `{'?disabled': this.isDisabled}`
 * - No prefix: ** Sets a property on the element.
 *   Example: `{'myProp': 'value'}`
 * 
 *
 * The directive efficiently updates the element by only applying changes from the
 * previous render and cleaning up any properties, attributes, or listeners that
 * are no longer specified.
 *
 * @example
 * ```html
 * <button ${spread({
 *   'myProperty': 'some-value',
 *   '?disabled': true,
 *   '&aria-label': 'Click me',
 *   '@click': (e) => console.log('clicked', e)
 * })}>Click Me</button>
 * ```
 */
export const spread = directive(SpreadDirective);