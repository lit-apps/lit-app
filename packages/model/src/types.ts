import { DocumentReference, FieldValue } from 'firebase/firestore'
import { LitElement, TemplateResult } from 'lit'
import { AnyEvent, AppAction, BaseEvent, Delete, Dirty, EntityAction, Reset, Restore, TypeofAnyEvent, Write } from './events'
import Entity, { DefaultActions } from './entity'
import { Grid, GridItemModel } from '@vaadin/grid';

export interface GetAccess {
	isOwner(access: Access, data: any): boolean
	canEdit(access: Access, data: any): boolean
	canView(access: Access, data: any): boolean
	canDelete(access: Access, data: any): boolean
	getUid(): string
}

type roles = 'owner' | 'guest' | 'master'
type role = { [key in roles]: boolean }
export type Claims = {
	organisation?: { [key: string]: role }
	admin?: { [key: string]: role }
	group?: { [key: string]: role }
	documentation?: { [key: string]: role }
	active?: string | undefined
	tenantActive?: string | undefined
	email?: string | undefined
	name?: string | undefined
	buid?: string | undefined
}

// storing the state of an entity
export type EntityStatus = {
	isDirty: boolean,
	isEditing: boolean,
	isSaving: boolean,
	isLoading: boolean, // true when the entity is loading data
	isDeleting: boolean,
}

// storing the access information for an entity
export type EntityAccess = {
	isOwner: boolean,
	canEdit: boolean,
	canView: boolean,
	canDelete: boolean,
}

// type ActionType = 'bulk' | 'single'
type Handler = (this: LitElement, ref: DocumentReference, data: any, event: AnyEvent) => Promise<unknown>

// export type EventType = 'created' | 'reviewed' | 'deleted' | 'restored' | 'reviewed' | 'public' | 'updated'
// export type ActionType = 'markPublic' | 'markPrivate' | 'markReviewed' | 'delete' | 'restore'

export type Action = {
	label?: string
	icon?: string
	description?: string
	showDefault?: boolean // whether to show as a default action (appearing when not editing)
	showEdit?: boolean // whether to show as an edit action (appearing when  editing)
	// when confirmDialog is set, a confirm dialog is shown before the action is executed
	confirmDialog?: {
		heading?: string
		confirmLabel?: string
		confirmDisabled?: (data: any) => boolean // whether to disabled the confirm button
		render: (data: any) => TemplateResult
	}
	// allow to add listener while action runs. This is used for instance to alter data on write
	// and set `reviewStatus` to `edited`
	onAction?: (event: AnyEvent) => void
	// dynamically config the button
	config?: ButtonConfig
	// meta is used to know if we need to display the action in the metadata section
	meta?: {
		label: string,
		index: number // index used to sort the actions
	},
	bulk?: {
		render: (selectedItems: any[], data?:  any) => TemplateResult
		index: number // index used to sort the actions
		tooltip?: string,
		disabled?: (data: any[]) => boolean
	},
	pushHistory?: boolean // true to push the action to the history when executed
	onClick?: (data: any) => void // as simple handler - this will not trigger any entity Event
	handler?: Handler
	// the event to fire when the action is executed - the default is EntityAction
	event?: Exclude<TypeofAnyEvent, typeof Dirty>
	condition?: (data: any) => boolean
}
export type Actions = { [key: string]: Action }

type TextComponent = 'textfield' | 'textarea' | 'md'
type DateComponent = 'datefield'
type SliderComponent = 'slider'
type UploadComponent = 'upload'
type BooleanComponent = 'checkbox' | 'switch'
type SelectComponent = 'select' | 'multi-select'
interface ModelComponentBase {
	label?: string
	helper?: string
	required?: boolean
	icon?: string
	class?: string
	table?: {
		index: number
		label?: string,
		optional?: boolean
	}
	// set requestUpdate to true to request an update when the value changes
	requestUpdate?: boolean
	// do not render component when the function returns true 
	// only hide it when the function returns 'hide'
	hide?: (data: any) => boolean | 'hide'
	// do render the component only when the function returns true
	show?: (data: any) => boolean
	onInput?: (data: any, value: any, el: LitElement) => void // function called when the component value is updated
}
export interface Lookup {
	label: string
	code: string
	key?: string
	index?: number
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
	[key in keyof T]: ModelComponent | Model<T[key]>
} & { ref?: { [key: string]: ModelComponent } }

// export type Model<T, Ref> = {
// 	[key in keyof T]: ModelComponent | Model<T[key]> 
// } | {ref: ModelComponent}

type BtnCfg = {
	disabled?: boolean
	outlined?: boolean
	unelevated?: boolean
}

export type ButtonConfig = BtnCfg | ((data: any, entityStatus?: EntityStatus) => BtnCfg)

export interface FieldConfig {
	disabled?: boolean
	label?: string
}

export interface FieldConfigUpload extends FieldConfig {
	store?: string
	path?: string
	maxFiles?: number
	accept?: string
	maxFileSize?: number
}
/**
 * Type for setting data Access
 */
type GroupAccess = {
	owner: string
	read: string[]
	write: string[]
}

type OrganisationAccess = {
	owner: string
	owners: string[]
}

type UserAccess = {
	owner: string
}

type Status = 'public' | 'private'

export type Access = {
	app: string
	group: GroupAccess
	organisation: OrganisationAccess
	user: UserAccess
	status: Status

}

// ref refers to external, not entered by users
export type Ref = {
	user: string
	business?: string
	organisation?: string
}
export interface MetaData {
	access: Access
	timestamp: FieldValue
	deleted: boolean
	type: string
	
}
export interface Data {
	metaData?: MetaData,
	ref?: Ref
}
export interface DefaultInterface {
	// $id: string
}

export interface DataInterface<R = Ref, M = MetaData> {
	$id: string
	ref?: R
	metaData: M
}
interface EntityBase extends LitElement {
	entity: Entity
	data?: any
	appID: string
}

export interface EntityElement extends EntityBase {
	id: string
	docId?: string
	_selected?: number
	entityStatus: EntityStatus
	entityAccess: EntityAccess
}

// interface for list
export interface EntityElementList extends EntityBase {
	entityStatus?: EntityStatus
	entityAccess?: EntityAccess
	size?: number
	selectedItems?: any[]
	showGridSelectColumn?: boolean
}

export type ColumnsConfig = {
	showSelectionColumn?: boolean
	template?: TemplateResult
	options?: {
		[key: string]: boolean | string
	}
}


export type RenderConfig = {
	selected?: number,
	entityAccess?: EntityAccess,
	entityStatus?: EntityStatus,
	options?: {
		[key: string]: boolean
	}
}
/**
 * Interface for render utility functions
 * to be applied for an entity
 */
export interface EntityRenderer<T, A = DefaultActions> {

	/**
 	 * Render a form for an entity
	 * @param data - the data for the form
	 * @param config - the configuration for the form
	 */
	renderForm(data: T, config?: RenderConfig): TemplateResult | undefined

	/**
	 * Utility render functions for a group of entity actions to render as buttons
	 * @param entityAccess 
	 * @param entityStatus 
	 * @param data 
	 * @returns 
	 */
	renderActions(data: T, config: RenderConfig): TemplateResult | undefined

	/**
	 * Render title for an entity
	 * @param data
	 * @param config
	 * @returns TemplateResult
	 */
	renderTitle(data: T, config?: RenderConfig): TemplateResult

	/**
	 * Render content of an entity
	 * @param data
	 * @param config
	 * @returns TemplateResult
	 */
	renderContent(data: T, config?: RenderConfig): TemplateResult

	/**
	 * Render a grid of entities
	 * 
	 * @param data - the data for the grid
	 * @param withOrganisation - true to display organisation column
	 */
	renderGrid(data: T[], config?: ColumnsConfig): TemplateResult

	/**
	 * Render columns for the grid
	 * 
	 * @param config - columns configuration - ColumnConfig
	 */
	renderGridColumns(config: ColumnsConfig): TemplateResult

	/**
	 * The renderer for gridRowDetailsRenderer 
	 * 
	 * @param data - the data for the grid
	 * @param withOrganisation - true to display organisation column
	 */
	gridDetailRenderer(item: T, model?: GridItemModel<T>, grid?: Grid): TemplateResult

	/**
		* Utility render functions for a single entity actions to render as button and trigger an Action event
		* @param actionName the name of the action to render
		* @param config button config to apply to the button 
		* @param beforeDispatch a function called before the action is dispatched - dispatch will not happen if this function returns false 
		* @param onResolved a function called when the action event.detail.promise is resolved
		* @returns 
		*/
	renderAction(actionName: A, data?: any, config?: ButtonConfig, beforeDispatch?: () => boolean | string | void, onResolved?: (promise: any) => void): TemplateResult
}