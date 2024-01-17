import { TemplateResult } from 'lit';
import {
	DefaultI,
  RenderConfig
} from './entity';
import { FieldConfig } from './modelComponent';
import AbstractEntity from '../abstractEntity';

export declare class RenderInterface<D, C extends RenderConfig = RenderConfig> {
	renderField(name: string, config?: FieldConfig, data?: D): TemplateResult 
	renderFieldUpdate(name: string, config?: FieldConfig, data?: D): TemplateResult
	renderFieldTranslate(name: string, config?: FieldConfig, data?: D): TemplateResult
	renderCreateDialog(data: D, config?: C): TemplateResult

}

export interface StaticEntityField<D extends DefaultI> extends Pick<AbstractEntity<D>, 'model'> {
	
}