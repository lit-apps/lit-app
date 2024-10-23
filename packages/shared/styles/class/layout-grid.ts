import { CSSResult, css } from 'lit';

/**
 * Defines CSS styles for a grid layout.
 * 
 * The `.layout.grid` class applies a grid display with the following properties:
 * - `grid-template-columns`: Creates columns that automatically fill the available space,
 *   with each column having a minimum width defined by the CSS variable `--layout-grid-column-width`
 *   (defaulting to the smaller of 90vw or 480px) and a maximum width of 1fr.
 * - `grid-auto-flow`: Ensures that grid items are placed in a dense row-wise manner.
 */
const styles: CSSResult = css`
.layout.grid {
	display: grid;
	grid-template-columns: repeat( auto-fill, minmax(var(--layout-grid-column-width, min(90vw, 480px)), 1fr) );
	grid-auto-flow: row dense;	
}

`;

export default styles;