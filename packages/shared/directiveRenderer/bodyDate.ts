import { html, TemplateResult } from 'lit';
import { GridItemModel } from '@vaadin/grid';
import type { GridColumn } from '@vaadin/grid/vaadin-grid-column.js';
import '@preignition/pwi-date-format';
import {
	type GridColumnBodyLitRenderer,
} from '@vaadin/grid/src/lit/column-renderer-directives.js';

import type { Timestamp } from 'firebase/firestore';

type value = Date | string | number | Timestamp;
type getter<T> = (item: T) => value | Promise<value>;

export default function bodyDate<T = any>(
	valueGetter: getter<T> = item => (item as any).timestamp, key?: keyof T
): GridColumnBodyLitRenderer<T> {
	return (item: T, _model: GridItemModel<T>, _column: GridColumn<T>): TemplateResult => {
		const date = valueGetter(item);
		if (key) {
			if (date instanceof Promise) {
				// @ts-expect-error - we know it is a promise
				date.then(d => item[key] = d)
			} else {
				// @ts-expect-error - we know it is a date
				item[key] = date;
			}

		}
		return html`<pwi-date-format .date=${date}></pwi-date-format>`;
	}
}
