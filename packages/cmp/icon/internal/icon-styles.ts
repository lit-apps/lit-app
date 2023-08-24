import { css, CSSResult } from 'lit';
const styles: CSSResult = css`
 svg {
	height: 100%;
	width: 100%;
	fill: currentColor;
	all: unset;
 }
 path {
	fill: currentColor;
 }
 slot {
	display: none;
 }
`

export default styles;