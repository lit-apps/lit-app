import { css, CSSResult } from 'lit';
const styles: CSSResult = css`
	:host {
	--_lapp-icon-margin: var(--lapp-icon-margin, 0px);
	}

 svg {
	all: unset;
	height: calc(100% - 2 * var(--_lapp-icon-margin));
	width: calc(100% - 2 * var(--_lapp-icon-margin));
	fill: currentColor;
	margin: var(--_lapp-icon-margin);
 }

 path {
	fill: currentColor;
}
 slot {
	display: none;
}
`

export default styles;