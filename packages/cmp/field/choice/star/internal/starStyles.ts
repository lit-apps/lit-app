import { CSSResult, css } from 'lit';
import { srOnly } from '@lit-app/shared/styles';
import genericStyles from '../../../generic/styles';
import choiceStyles from '../../styles';

const styles: CSSResult = css`

:host {
	--_color-star: var(--lapp-star-color, rgba(0, 0, 0, 0.38));
}
:host([readonly]) {
	pointer-events: none;
}

svg {
	width: 100%;
	height: 100%;
	fill: currentColor;
	stroke: currentColor;
	margin-bottom: 3px;
}

output {
	font-size: var(--lapp-star-rating-font-size, 1.5rem);
	padding: 0px 1em;
	color: var(--color-primary, #6200ee);
}

#list {
	margin-block: var(--space-small, 6px);
	display: flex;
	flex-direction: row;
	align-items: center;
	flex-wrap: wrap;
}

label {
	display: inherit;
	position: relative;
	width: 2.6em;
	height: 3em;
	color: var(--_color-star);
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
	color: var(--_color-star);
}

input[id="star0"]:checked + label {
	color: var(--color-error, #b00020);
	border-bottom-color: var(--color-error, #b00020);
}
`

export default [
	genericStyles,
	choiceStyles,
	srOnly,
	styles
]