import type { LappButton } from '@lit-app/cmp/button/button';
import { TemplateResult, html } from 'lit';
import AbstractEntity from '../abstractEntity';
import {
	ActionI,
	AnyEvent,
	Close,
	Create,
	Delete,
	Dirty,
	Edit,
	EntityAction,
	EntityCreateDetail,
	Open,
	Reset,
	Write
} from '../events';
import type { PartialBy } from '../typeUtils/partialBy';
import { Action, ActionType, Actions, ButtonConfig, OnResolvedT } from './action';
import { Collection, CollectionI, DataI } from './dataI';
import { DefaultI, EntityAccess, EntityStatus, RenderConfig } from './entity';
import { AccessActionI } from './entityAction';
import { RenderEntityCreateInterface } from './renderEntityCreateI';
/**
 * Actions inherited by all entities (provided they use @mergeStatic('actions'))
 * We do not set pushHistory those actions are automatically added
 * history and metaData events in `action-handler-mixin.ts`. However, we keep 
 * metaData here to display them in the UI. 
 */
const _defaultActions = {
	create: {
		label: 'Create',
		event: Create,
		meta: {
			label: 'Created',
			index: -10
		}
	},
	write: {
		label: 'Save',
		event: Write,
		icon: 'save',
		config: (_data: any, entityStatus?: EntityStatus) => {
			return {
				filled: entityStatus?.isDirty
			}
		},
		meta: {
			label: 'Updated',
			index: -9
		}
	},
	cancel: {
		label: 'Cancel',
		icon: 'cancel',
		event: Reset,
	},
	edit: {
		label: 'Edit',
		icon: 'edit',
		event: Edit,
	},
	open: {
		label: 'Open',
		icon: 'open_in_new',
		event: Open,
	},
	close: {
		label: 'Open',
		icon: 'highlight_off',
		event: Close,

	},
	// delete is deprecated  use markDeleted instead
	// delete truly deletes the entity, while markDeleted sets the deleted flag
	delete: {
		label: 'Delete',
		icon: 'delete',
		pushHistory: true,
		event: Delete,
		meta: {
			label: 'Deleted',
			index: -7
		},
		confirmDialog: {
			heading: 'Confirm Delete',
			render(data: any): TemplateResult {
				return html`<p>You are about to delete <strong>${data.name || data.title || 'an entity'}</strong>. Please confirm.</p>`;
			}
		},
	},
	markDeleted: {
		label: 'Delete',
		icon: 'delete',
		pushHistory: true,
		meta: {
			label: 'Deleted',
			index: -7
		},
		confirmDialog: {
			heading: 'Confirm Delete',
			render(data: any): TemplateResult {
				return html`<p>You are about to mark <strong>${data.name || data.title || 'an entity'}</strong> as deleted. Please confirm.</p>`;
			}
		},
	},
	restore: {
		label: 'Restore',
		icon: 'restore_from_trash',
		// event: Restore,
		pushHistory: true,
		meta: {
			label: 'Restored',
			index: -8
		},
		// handler: async function (this: HTMLElement, ref: DocumentReference, data: any, event) {
		//   // update the reporting state for the organisation
		//   console.log('Restored', ref, data, event)
		//   event.detail.promise = updateDoc(ref, { 'metaData.deleted': false })

		// }
	},
	setAccess: {
		label: 'Set Access',
		event: EntityAction<AccessActionI>
	},
	addAccess: {
		label: 'Add Access',
		event: EntityAction<AccessActionI>
	},
	invite: {
		label: 'Invite',
		machineId: 'invite',
	},
	removeAccess: {
		label: 'Revoke Access',
		event: EntityAction<AccessActionI>,
		confirmDialog: {
			heading: 'Confirm Revoke Access',
			render(_data: any): TemplateResult {
				return html`<p>You are about to revoke access. Please confirm.</p>`;
			}
		},
	}
}
type DefaultActionsType = ActionType<typeof _defaultActions>
export const defaultActions: DefaultActionsType = _defaultActions

export declare class RenderInterface<D extends DefaultI, A extends Actions = Actions> extends RenderEntityCreateInterface<D & DataI> {
	/**
	 * Show actions: set true to show actions
	 */
	showActions: boolean
	actions: A
	
	protected renderContent(data: D, config?: RenderConfig): TemplateResult

	create(details: PartialBy<EntityCreateDetail, 'entityName'>): Create
	open(entityName: string, id?: string): Open | null
	markDirty(dirty?: boolean): Dirty
	dispatchAction(actionName: keyof A): CustomEvent
	/**
	 * Utility render method to render an group of actions
	 */
	renderEntityActions(data: D, config?: RenderConfig): TemplateResult
	/**
	 * Utility render functions for a single entity actions to render as button and trigger an Action event
	 * @param actionName the name of the action to render
	 * @param config button config to apply to the button 
	 * @param beforeDispatch a function called before the action is dispatched - dispatch will not happen if this function returns false 
	 * @param onResolved a function called when the action event.detail.promise is resolved
	 * @returns 
	 */
	renderAction(
		actionName: keyof A,
		data?: D | CollectionI<D>, // for serverActions this is the data to send to the server ! we should be able to type more strictly
		config?: ButtonConfig,
		beforeDispatch?: () => boolean | string | void,
		onResolved?: OnResolvedT): TemplateResult

	/**
	 * 
	 * @param actionName the name of the action to render
	 * @param data current data
	 * @param beforeDispatch a function called before the action is dispatched - dispatch will not happen if this function returns false
	 * @param onResolved  a function called when the action event.detail.promise is resolved
	 * @param eventGetter 
	 */
	onActionClick(
		actionName: keyof A, 
		data?: any, // for serverActions this is the data to send to the server ! we should be able to type more strictly
		beforeDispatch?: () => boolean | string | void, 
		onResolved?: OnResolvedT, 
		eventGetter?: () => CustomEvent): (e: Event & { target: LappButton }) => Promise<void>		
	/**
 * Utility render functions for a group of entity actions to render as buttons icons
 * @param entityAccess 
 * @param entityStatus 
 * @param data 
 * @returns 
 */
	renderBulkActions(selectedItems: Collection<D>, data: Collection<D>, entityAccess?: EntityAccess, entityStatus?: EntityStatus): TemplateResult

	renderEditActions(data: D, config?: RenderConfig): TemplateResult
	renderDefaultActions(data: D): TemplateResult
	renderBulkActions(selectedItems: Collection<D>, data: Collection<D>, entityAccess?: EntityAccess, entityStatus?: EntityStatus): TemplateResult
	renderBulkAction(selectedItems: Collection<D>, data: Collection<D>, action: Action, actionName: keyof A): TemplateResult
}

export interface StaticEntityActionI<D extends DefaultI, A extends Actions > extends AbstractEntity<D> {
	actions: A 
	_dispatchTriggerEvent(event: CustomEvent, el: HTMLElement): CustomEvent
	getEvent(actionName: keyof A, data: D, el?: HTMLElement, bulkAction?: boolean): AnyEvent
	renderAction(actionName: keyof A, element: HTMLElement, data: any, config?: ButtonConfig, beforeDispatch?: () => boolean | string | void, onResolved?: (promise: any) => void): TemplateResult
	onActionClick(actionName: keyof A, host: HTMLElement, data?: any, beforeDispatch?: () => boolean | string | void, onResolved?: OnResolvedT, eventGetter?: () => CustomEvent): (e: Event & { target: LappButton }) => Promise<void>
	getAction(key: keyof A): Action
	getEntityAction<T extends ActionI = ActionI>(detail: T['detail'], actionName: T['actionName'], confirmed?: boolean, bulkAction?: boolean): EntityAction<T>
	setPrototypeOfActions(actions: DefaultActionsType , Proto: AbstractEntity): void
}