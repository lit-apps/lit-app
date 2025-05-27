import { CSSResult, css } from 'lit';

/**
 * Styles for various form elements and layouts.
 *
 * - `.field:not(.unset)`: Sets default max and min width for fields unless the `unset` class is applied.
 * - `.layout.horizontal > .side`: Sets a minimum width for side elements in horizontal layouts (used in Discussion app, should be deprecated).
 * - `.layout.horizontal > .field`: Sets flex-grow to 1 for fields in horizontal layouts.
 * - `.field.textarea`, `.field.md`, `.field.checkbox`, `.field.fill`: Allows these fields to take full width.
 * - `.field.checkbox`, `.field.flex-0`: Prevents these fields from flexing.
 * - `.table`: Sets font size for tables.
 * - `.table td.label`: Sets font weight, vertical alignment, and width for table labels.
 * - `#grid.flex`: Ensures grid has a minimal height and avoids flex-basis and height issues.
 * - `@media print .field`: Prevents fields from breaking inside during print.
 */
const style: CSSResult = css`

	/* By default flex 1 with min and max size */
	/* add unset class to avoid max and min width being set */
	.field:not(.unset) {
		max-width: var(--field-max-width, 400px);
		min-width: var(--field-min-width, 200px);
	}

	/**
	 This is used in Discussion app only - should be deprecated
	 */
	.layout.horizontal > .side  {
		min-width: var(--size-layout-small-width, 350px);
	}
	
	.layout.horizontal > .field {
		flex: 1;
	}
	/** we let textarea, checkbox and .fill take full width */
	.field.textarea, .field.md, .field.checkbox, .field.fill {
		max-width: unset;
	}

	.field.checkbox, .field.flex-0 {
	 flex: none;
	}



	/** base entity render table */
	.table {
		font-size: var(--font-size-small);
	}
	
	.table td.label  {
		font-weight: var(--font-weight-semi-bold);
		vertical-align: baseline;
		width: 20%;
	}
	
	/** Make sure the grid appears with minimal height */
	#grid.flex {
	 flex-basis: initial;
	 height: unset;
	 min-height: 500px;
	}

	/** we avoid fields breaking in print */
	@media print {
		.field {
			break-inside: avoid;
		}
	}
`

// @deprecated
export default style;