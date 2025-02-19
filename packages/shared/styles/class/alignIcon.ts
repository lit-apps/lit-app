import { css, CSSResult } from 'lit';

/**
 * CSS styles for aligning `lapp-icon` elements within various HTML tags.
 * 
 * This is meant to be used with typography
 * 
 * - Aligns `lapp-icon` elements vertically to the middle within `h1`, `h2`, `h3`, `h4`, `h5`, `h6`, `p`, and elements with the class `align-icon`.
 * - Sets the font size of `lapp-icon` elements within `h1`, `h2`, and `h3` to inherit from their parent elements.
 * - Specifies the width and height of `lapp-icon` elements within `h1` and `h2` to `1.1em` to ensure proper rendering in Safari.
 * - Specifies the width and height of `lapp-icon` elements within `h3` to `1.3em` for consistent sizing.
 * - Adds a right margin to `lapp-icon` elements within `h3`, `h4`, `h5`, `h6`, and `p` tags to provide spacing using the `--space-x-small` variable.
 */
const style: CSSResult = css`

h1 lapp-icon, h2 > lapp-icon, h3 > lapp-icon, h4 > lapp-icon, h5 > lapp-icon, h6 > lapp-icon, p lapp-icon, .align-icon lapp-icon{
  vertical-align: bottom;
}

h1 > lapp-icon, h2 > lapp-icon, h3 > lapp-icon {
  font-size: inherit;

}
h1 > lapp-icon, h2 > lapp-icon {
  width: 1.1em;
  height: 1.1em; /* we have 1em instead of unset as Safari fail to interpret unset correctly in flexbox */
}
h3 > lapp-icon {
  width: 1.3em;
  height: 1.3em; /* we have 1em instead of unset as Safari fail to interpret unset correctly in flexbox */
}

h3 > lapp-icon, h4 > lapp-icon, h5 > lapp-icon, h6 > lapp-icon, p lapp-icon {
  margin-right: var(--space-x-small);
}

`;

export default style;
