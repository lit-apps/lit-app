import { LitElement, TemplateResult } from 'lit'
import { entityI} from '../types'

// storing the state of an entity
export type EntityStatus = {
	isDirty: boolean
	isEditing: boolean
	isSaving: boolean
	isLoading: boolean // true when the entity is loading data
	isDeleting: boolean
	isNew: boolean // true when the entity is new
}

// storing the access information for an entity
export type EntityAccess = {
	isOwner: boolean
	canEdit: boolean
	canView: boolean
	canDelete: boolean
}

interface EntityBase<T extends DefaultI = DefaultI> extends LitElement {
	entity: entityI<T>
	data?: T
	/**
	 * Whether the data has changed for a given entity and path
	 * @param path 
	 * @param entityName 
	 */
	hasChanged(path: string, entityName: string): boolean
	icon?: string
	heading?: string
	appID?: string
	// renderTitle?: (data: T, config: RenderConfig) => TemplateResult
}
export interface DefaultI {

}

export interface EntityElement<T extends DefaultI = DefaultI> extends EntityBase<T> {
	id: string // not sure this is needed
	docId: string | undefined
	entityStatus: EntityStatus
	entityAccess: EntityAccess
	isFormValid: () => boolean
	get canEdit(): boolean
}

// interface for list
export interface EntityElementList<T extends DefaultI = DefaultI> extends EntityBase<T> {
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

type OptionsT = {
	[key: string]: any
}
export type RenderConfigOptional< O = OptionsT, T = any> = {
	columnsConfig?: ColumnsConfig,
	gridConfig?: GridConfig,
	cardConfig?: { [K in keyof Partial<T>]: T[K] }
	level?: number, // level to render the entity
	heading?: string // heading to render
	variant?: 'card' | 'list' | 'default' 
	baseURL?: string // base url for the entity
	//isNew?: boolean // true when the entity is new
	layout?: 'horizontal' | 'vertical' | 'grid' // set the layout for card variant
	options?: O
}

export type RenderConfig<O = OptionsT, T = any> = RenderConfigOptional<O, T> & {
	entityAccess: EntityAccess,
	entityStatus: EntityStatus
	/**
	 * The id of the entity (docId)
	 */
	$id?: string | undefined
}

