import { TemplateResult } from 'lit';
import {
	DefaultI,
  FieldConfig,
  FieldConfigUpload,RenderConfig
} from './entity';
import AbstractEntity from '../abstractEntity';


type FConfig = FieldConfig | FieldConfigUpload
export declare class RenderInterface<D, C extends RenderConfig = RenderConfig> {
	renderField(name: string, config?: FConfig, data?: D): TemplateResult 
	renderFieldUpdate(name: string, config?: FConfig, data?: D): TemplateResult
	renderFieldTranslate(name: string, config?: FConfig, data?: D): TemplateResult
	renderCreateDialog(data: D, config?: C): TemplateResult

}

export interface StaticEntityField<D extends DefaultI> extends Pick<AbstractEntity<D>, 'model'> {
	
}