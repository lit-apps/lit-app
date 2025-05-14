
import AbstractEntity from './AbstractEntity';
import { renderField } from './renderField';
import { EntityElement } from './types';
import {
	DefaultI,
} from './types/entity';
import {
	FieldConfig,
	Model
} from './types/modelComponent';

type Constructor<T = {}> = new (...args: any[]) => T;


import { get } from '@lit-app/shared/dataUtils/index.js';
import { NestedKeys } from '@lit-app/shared/types.js';
import { deprecated } from '@preignition/preignition-util';
import type { RenderInterface } from './types/renderEntityFieldI';
import { StaticEntityField } from './types/renderEntityFieldI';
export type { RenderInterface, StaticEntityField } from './types/renderEntityFieldI';

export default function renderMixin<
	D extends DefaultI = DefaultI,
	C extends FieldConfig = FieldConfig
>(
	superclass: Constructor<AbstractEntity>,
	model: Model<D>
) {
	class R extends superclass {
		/**
		 * renders a data-entry field, depending on the model definition
		 */
		renderField(path: NestedKeys<D>, config?: C, data?: D) {
			if (!this.host) {
				throw new Error('Entity not bound to element');
			}
			const model = get(path, this.model);
			const consumingMode = (this.host as EntityElement<D>).consumingMode ?? 'edit';
			return renderField.call(
				this.host as EntityElement<D>,
				{
					path,
					data: data ?? this.host.data as D,
					model: { ...model, ...config },
					entity: this,
					consumingMode
				}
			);
		}


		/**
		 * renders a data-entry field, depending on the model definition
		 * and updates the data object on input
		 */
		renderFieldUpdate(path: NestedKeys<D>, config?: C, data?: D) {
			if (!this.host) {
				throw new Error('Entity not bound to element');
			}
			const model = get(path, this.model);

			const consumingMode = (this.host as EntityElement<D>).consumingMode ?? 'edit';
			return renderField.call(
				this.host as EntityElement<D>,
				{
					path,
					data: data ?? this.host.data as D,
					update: true,
					model: { ...model, ...config },
					entity: this,
					consumingMode
				}
			);
		}

		@deprecated('use consumingMode on host instead')
		renderFieldTranslate(path: NestedKeys<D>, config?: C, data?: D) {
			if (!this.host) {
				throw new Error('Entity not bound to element');
			}
			const model = get(path, this.model);
			const consumingMode = 'translate'
			return renderField.call(
				this.host as EntityElement<D>,
				{
					path,
					data: data ?? this.host.data as D,
					model: { ...model, ...config },
					entity: this,
					consumingMode
				})
		}
	}
	const staticApply: StaticEntityField<D> = {
		model: model
	}

	Object.assign(R, staticApply);
	return R as unknown as Constructor<RenderInterface<D, C>> & StaticEntityField<D> &
		typeof superclass;
}