import { LitElement, TemplateResult } from 'lit'
import AbstractEntity from '../entityAbstract'

export interface EntityI extends AbstractEntity { }

// storing the state of an entity
export type EntityStatus = {
	isDirty: boolean
	isEditing: boolean
	isSaving: boolean
	isLoading: boolean // true when the entity is loading data
	isDeleting: boolean
}

// storing the access information for an entity
export type EntityAccess = {
	isOwner: boolean
	canEdit: boolean
	canView: boolean
	canDelete: boolean
	// isSuper: boolean // true for super Admin 
}

export interface FieldConfig {
	disabled?: boolean
	label?: string
	class?: string
}

export interface FieldConfigUpload extends FieldConfig {
	store?: string
	path?: string
	maxFiles?: number
	accept?: string
	maxFileSize?: number
}

interface EntityBase<T = any> extends LitElement {
	entity: EntityI
	data?: T
	icon?: string
	heading?: string
	appID?: string
	renderTitle?: (data: T, config: RenderConfig) => TemplateResult
}
export interface DefaultI {

}

export interface EntityElement<T = any> extends EntityBase<T> {
	id: string // not sure this is needed
	docId: string | undefined
	entityStatus: EntityStatus
	entityAccess: EntityAccess
}

// interface for list
export interface EntityElementList<T = any> extends EntityBase<T> {
	entityStatus?: EntityStatus
	entityAccess?: EntityAccess
	size?: number
	selectedItems?: T[]
	// showGridSelectColumn?: boolean
}

export type ColumnsConfig = {
	showSelectionColumn?: boolean
	template?: TemplateResult
	options?: {
		[key: string]: boolean | string
	}
}

export type GridConfig = {
	preventDetails?: boolean // when true, will not render grid details
	preventDblClick?: boolean // when true, will not react to dbClick
}

export type RenderConfigOptional<T = any> = {
	columnsConfig?: ColumnsConfig,
	gridConfig?: GridConfig,
	cardConfig?: { [K in keyof Partial<T>]: T[K] }
	level?: number, // level to render the entity
	variant?: 'card' | 'default'
	layout?: 'horizontal' | 'vertical' | 'grid' // set the layout for card variant
	options?: {
		[key: string]: boolean
	}
}

export type RenderConfig<T = any> = RenderConfigOptional<T> & {
	entityAccess: EntityAccess,
	entityStatus: EntityStatus
}


/**
 * Interface for render utility functions
 * to be applied for an entity
 */


// export abstract class EntityI<T extends Object = Object> extends EntityRenderer<T> {

// 	static getAccess: GetAccess
// 	static actions: any
// 	static roles: Role[]
// 	static userLoader: (search: string) => Promise<any>
// 	static model: Model<DefaultI>
// 	static locale?: Strings
// 	static entityName: string

// 	static styles: CSSResult | CSSResult[];

// 	constructor(_host: EntityElement | EntityElementList, _realTime: boolean, _listenOnAction: boolean) {
// 		super()
// 	}

// 	icon!: string
// 	_selected!: number
// 	host!: EntityElement | EntityElementList
// 	realtime?: boolean
// 	listenOnAction?: boolean
// 	showMetaData!: boolean
// 	showActions!: boolean
// 	entityName!: string
// 	actions!: unknown
// 	abstract renderField(name: string, config?: FieldConfig | FieldConfigUpload, data?: T): TemplateResult | undefined
// 	abstract renderFieldUpdate(name: string, config?: FieldConfig | FieldConfigUpload, data?: T): TemplateResult | undefined
// 	// onError(error: Error): void
// 	abstract create(details: EntityCreateDetail): void
// 	abstract open(entityName: string, id?: string): void
// 	abstract dispatchAction(actionName: keyof EntityI['actions']): CustomEvent

// 	static getEntityAction<T extends AllActionI>(
// 		// _detail: PartialBy<ActionDetail<T['detail']>, 'entityName'>,
// 		_detail: T['detail'],
// 		_actionName: T['actionName'],
// 		_confirmed?: boolean,
// 		_bulkAction?: boolean,
// 	): EntityAction<T> {
// 		// @ts-ignore
// 		return new EntityAction<T>()
// 	}
// 	static getEvent<K extends { actions: Record<string, Action> }>(
// 		_actionName: keyof K['actions'],
// 		_data: any,
// 		_host?: HTMLElement,
// 		_bulkAction?: boolean,
// 	): CustomEvent { return new CustomEvent('action', {}) }
// 	static onActionClick<K extends { actions: Record<string, Action> }>(
// 		_actionName: keyof K['actions'],
// 		_host: HTMLElement,
// 		_data?: any,
// 		_beforeDispatch?: () => boolean | string | void,
// 		_onResolved?: (promise: any) => void,
// 		_getEvent?: () => CustomEvent,
// 	) { }
// 	static renderAction<K extends { actions: Record<string, Action> }>(
// 		_actionName: keyof K['actions'],
// 		_element: HTMLElement,
// 		_data: any = {},
// 		_config?: ButtonConfig,
// 		_beforeDispatch?: () => boolean | string | void,
// 		_onResolved?: (promise: any) => void) { }
// }
