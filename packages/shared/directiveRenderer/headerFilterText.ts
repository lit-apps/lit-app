import { html } from 'lit';
import {
 type	GridColumnHeaderLitRenderer
} from '@vaadin/grid/src/lit/column-renderer-directives.js';
import type { GridColumn } from '@vaadin/grid/vaadin-grid-column.js';
import '@vaadin/grid/theme/material/vaadin-grid-filter-column.js';
import '@vaadin/grid/theme/material/vaadin-grid-sort-column.js';


type direction = 'asc' | 'desc' | null;
type getter = (value: string) => string;

/**
 * @param  {string} path - The path to the property to sort and filter on
 * @param  {string} label - The label to display in the header
 * @param  {boolean} sort? - Whether to display sort widget the column
 * @param  {direction=null} direction? - The direction to sort the column in (asc, desc, null)
 * @param  {getter} valueGetter? - A function to get the value to filter on. This is useful for lookup values
 * @returns GridColumnHeaderLitRenderer
 */

export default function headerFilterText(
  path: string, 
  label: string, 
  sort?: boolean, 
  direction?: direction, 
  valueGetter?: getter
): GridColumnHeaderLitRenderer {
	const onInput = (column: GridColumn) => (e: CustomEvent) => {
		const target = e.target as HTMLInputElement
		const filter = target.parentElement as HTMLInputElement;
		let value = e.detail?.value || target.value;
		if(valueGetter) { 
			value = valueGetter(value);
		}
		filter.value = value;
		column.dispatchEvent(new CustomEvent('grid-filter-input', { detail: value, bubbles: true, composed: true }));
		filter.dispatchEvent(new CustomEvent('filter-changed', { bubbles: true }));
	}
	const template = (column: GridColumn) => {
			return html`
			<div id="proxy-filter" style="flex: 1; width:100%;" .path=${path}>
        <vaadin-text-field 
					style="width:100%;" 
					aria-label="${label} filter" 
					.placeholder=${label} 
					@value-changed=${onInput(column)}
				></vaadin-text-field>
			</div>
			`
		}

	return (column: GridColumn) => sort ? 
		html`<vaadin-grid-sorter aria-label="sort ${label}" .direction=${direction} .path=${path}>
					${template(column)}
				</vaadin-grid-sorter>` : 
		template(column);
}
