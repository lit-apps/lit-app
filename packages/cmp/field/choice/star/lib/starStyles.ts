import { CSSResult, css } from 'lit';
import { accessibility } from '@preignition/preignition-styles';
import genericStyles from '../../../generic/styles';
import choiceStyles from '../../styles';

const styles: CSSResult = css`

svg {
	width: 1.25em;
	height: 1.2em;
	fill: currentColor;
	stroke: currentColor;
	margin-bottom: 3px;
}

output {
	font-size: var(--lapp-star-rating-font-size, 1.5rem);
	padding: 0px 1em;
	align-self: center;
	color: var(--mdc-theme-primary, #6200ee);
}

#list {
	display: flex;
	flex-direction: row;
}

label {
	display: block;
	position: relative;
	font-size: 1.6em;
	line-height: 0.6em;
	color: var(--mdc-text-field-disabled-ink-color, rgba(0, 0, 0, 0.38));
	cursor: pointer;
	/* Transparent border-bottom avoids jumping
		when a colored border is applied
		on :hover/:focus */
	border-bottom: 4px solid transparent;
}

input:checked + label, 
input[highlight] + label,
input:hover + label,
input:focus + label {
	color: var(--color-primary, #6200ee);
}

input:checked + label {
	border-bottom-color:  var(--color-primary, #6200ee);
}
input:focus + label {
	border-bottom-style: dotted;
}

input[id="star0"] + label {
	color: var(--mdc-text-field-disabled-ink-color, rgba(0, 0, 0, 0.38));
}

input[id="star0"]:checked + label {
	color: var(--color-error, #b00020);
	border-bottom-color: var(--color-error, #b00020);
}
`

export default [
	genericStyles,
	choiceStyles,
	...accessibility,
	styles
]