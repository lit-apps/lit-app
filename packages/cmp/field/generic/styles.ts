import {css, CSSResult} from 'lit';
const styles: CSSResult = css`
:host > span, 
:host > div {
	display: inline-flex;
	flex: 1;
	align-items: flex-start; 
}
input[type="color"] {
	min-height: 24px;
}

`
export default styles;