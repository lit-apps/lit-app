import { CSSResult, css } from 'lit';


/**
 * CSS styles for the header component.
 * 
 * This class is to be used together with `md-focus-ring`: 
 * 
 * 
 * ```html
 * 		<h2 class="header">
 *			<md-focus-ring  style="--md-focus-ring-shape: 10px"></md-focus-ring>
 *			Title
 *		</h2>
 * ```
 * 
 * This style includes:
 * - A `.header` class with a relative position.
 * - A `.header:focus` pseudo-class that removes the outline and sets the text color to the primary theme color.
 */
const style: CSSResult = css`
	.header {
    position: relative;
  }
  .header:focus {
    outline: none; 
    color: var(--pfo-theme-primary);
  }

`

export default style