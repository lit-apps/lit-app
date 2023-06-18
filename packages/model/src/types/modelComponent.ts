import type { LitElement } from 'lit'
import {
	columnBodyRenderer,
	columnHeaderRenderer,
	GridColumnBodyLitRenderer,
	GridColumnHeaderLitRenderer
} from 'lit-vaadin-helpers';

type TextComponent = 'textfield' | 'textarea' | 'md'
type DateComponent = 'datefield'
type SliderComponent = 'slider'
type UploadComponent = 'upload'
type BooleanComponent = 'checkbox' | 'switch'
type SelectComponent = 'select' | 'multi-select'

type TableConfig = {
	index: number
	label?: string,
	optional?: boolean
}

type GridConfig<T = any> = {
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
interface ModelComponentBase {
	label?: string
	helper?: string
	required?: boolean
	icon?: string
	class?: string
	table?: TableConfig
	grid?: GridConfig
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

export interface ModelComponentSlider extends ModelComponentBase {
	component: SliderComponent
	min: string
	max: string
	step?: string
}
export interface ModelComponentUpload extends ModelComponentBase {
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

export interface ModelComponentSelect extends ModelComponentBase {
	component: SelectComponent
	items?: { code: string, label: string }[]
}
export interface ModelComponentText extends ModelComponentBase {
	component?: TextComponent | DateComponent
	maxLength?: number
	minLength?: number
	type?: 'text' | 'number' | 'email' | 'password' | 'tel' | 'url' | 'search' | 'color' | 'date' | 'datetime-local' | 'month' | 'time' | 'week'
}
export interface ModelComponentTextArea extends ModelComponentBase {
	component: TextComponent 
	rows?: number
	resize?: 'vertical' | 'horizontal' | 'auto'
}
export interface ModelComponentBoolean extends ModelComponentBase {
	component: BooleanComponent
}

export type ModelComponent =
	ModelComponentSelect |
	ModelComponentText |
	ModelComponentTextArea |
	ModelComponentBoolean |
	ModelComponentSlider |
	ModelComponentUpload

export type Model<T> = {
	[key in keyof Partial<T>]: ModelComponent | Model<T[key]>
} & { ref?: { [key: string]: ModelComponent } }
