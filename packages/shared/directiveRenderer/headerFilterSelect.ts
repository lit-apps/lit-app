// import '@vaadin/combo-box/theme/material/vaadin-combo-box';
import '@vaadin/combo-box/vaadin-lit-combo-box';
import '@vaadin/select/vaadin-lit-select';
import type { GridColumn } from '@vaadin/grid/vaadin-grid-column.js';
// import '@vaadin/grid/theme/material/vaadin-grid-filter-column.js';
import { html, TemplateResult, LitElement } from 'lit';
import {
	type GridColumnHeaderLitRenderer
} from '@vaadin/grid/src/lit/column-renderer-directives.js';


type direction = 'asc' | 'desc' | null;
type getter = (value: string) => string;
type lookupItem = { code: string, label: string | TemplateResult };
type hasValue = {value: string, clearButtonVisible?: boolean};

/**
 * @param  {string} path - The path to the property to sort and filter on
 * @param  {string} label - The label to display in the header
 * @param  {array} lookup - items to display in the dropdown
 * @param  {boolean} sort? - Whether to display sort widget the column
 * @param  {direction=null} direction? - The direction to sort the column in (asc, desc, null)
 * @param  {getter} valueGetter? - A function to get the value to filter on. This is useful for lookup values
 * @returns GridColumnHeaderLitRenderer
 */

export function headerFilterText(
	path: string, 
	label: string, 
	lookup: lookupItem[] , 
	sort?: boolean, 
	direction?: direction, 
	valueGetter?: getter): GridColumnHeaderLitRenderer 
export function headerFilterText(
	path: string, 
	label: string, 
	lookup: {items: lookupItem[]} , 
	sort?: boolean, 
	direction?: direction, 
	valueGetter?: getter): GridColumnHeaderLitRenderer 
export default function headerFilterText(
	path: string, 
	label: string, 
	lookup: (lookupItem[]) | ({items: lookupItem[]}), 
	sort?: boolean, 
	direction?: direction, 
	valueGetter?: getter
): GridColumnHeaderLitRenderer {
	const onChange = (column: GridColumn) => async (e: CustomEvent) => {
		const target = e.target as (LitElement & hasValue)
		const filter = target.parentElement as HTMLInputElement ;
		let value = target.value;
		if (value === '__') {
			value = '';
		}
		if (valueGetter) {
			value = valueGetter(value);
		}
		filter.value = value;
		target.clearButtonVisible = true;
		await target.updateComplete;
		column.dispatchEvent(new CustomEvent('grid-filter-input', { detail: value, bubbles: true, composed: true }));
		filter.dispatchEvent(new CustomEvent('filter-changed', { bubbles: true }));
	}
	
	const items = ((lookup as { items: lookupItem[] }).items || lookup).map((item: lookupItem) => ({value: item.code, label: item.label}));
	items.unshift({ value: '__', label: 'All ' + label });

	const template = function (column: GridColumn) {

			return html`
			<div id="proxy-filter" style="flex: 1; width:100%;" .path=${path}>
			 <vaadin-select 
			  aria-label="filter ${label}"
				style="max-width: 100%; --vaadin-combo-box-overlay-width: 16em;"
				placeholder="${label}" 
				@change=${onChange(column)} 
				.items=${items} 
				></vaadin-select>
			</div>
			`
	}

	return function (this: LitElement, column: GridColumn) {
		return sort ?
			html`<vaadin-grid-sorter aria-label="sort ${label}" .direction=${direction} .path=${path}>
					${template.call(this, column)}
				</vaadin-grid-sorter>` :
			template.call(this, column);
	}
}

