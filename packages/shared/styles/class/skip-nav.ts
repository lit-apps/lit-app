import { css, CSSResult } from 'lit';

/**
 * CSS styles for the skip navigation link.
 * 
 * The `#skipnav` element is styled to be positioned relatively with a high z-index.
 * 
 * The `#skipnav a` and `a[slot='skipnav']` elements are initially positioned off-screen
 * and styled to be visually hidden. They have no transition effects, no text decoration,
 * and are given a background color, padding, border-radius, and text color.
 * 
 * When the `#skipnav a` or `a[slot='skipnav']` elements receive focus or are active,
 * they are repositioned to be visible on the screen with adjusted dimensions and overflow settings.
 * 
 * Variables used:
 * - `--z-index-overlay`: The z-index value for the `#skipnav` element.
 * - `--color-surface-container-high`: The background color for the skip navigation link.
 * - `--color-on-surface`: The text color for the skip navigation link.
 */
const style: CSSResult = css`
#skipnav { 
  text-align: left; 
  position: relative; 
  z-index: var(--z-index-overlay);
}

#skipnav a,
a[slot='skipnav'] {
  transition: none;
  text-decoration: none;
  position: absolute; 
  left: -10000px; 
  width: 1px; 
  height: 1px; 
  overflow: hidden; 
  background: var(--color-surface-container-high);
  padding: 10px 20px;
  border-radius: 10px;
  color: var(--color-on-surface);
}
#skipnav a:focus, #skipnav a:active,
a[slot='skipnav']:focus,  a[slot='skipnav']:active {
  left: 10px; 
  top: 10px; 
  width: auto; 
  height: auto; 
  overflow: visible;  
}
`;

export default style;
