import { html, TemplateResult } from 'lit';
import { GridItemModel } from '@vaadin/grid';
import type { GridColumn } from '@vaadin/grid/vaadin-grid-column.js';
import '@preignition/lit-firebase/span-store';
import {
	type GridColumnBodyLitRenderer,
} from '@vaadin/grid/src/lit/column-renderer-directives.js';

type value = string | undefined;
type getter<T> = (item: T) => value | Promise<value>;
export default function bodyRealtime<T>(
	valueGetter: getter<T>,
	fieldPath?: string,
	key?: keyof T
): GridColumnBodyLitRenderer<T> {
	return (item: T, _model: GridItemModel<T>, _column: GridColumn<T>): TemplateResult => {
		const path = valueGetter(item);
		if (!path) {
			return html``;
		}
		if (key) {
			return html`<lif-span-store @data-changed=${(e: CustomEvent) => item[key] = e.detail.value} .path=${path} .fieldPath=${fieldPath}></lif-span-store>`
		}
		return html`<lif-span-store .path=${path} .fieldPath=${fieldPath}></lif-span-store>`;
	}
}
