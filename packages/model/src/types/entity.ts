import type { Grid, GridItemModel } from '@vaadin/grid'
import type { ButtonConfig } from './action'
import type { LitElement, TemplateResult } from 'lit'
import type Entity from '../entity'
import type { DefaultActions } from '../entity'

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

interface EntityBase<T = any> extends LitElement {
	entity: Entity
	data?: T
	icon?: string
	heading?: string
	appID?: string
}
export interface DefaultI {
	
}

export interface EntityElement<T = any> extends EntityBase<T> {
	id: string // not sure this is needed
	docId?: string // not sure this is needed
	_selected?: number // not sure this is needed
	entityStatus: EntityStatus
	entityAccess: EntityAccess
}

// interface for list
export interface EntityElementList<T = any> extends EntityBase<T> {
	entityStatus?: EntityStatus
	entityAccess?: EntityAccess
	size?: number
	selectedItems?: T[]
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