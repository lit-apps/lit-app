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

const printStyles = css`
	/** checkbox are not printed without this */
	md-checkbox {
		-webkit-print-color-adjust:exact !important;
		print-color-adjust:exact !important;
	}
	
	/** we want some denser layout for print */
	@media print {
		*[data-role="checkbox"] {
			margin-top: 2px;
			margin-bottom: 2px;
		}

	}`

/**
 * Styles to be applied both to filled and outlined choice fields.
 * 
 */
const styles  = [
	// ...MdFilledTextField.styles,
	choiceStyles,
	genericStyles,
	priorityStyles,
	swapButtonStyles, 
	printStyles
]

export default styles