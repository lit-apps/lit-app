import { CSSResult, css } from 'lit';


/**
 * Defines a set of CSS classes for padding styles using CSS custom properties.
 * 
 * Classes:
 * - `.padding`, `.p`: Base classes that set the padding using the `--space-medium` custom property by default.
 * - `.p.x-small`: Sets the padding using the `--space-x-small` custom property.
 * - `.p.small`: Sets the padding using the `--space-small` custom property.
 * - `.p.large`: Sets the padding using the `--space-large` custom property.
 * - `.p.x-large`: Sets the padding using the `--space-x-large` custom property.
 * - `.p.xx-large`: Sets the padding using the `--space-xx-large` custom property.
 * - `.padding`: Applies the padding value from the `--_p` custom property to all sides.
 * - `.p.top`: Applies the padding value from the `--_p` custom property to the top side.
 * - `.p.bottom`: Applies the padding value from the `--_p` custom property to the bottom side.
 * - `.p.right`: Applies the padding value from the `--_p` custom property to the right side.
 * - `.p.left`: Applies the padding value from the `--_p` custom property to the left side.
 * 
 * Custom Properties:
 * - `--space-x-small`: Custom property for extra small space.
 * - `--space-small`: Custom property for small space.
 * - `--space-medium`: Custom property for medium space.
 * - `--space-large`: Custom property for large space.
 * - `--space-x-large`: Custom property for extra large space.
 * - `--space-xx-large`: Custom property for double extra large space.
 * - `--_p`: Internal custom property used to set the padding value.
 */
const style: CSSResult = css`
	.padding, .p {
		--_p: var(--space-medium)
	}

	.p.x-small {
		--_p: var(--space-x-small)
	}
	.p.small {
		--_p: var(--space-small)
	}
	.p.large {
		--_p: var(--space-large)
	}
	.p.x-large{
		--_p: var(--space-x-large)
	}
	.p.xx-large{
		--_p: var(--space-xx-large)
	}
	.padding {
		padding: var(--_p);	
	}
	.p.top {
		padding-top: var(--_p);	
	}
	.p.bottom {
		padding-bottom: var(--_p);	
	}
	.p.right {
		padding-right: var(--_p);	
	}
	.p.left {
		padding-left: var(--_p);	
	}
`

export default style;