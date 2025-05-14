import { NestedKeys } from '@lit-app/shared/types.js';
import { TemplateResult } from 'lit';
import AbstractEntity from '../AbstractEntity';
import {
	DefaultI,
	RenderConfig,
} from './entity';
import { FieldConfig } from './modelComponent';

/**
 * Represents a render interface for rendering entity fields.
 * @template D - The type of data for the field.
 */
export declare class RenderInterface<D extends DefaultI, C = RenderConfig> {

	/**
	 * renders a data-entry field, depending on the model definition
	 */
	renderField(name: NestedKeys<D>, config?: FieldConfig<any, C>, data?: D): TemplateResult

	/**
	 * renders a data-entry field, depending on the model definition
	 * and updates the data object on input
	 */
	renderFieldUpdate(name: NestedKeys<D>, config?: FieldConfig<any, C>, data?: D): TemplateResult

	/**
	 * renders a data-entry field for translation, depending on the model definition
	 * 
	 */
	renderFieldTranslate(name: NestedKeys<D>, config?: FieldConfig<any, C>, data?: D): TemplateResult

}

export interface StaticEntityField<D extends DefaultI> extends Pick<AbstractEntity<D>, 'model'> {

}