import { html, TemplateResult } from 'lit';
import { GridItemModel } from '@vaadin/grid';
import type { GridColumn } from '@vaadin/grid/vaadin-grid-column.js';
import '@preignition/lit-firebase/span';
import {
	type GridColumnBodyLitRenderer,
} from '@vaadin/grid/src/lit/column-renderer-directives.js';

type value = Date | string | number;
type getter<T> = (item: T) => value | Promise<value>;
type T = any;
export default function bodyDisplayName<T extends {uid: string}>(valueGetter: getter<T> = item => item.uid): GridColumnBodyLitRenderer<T> {
	return (item: T, _model: GridItemModel<T>, _column: GridColumn<T>): TemplateResult => {
		const value = valueGetter(item);
		return value ? html`<lif-span .path="/userData/profile/${value}/displayName"></lif-span>` : html``;
	}
}
