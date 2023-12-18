
import { TemplateResult, html } from 'lit';
import AbstractEntity from './entityAbstract';
import { EntityElement, RenderConfig } from './types';
import { renderField } from './renderField';
import {
	DefaultI,
  FieldConfig,
  FieldConfigUpload
} from './types/entity';
import {
	Model
} from './types/modelComponent';

type Constructor<T = {}> = new (...args: any[]) => T;

type FConfig = FieldConfig | FieldConfigUpload
export declare class RenderInterface<D, C extends RenderConfig = RenderConfig> {
	renderField(name: string, config?: FConfig, data?: D): TemplateResult 
	renderFieldUpdate(name: string, config?: FConfig, data?: D): TemplateResult
	renderFieldTranslate(name: string, config?: FConfig, data?: D): TemplateResult
	renderCreateDialog(data: D, config?: C): TemplateResult

}

export interface StaticEntityField<D>  {
	model: Model<D>
}


export default function renderMixin<D extends DefaultI, C extends RenderConfig = RenderConfig>(superclass: Constructor<AbstractEntity>, model: Model<D>) {
	class R extends superclass {
		/**
	* renders a data-entry field, depending on the model definition
	*/
		// declare ['constructor']: typeof R & typeof AbstractEntity;
		 renderField(name: string, config?: FConfig, data?: D) {
			if (!this.host) {
				throw new Error('Entity not bound to element');
			}
			return (renderField<D>).call(this.host as EntityElement, name, data ?? this.host.data ?? {}, false, this.model, this, config);
		}
		 renderFieldTranslate(name: string, config?: FConfig, data?: D) {
			if (!this.host) {
				throw new Error('Entity not bound to element');
			}
			return (renderField<D>).call(this.host as EntityElement, name, data ?? this.host.data ?? {}, false, this.model, this, config, 'translate');
		}
		/**
		 * renders a data-entry field, depending on the model definition
		 * and updates the data object on input
		 */
		 renderFieldUpdate(name: string, config?: FConfig, data?: D) {
			if (!this.host) {
				throw new Error('Entity not bound to element');
			}
			return (renderField<D>).call(this.host as EntityElement, name, data ?? this.host.data, true, this.model, this, config);
		}
		renderCreateDialog(data: D, _config?: C) {
			return html`
      <div class="layout vertical  wrap">
				${this.renderFieldUpdate('name', undefined, data)}
				${this.renderFieldUpdate('title', undefined, data)}
			</div>
    `
		}
	}
	const staticApply: StaticEntityField<D> = {
		model: model
	}

	Object.assign(R, staticApply);
	return R as unknown as Constructor<RenderInterface<D, C>> & StaticEntityField<D> & typeof superclass;
}