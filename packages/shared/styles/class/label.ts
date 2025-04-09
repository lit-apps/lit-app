import { CSSResult, css } from 'lit';


/**
 * CSS styles for label elements, typically used for checkbox, radio, switch, etc.
 * 
 * - The `label` element is styled to be a flex container with centered alignment and a small font size.
 * - The `md-switch` element inside a `label` has small margins on both the start and end of the inline axis.
 */
const style: CSSResult = css`
	label {
		display: flex;
		align-items: center;
		font-size: var(--font-size-small);
		gap: var(--space-small);
	}

`

export default style