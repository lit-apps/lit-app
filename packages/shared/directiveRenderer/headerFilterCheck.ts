import type { MdCheckbox } from '@material/web/checkbox/checkbox';
import {
	type GridColumnHeaderLitRenderer
} from '@vaadin/grid/lit';
import type { GridColumn } from '@vaadin/grid/vaadin-grid-column.js';
import { html } from 'lit';
import('@material/web/checkbox/checkbox.js');


type direction = 'asc' | 'desc' | null;

/**
 * @param  {string} path - The path to the property to sort and filter on
 * @param  {string} label - The label to display in the header
 * @param  {array} lookup - items to display in the dropdown
 * @param  {boolean} sort? - Whether to display sort widget the column
 * @param  {direction=null} direction? - The direction to sort the column in (asc, desc, null)
 * @param  {getter} valueGetter? - A function to get the value to filter on. This is useful for lookup values
 * @returns GridColumnHeaderLitRenderer
 */

type hasPreviousValue = { previousValue?: boolean, undeterminate?: boolean };
type value = boolean | string | undefined
type lookup = ((value: string) => value) | ((value: boolean) => value);
export default function headerFilterCheck(
	path: string,
	label: string,
	lookup: lookup = (value: any) => value,
	sort?: boolean,
	direction?: direction
): GridColumnHeaderLitRenderer {

	const onInput = (column: GridColumn) => (e: CustomEvent) => {
		const target = e.target as MdCheckbox & hasPreviousValue
		const filter = target.parentElement?.parentElement as HTMLInputElement;
		const { previousValue, checked, indeterminate } = target;
		target.previousValue = checked;
		if (checked === true && previousValue === false) {
			filter.value = '';
			target.indeterminate = true;
			target.checked = false;
			filter.dispatchEvent(new CustomEvent('filter-changed', { bubbles: true }));
			return
		}
		if (indeterminate) {
			target.indeterminate = false;
			target.checked = true;
		}
		// @ts-expect-error  - we are cheating
		filter.value = lookup(target.checked);
		filter.dispatchEvent(new CustomEvent('filter-changed', { bubbles: true }));
	}

	const template = function (column: GridColumn) {
		return html`
			<div id="proxy-filter" style="flex: 1; width:100%;" .path=${path}>
				<label style="display: flex; align-items: center; gap: 10px">
          <md-checkbox touch-target="wrapper"  
					aria-label=${label}
					@change=${onInput(column)}></md-checkbox>
					${label}
        </label>
			</div>
			`
	}

	return function (column: GridColumn) {
		return sort ?
			html`<vaadin-grid-sorter aria-label="sort ${label}" .direction=${direction} .path=${path}>
					${template(column)}
				</vaadin-grid-sorter>` :
			template(column);
	}
}

