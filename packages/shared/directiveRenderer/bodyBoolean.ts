import { html, TemplateResult } from 'lit';
import { GridItemModel } from '@vaadin/grid/vaadin-grid.js';
import type { GridColumn } from '@vaadin/grid/vaadin-grid-column.js';
import('@material/web/checkbox/checkbox.js');
import {
	type GridColumnBodyLitRenderer,
} from '@vaadin/grid/lit';

type value = boolean;
type getter<T> = (item: T) => value | Promise<value>;
export default function bodyBoolean<T = any>(valueGetter: getter<T>, key?: keyof T): GridColumnBodyLitRenderer<T> {
	return (item: T, _model: GridItemModel<T>, _column: GridColumn<T>): TemplateResult => {
		const value = valueGetter(item);
		if (key) {
			if (value instanceof Promise) {
				// @ts-expect-error  - we are cheating
				value.then(d => item[key] = d)
			} else {
				// @ts-expect-error  - we are cheating
				item[key] = value;
			}

		}
		return html`<md-checkbox disabled .checked=${!!value}></md-checkbox>`;
	}
}
