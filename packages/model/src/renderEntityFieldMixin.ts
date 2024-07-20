
import { html } from 'lit';
import AbstractEntity from './abstractEntity';
import { EntityElement, RenderConfig } from './types';
import { renderField } from './renderField';
import {
	DefaultI,

} from './types/entity';
import {
	Model,
	FieldConfig
} from './types/modelComponent';

type Constructor<T = {}> = new (...args: any[]) => T;


import { RenderInterface, StaticEntityField } from './types/renderEntityFieldI';
export type { RenderInterface, StaticEntityField } from './types/renderEntityFieldI';

export default function renderMixin<D extends DefaultI = DefaultI, C extends RenderConfig = RenderConfig>(superclass: Constructor<AbstractEntity>, model: Model<D>) {
	class R extends superclass {
	 /**
		* renders a data-entry field, depending on the model definition
		*/
		renderField(name: string, config?: FieldConfig, data?: D) {
			if (!this.host) {
				throw new Error('Entity not bound to element');
			}
			return renderField.call(this.host as EntityElement<D>, name, (data ?? this.host.data ?? {}) as D, false, this.model, this, config);
		}
		renderFieldTranslate(name: string, config?: FieldConfig, data?: D) {
			if (!this.host) {
				throw new Error('Entity not bound to element');
			}
			return renderField.call(this.host as EntityElement<D>, name, (data ?? this.host.data ?? {}) as D, false, this.model, this, config, 'translate');
		}
		/**
		 * renders a data-entry field, depending on the model definition
		 * and updates the data object on input
		 */
		renderFieldUpdate(name: string, config?: FieldConfig, data?: D) {
			if (!this.host) {
				throw new Error('Entity not bound to element');
			}
			return renderField.call(this.host as EntityElement<D>, name, data ?? this.host.data as D, true, this.model, this, config);
		}

	}
	const staticApply: StaticEntityField<D> = {
		model: model
	}

	Object.assign(R, staticApply);
	return R as unknown as Constructor<RenderInterface<D, C>> & StaticEntityField<D> & typeof superclass;
}