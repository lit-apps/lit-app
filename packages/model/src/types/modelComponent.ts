import { Primitive } from 'firebase/firestore';
import type { LitElement } from 'lit';
import { TemplateResult } from 'lit';
import {
	GridColumnBodyLitRenderer,
	GridColumnHeaderLitRenderer
} from 'lit-vaadin-helpers';

type TextComponent = 'textfield' | 'textarea' | 'md'
type DateComponent = 'datefield'
type SliderComponent = 'slider'
type UploadComponent = 'upload'
type BooleanComponent = 'checkbox' | 'switch'
type SelectComponent = 'select' | 'multi-select'

type TableConfig<T = any> = {
	index: number
	label?: string
	path?: string
	optional?: boolean
	renderer?: (data: T) => TemplateResult
}

export type GridConfig<T = any> = {
	index: number
	header?: string
	path?: string
	flex?: number
	width?: string
	resizable?: boolean
	sortable?: boolean
	headerRenderer?: GridColumnHeaderLitRenderer
	bodyRenderer?: GridColumnBodyLitRenderer<T>
}
interface ModelComponentBase<T = any> {
	label?: string
	helper?: string
	required?: boolean
	icon?: string
	class?: string
	table?: TableConfig<T>
	grid?: GridConfig<T>
	// set requestUpdate to true to request an update when the value changes
	requestUpdate?: boolean
	// do not render component when the function returns true 
	// only hide it when the function returns 'hide'
	hide?: (data: any) => boolean | 'hide'
	// do render the component only when the function returns true
	show?: (data: any) => boolean
	onInput?: (data: any, value: any, el: LitElement) => void // function called when the component value is updated
}
export interface Lookup<T = string> {
	label: string
	code: T
	key?: string
	index?: number
	class?: string
}

export interface ModelComponentSlider<T = any> extends ModelComponentBase<T> {
	component: SliderComponent
	min: string
	max: string
	step?: string
}
export interface ModelComponentUpload<T = any> extends ModelComponentBase<T> {
	component: UploadComponent
	multi?: boolean
	maxFiles?: number
	maxFileSize?: number
	accept?: string
	path?: string
	store?: string
	useFirestore?: boolean
	fieldPath?: string
	fileName?: string
	dropText?: { one: string, many: string }

}

export interface ModelComponentSelect<T = any> extends ModelComponentBase<T> {
	component: SelectComponent
	items?: { code: string, label: string }[]
}
export interface ModelComponentText<T = any> extends ModelComponentBase<T> {
	component?: TextComponent | DateComponent
	placeholder?: string
	maxLength?: number
	minLength?: number
	type?: 'text' | 'number' | 'email' | 'password' | 'tel' | 'url' | 'search' | 'color' | 'date' | 'datetime-local' | 'month' | 'time' | 'week'
}
export interface ModelComponentTextArea<T = any> extends ModelComponentBase<T> {
	component: TextComponent 
	rows?: number
	placeholder?: string
	maxLength?: number
	minLength?: number
	resize?: 'vertical' | 'horizontal' | 'auto'
}
export interface ModelComponentBoolean<T = any> extends ModelComponentBase<T> {
	component: BooleanComponent
}

export type ModelComponent<T = any> =
	ModelComponentSelect<T> |
	ModelComponentText<T> |
	ModelComponentTextArea<T> |
	ModelComponentBoolean<T> |
	ModelComponentSlider<T> |
 	ModelComponentUpload<T>

export type Model<T> = {
	[key in keyof Partial<T>]: ModelComponent<T> | Model<T[key]>
} & { ref?: { [key: string]: ModelComponent<T> } }
