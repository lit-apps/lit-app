import { css } from 'lit';
const styles = css`


	*[data-role="checkbox"] {
		margin-inline-start: 4px;
	}

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

	}
`;
export default styles;	