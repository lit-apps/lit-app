import { css } from 'lit';
const styles = css`
	
	#label {
		line-height: 0px;
		display: flex;
		align-items: center;
	}

	#label input {
		all: inherit;
		flex: 1;
    padding: 0px;
		padding-block: 0px;
		padding-inline: 0px;
		line-height: 0px;
		cursor: text;
	}

	md-chip-set {
		flex: 0;
	}

	md-input-chip:last-of-type {
		margin-inline-end: 6px;
	}

	md-menu {
		min-width: 0;
    width: 0;
	}

	

`;
export default styles;	