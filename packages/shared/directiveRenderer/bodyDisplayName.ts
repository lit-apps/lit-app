import '@preignition/lit-firebase/span';
import {
	type GridColumnBodyLitRenderer,
} from '@vaadin/grid/lit';
import type { GridColumn } from '@vaadin/grid/vaadin-grid-column.js';
import { GridItemModel } from '@vaadin/grid/vaadin-grid.js';
import { html, TemplateResult } from 'lit';

type value = Date | string | number;
type getter<T> = (item: T) => value | Promise<value>;

// TODO: this should Either be deprecated or replaced with firestore.
export default function bodyDisplayName<T extends { uid: string }>(valueGetter: getter<T> = item => item.uid): GridColumnBodyLitRenderer<T> {
	return (item: T, _model: GridItemModel<T>, _column: GridColumn<T>): TemplateResult => {
		const value = valueGetter(item);
		return value ? html`<lif-span .path="/userData/profile/${value}/displayName"></lif-span>` : html``;
	}
}
