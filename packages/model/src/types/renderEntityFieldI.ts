import { TemplateResult } from 'lit';
import {
	DefaultI,
} from './entity';
import { FieldConfig } from './modelComponent';
import AbstractEntity from '../abstractEntity';

/**
 * Represents a render interface for rendering entity fields.
 * @template D - The type of data for the field.
 */
export declare class RenderInterface<D> {
	/**
	 * renders a data-entry field, depending on the model definition
	 */
	renderField(name: string, config?: FieldConfig, data?: D): TemplateResult
	/**
	 * renders a data-entry field, depending on the model definition
	 * and updates the data object on input
	 */
	renderFieldUpdate(name: string, config?: FieldConfig, data?: D): TemplateResult
	/**
	 * renders a data-entry field for translation, depending on the model definition
	 * 
	 */
	renderFieldTranslate(name: string, config?: FieldConfig, data?: D): TemplateResult

}

export interface StaticEntityField<D extends DefaultI> extends Pick<AbstractEntity<D>, 'model'> {

}