import { html } from 'lit';
import {
  type GridColumnHeaderLitRenderer
} from '@vaadin/grid/src/lit/column-renderer-directives.js';
import type { GridColumn } from '@vaadin/grid/vaadin-grid-column.js';
// import '@vaadin/grid/theme/material/vaadin-grid-filter-column.js';
// import '@vaadin/grid/theme/material/vaadin-grid-sort-column.js';


type direction = 'asc' | 'desc' | null;

/**
 * @param  {string} path - The path to the property to sort and filter on
 * @param  {string} label - The label to display in the header
 * @param  {direction=null} direction? - The direction to sort the column in (asc, desc, null)
 * @returns GridColumnHeaderLitRenderer
 */

export default function headerFilterText(path: string, label: string, direction?: direction): GridColumnHeaderLitRenderer {

  return (_column: GridColumn) => html`<vaadin-grid-sorter aria-label="sort ${label}" .direction=${direction} .path=${path}>
					<label>${label}</label>
				</vaadin-grid-sorter>`
}
