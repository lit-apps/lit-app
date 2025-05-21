import { html, TemplateResult } from 'lit';
import { GridItemModel } from '@vaadin/grid/vaadin-grid.js';
import type { GridColumn } from '@vaadin/grid/vaadin-grid-column.js';
import '@preignition/lit-firebase/span';

import {
	type GridColumnBodyLitRenderer,
} from '@vaadin/grid/lit';

type value = Date | string | number;
type getter = (item: any) => value | Promise<value>;
type T = any;
export default function bodyRealtime(valueGetter: getter, key?: string): GridColumnBodyLitRenderer<T> {
	return (item: T, _model: GridItemModel<T>, _column: GridColumn<T>): TemplateResult => {
		const path = valueGetter(item);
		if (!path) {
			return html``;
		}
		if (key) {
			return html`<lif-span @data-changed=${(e: CustomEvent) => item[key] = e.detail.value} .path=${path} ></lif-span>`
		}
		return html`<lif-span .path=${path} ></lif-span>`;
	}
}
