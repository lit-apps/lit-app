import { Media } from '@lit-app/cmp/field/choice/types';
import type {
	GridColumnBodyLitRenderer,
	GridColumnHeaderLitRenderer
} from '@vaadin/grid/lit';
import type { LitElement } from 'lit';
import { TemplateResult } from 'lit';
import { RenderConfig } from './entity.js';


type TextComponent = 'textfield' | 'textarea'
type MdComponent = 'md'
type DateComponent = 'datefield'
type SliderComponent = 'slider'
type StarComponent = 'star'
type UploadComponent = 'upload'
type UploadComponentImage = 'upload-image'
type BooleanComponent = 'checkbox' | 'switch'
type CheckboxGroupComponent = 'checkbox-group'
type RadioGroupComponent = 'radio-group'
type SelectComponent = 'select' | 'multi-select'

type TableConfig<T = any> = {
	index: number
	label?: string
	path?: string
	/**
	 * optional will not be rendered if value is undefined
	 */
	optional?: boolean
	/**
	 * condition to render the column depending on renderConfig
	 */
	condition?: (config: RenderConfig | undefined) => boolean
	renderer?: (data: T) => TemplateResult | string
}

export type GridConfig<T = any> = {
	index: number
	header?: string
	path?: string
	flex?: number
	width?: string
	resizable?: boolean
	sortable?: boolean
	/**
	 * condition to render the column depending on renderConfig
	 */
	condition?: (config: RenderConfig | undefined) => boolean
	headerRenderer?: GridColumnHeaderLitRenderer
	bodyRenderer?: GridColumnBodyLitRenderer<T>
}

export type CsvConfig<T = any> = {
	label?: string
	default?: string
	value?: (data: T) => string
	index?: number
	condition?: (config: RenderConfig | undefined) => boolean
}

interface ModelComponentBase<T = any> {
	label?: string | TemplateResult
	helper?: string
	required?: boolean
	disabled?: boolean
	readOnly?: boolean
	icon?: string
	style?: string
	class?: string
	table?: TableConfig<T>
	grid?: GridConfig<T>
	csv?: CsvConfig<T>
	tags?: string[]
	// set requestUpdate to true to request an update when the value changes
	requestUpdate?: boolean
	// do not render component when the function returns true 
	// only hide it when the function returns 'hide'
	hide?: (data: any) => boolean | 'hide'
	// do render the component only when the function returns true
	show?: (data: any) => boolean
	onInput?: (data: any, value: any, el: LitElement) => void // function called when the component value is updated
	// Slots that can be passed to the component, for instance for translation icons
	slots?: TemplateResult
}
export interface Lookup<T = string> {
	label: string | TemplateResult
	code: T
	key?: string
	index?: number
	supportingText?: string
	class?: string
	media?: Media
}

export interface ModelComponentSlider<T = any> extends ModelComponentBase<T> {
	component: SliderComponent
	min: string
	max: string
	step?: string
	ticks?: boolean
	labeled?: boolean
}
export interface ModelComponentUpload<T = any> extends ModelComponentBase<T> {
	component: UploadComponent
	multi?: boolean
	maxFiles?: number
	maxFileSize?: number
	noFileExtension?: boolean
	accept?: string
	path?: string
	store?: string
	useFirestore?: boolean
	fieldPath?: string
	fileName?: string
	dropText?: { one: string, many: string }
	buttonLabel?: string
}
export interface ModelComponentUploadImage<T = any> extends ModelComponentBase<T> {
	component: UploadComponentImage
	accept?: string
	maxFileSize?: number
	noFileExtension?: boolean
	path?: string
	store?: string
	useFirestore?: boolean
	fieldPath?: string
	fileName?: string
	dropText?: { one: string, many: string }
	buttonLabel?: string

}

export interface ModelComponentSelect<T = any> extends ModelComponentBase<T> {
	component: SelectComponent
	items?: Lookup[]
}
export interface ModelComponentCheckboxGroup<T = any> extends ModelComponentBase<T> {
	component: CheckboxGroupComponent
	items?: Lookup[]
}
export interface ModelComponentRadioGroup<T = any> extends ModelComponentBase<T> {
	component: RadioGroupComponent
	items?: Lookup[]
}
export interface ModelComponentText<T = any> extends ModelComponentBase<T> {
	component?: TextComponent | DateComponent
	placeholder?: string
	/**
	 * The key to local storage for local persistence
	 */
	storageKey?: string
	maxLength?: number
	minLength?: number
	type?: 'text' | 'number' | 'email' | 'password' | 'tel' | 'url' | 'search' | 'color' | 'date' | 'datetime-local' | 'month' | 'time' | 'week'
}
export interface ModelComponentTextArea<T = any> extends ModelComponentBase<T> {
	component: TextComponent
	rows?: number
	placeholder?: string
	/**
	 * The key to local storage for local persistence
	 */
	storageKey?: string
	maxLength?: number
	minLength?: number
	resize?: 'vertical' | 'horizontal' | 'auto'
}
export interface ModelComponentMd<T = any> extends ModelComponentBase<T> {
	component: MdComponent
	/**
	 * flavour of the markdown editor
	 */
	flavour?: 'github'
	rows?: number
	placeholder?: string
	/**
	 * The key to local storage for local persistence
	 */
	storageKey?: string
	maxLength?: number
	minLength?: number
	showAccessibilityMenu?: boolean
	/** 
	 * When true, the editor is only displaying pure markdown format (no HTML)
	 */
	pure?: boolean
	resize?: 'vertical' | 'horizontal' | 'auto'
	/**
	 * When true, tabs are hidden when the field is readonly and the preview is shown
	 */
	hideTabsOnReadOnly?: boolean
	/**
	 * The value to display when readonly and the value is empty
	 */
	defaultValueOnEmpty?: string
}
export interface ModelComponentMdDroppable<T = any> extends ModelComponentMd<T> {
	droppable: boolean
	path: string
	maxFileSize?: number
	accept?: string
	useFirestore?: boolean
}
export interface ModelComponentBoolean<T = any> extends ModelComponentBase<T> {
	component: BooleanComponent
}

export interface ModelComponentStar<T = any> extends ModelComponentBase<T> {
	component: StarComponent,
	starNumber?: number
	allowNoStar?: boolean
}

export type ModelComponent<T = any> =
	ModelComponentSelect<T> |
	ModelComponentRadioGroup<T> |
	ModelComponentCheckboxGroup<T> |
	ModelComponentText<T> |
	ModelComponentTextArea<T> |
	ModelComponentMd<T> |
	ModelComponentMdDroppable<T> |
	ModelComponentBoolean<T> |
	ModelComponentSlider<T> |
	ModelComponentUpload<T> |
	ModelComponentUploadImage<T> |
	ModelComponentStar<T>

export type FieldConfig<T = any> = Partial<ModelComponent<T>>

export type Model<T, B = T> = {
	[key in keyof Partial<T>]: ModelComponent<B> | Model<T[key], B>
}

export function isComponentSelect<T = any>(
	model: ModelComponent<T>
): model is ModelComponentSelect<T> {
	return model.component === 'select';
}
// TODO: remove this once we get rid of vaadin-multi-select-combo-box
export function isComponentMultiSelect<T = any>(
	model: ModelComponent<T>
): model is ModelComponentSelect<T> {
	return model.component === 'multi-select';
}
export function isComponentRadioGroup<T = any>(
	model: ModelComponent<T>
): model is ModelComponentRadioGroup<T> {
	return model.component === 'radio-group';
}
export function isComponentCheckboxGroup<T = any>(
	model: ModelComponent<T>
): model is ModelComponentCheckboxGroup<T> {
	return model.component === 'checkbox-group';
}
export function isComponentText<T = any>(
	model: ModelComponent<T>
): model is ModelComponentText<T> {
	return model.component === 'textfield' || model.component === 'datefield';
}
export function isComponentTextArea<T = any>(
	model: ModelComponent<T>
): model is ModelComponentTextArea<T> {
	return model.component === 'textarea';
}
export function isComponentMd<T = any>(
	model: ModelComponent<T>
): model is ModelComponentMd<T> {
	return model.component === 'md';
}
export function isComponentMdDroppable<T = any>(
	model: ModelComponent<T>
): model is ModelComponentMdDroppable<T> {
	return model.component === 'md' && (model as ModelComponentMdDroppable).droppable !== undefined;
}
export function isComponentCheckbox<T = any>(
	model: ModelComponent<T>
): model is ModelComponentBoolean<T> {
	return model.component === 'checkbox';
}
export function isComponentSwitch<T = any>(
	model: ModelComponent<T>
): model is ModelComponentBoolean<T> {
	return model.component === 'switch';
}
export function isComponentSlider<T = any>(
	model: ModelComponent<T>
): model is ModelComponentSlider<T> {
	return model.component === 'slider';
}
export function isComponentUpload<T = any>(
	model: ModelComponent<T>
): model is ModelComponentUpload<T> {
	return model.component === 'upload';
}
export function isComponentUploadImage<T = any>(
	model: ModelComponent<T>
): model is ModelComponentUploadImage<T> {
	return model.component === 'upload-image';
}
export function isComponentStar<T = any>(
	model: ModelComponent<T>
): model is ModelComponentStar<T> {
	return model.component === 'star';
}
