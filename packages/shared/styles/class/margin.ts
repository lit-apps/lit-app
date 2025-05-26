import { CSSResult, css } from 'lit';

/**
 * CSS styles for margin utility classes.
 * 
 * This stylesheet defines various margin classes that can be used to apply
 * different margin sizes and directions to elements. The margin sizes are
 * controlled by CSS custom properties (variables) which can be set to different
 * values.
 * 
 * Classes:
 * - `.m`: Applies a medium margin (default).
 * - `.m.auto`: Sets the margin to `auto`.
 * - `.m.x-small`: Applies an extra small margin.
 * - `.m.small`: Applies a small margin.
 * - `.m.large`: Applies a large margin.
 * - `.m.x-large`: Applies an extra large margin.
 * - `.m.xx-large`: Applies a double extra large margin.
 * - `.m.top`: Applies the margin to the top of the element.
 * - `.m.bottom`: Applies the margin to the bottom of the element.
 * - `.m.right`: Applies the margin to the right of the element.
 * - `.m.left`: Applies the margin to the left of the element.
 * 
 * The margin size is determined by the `--_m` CSS variable, which is set by
 * the different size classes and then applied to the specific direction classes.
 */
const style: CSSResult = css`
	.m {
		--_m: var(--space-medium)
	}
  .m.auto {
		--_m: auto
	}
	.m.xx-small {
		--_m: var(--space-xx-small)
	}
	.m.x-small {
		--_m: var(--space-x-small)
	}
	.m.small {
		--_m: var(--space-small)
	}
	.m.large {
		--_m: var(--space-large)
	}
	.m.x-large{
		--_m: var(--space-x-large)
	}
	.m.xx-large{
		--_m: var(--space-xx-large)
	}
	.m.xxx-large{
		--_m: var(--space-xxx-large)
	}
	.m.top {
		margin-top: var(--_m);	
	}
	.m.bottom {
		margin-bottom: var(--_m);	
	}
	.m.right {
		margin-right: var(--_m);	
	}
	.m.left {
		margin-left: var(--_m);	
	}

`

export default style;