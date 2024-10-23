import { css, CSSResult } from 'lit';

/**
 * CSS styles for outlined elements.
 *
 * This style defines custom properties for border radius, padding, and color,
 * which can be overridden by setting the corresponding CSS variables.
 *
 * Custom Properties:
 * - `--outlined-border-radius`: The border radius of the outlined element. Default is `32px`.
 * - `--outlined-padding`: The padding inside the outlined element. Default is `8px`.
 * - `--outlined-color`: The color of the outline. Default is `#938F99` or the value of `--color-outline`.
 *
 * Classes:
 * - `.outlined`: Applies the outlined style to an element, including border radius, border, and padding.
 * 
 * @example
 * ```html  
 * <md-list class="outlined">
 *	 <md-list-item>
 *	   <div slot="heading">Cat</div>
 *	 </md-list-item>
 * </md-list>
 * ```
 * 
 */
const style: CSSResult = css`
		:host {
			--_outlined-border-radius: var(--outlined-border-radius, 32px);
			--_outlined-padding: var(--outlined-padding, 8px);
			--_outlined-color: var(--outlined-color, var(--color-outline, #938F99));
		}
		.outlined {
			border-radius: var(--_outlined-border-radius);
			border: 1px solid var(--_outlined-color);
			padding: var(--_outlined-padding);
		}
`;

export default style;
