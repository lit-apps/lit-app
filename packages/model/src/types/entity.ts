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

