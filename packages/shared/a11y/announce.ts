import { animationFrame } from '@vaadin/component-base/src/async.js';
import { Debouncer } from '@vaadin/component-base/src/debounce.js';
import { TemplateResult, render } from 'lit';

/** 
 * This is an adaptation of vaadin/a11y-announcer.
 * 
 * It allows to announce a message to screen readers.
 * Here, can also pass a TemplateResult to be rendered.
 */

type Options = { mode?: 'alert' | 'assertive' | 'polite'; timeout?: number }
const region = document.createElement('div');

region.style.position = 'fixed';
region.style.clip = 'rect(0px, 0px, 0px, 0px)';
region.setAttribute('aria-live', 'polite');

document.body.appendChild(region);
let alertDebouncer: any;
/**
* Cause a text string to be announced by screen readers.
*
* @param {string} text The text that should be announced by the screen reader.
* @param {{mode?: string, timeout?: number}} options Additional options.
*/
export function announce(text: string | TemplateResult, options: Options = {}) {
  const mode = options.mode || 'polite';
  const timeout = options.timeout === undefined ? 150 : options.timeout;

  if (mode === 'alert') {
    region.removeAttribute('aria-live');
    region.removeAttribute('role');
    alertDebouncer = Debouncer.debounce(alertDebouncer, animationFrame, () => {
      region.setAttribute('role', 'alert');
    });
  } else {
    if (alertDebouncer) {
      alertDebouncer.cancel();
    }
    region.removeAttribute('role');
    region.setAttribute('aria-live', mode);
  }

  region.textContent = '';

  setTimeout(() => {
    if (typeof text === 'string') {
      region.textContent = text;
      return;
    }
    render(text, region);
  }, timeout);
}
