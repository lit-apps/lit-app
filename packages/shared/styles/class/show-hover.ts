import { css, CSSResult } from 'lit';

/**
 * CSS styles for elements with the `show-hover` attribute.
 * 
 * This style definition includes:
 * - A transition effect for the `opacity` property with a duration of 0.1 seconds.
 * - Initial opacity set to 0 for elements with the `show-hover` attribute.
 * - Opacity set to 1 when the host element is in a `hover`, `active`, `focus`, or `[hover]` state.
 * 
 */
const style: CSSResult = css`

  [show-hover] {
    transition: opacity 0.1s;
    opacity: 0;
  }
  
  :host(:hover) [show-hover], 
  :host(:active) [show-hover], 
  :host(:focus) [show-hover], 
  :host([hover]) [show-hover] {
    opacity: 1;
  }
`;

export default style;
