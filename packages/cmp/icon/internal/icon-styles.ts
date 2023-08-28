import { css, CSSResult } from 'lit';
const styles: CSSResult = css`
	:host {
	--_lapp-icon-margin: var(--lapp-icon-margin, 0px);
	}

 svg {
	height: 100%;
	width: 100%;
	fill: currentColor;
	all: unset;
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