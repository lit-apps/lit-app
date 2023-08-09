import { css, CSSResult } from 'lit'
// import { MdFilledTextField } from '@material/web/textfield/filled-text-field.js'
import genericStyles from '../../../generic/styles';
import choiceStyles from '../../styles';

/**
 * style needed for styling priority rank
*/
const priorityStyles = css`
	[data-variant="icon"].priority {
	width: 24px;
	height: 24px;
	}

	[data-variant="icon"].checked {
	background: var(--color-primary);
	color: var(--color-on-primary);
	font-weight: var(--font-weight-bold);
	line-height: 24px;
	border-radius: 50%;
	text-align: center;
}
`

/**
 * Style the up and down swap button
 */
const swapButtonStyles = css`
	.swap {
		opacity: 0;
	}
	.swap:focus,
	[md-list-item]:hover .swap,
	[md-list-item]:focus .swap {
		opacity: 1;
	}
	`

/**
 * Styles to be applied both to filled and outlined choice fields.
 * 
 */
const styles: CSSResult[] = [
	// ...MdFilledTextField.styles,
	choiceStyles,
	genericStyles,
	priorityStyles,
	swapButtonStyles
]

export default styles