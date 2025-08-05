import { css } from 'lit';
const styles = css`
	*[data-role="radio"] {
		margin-inline-end: 16px;
		margin-inline-start: 4px;
	}
	:host([label-above]) [data-role="radio"] {
		margin-inline-end: 0;
		margin-inline-start: 0;
	}
`;
export default styles;	