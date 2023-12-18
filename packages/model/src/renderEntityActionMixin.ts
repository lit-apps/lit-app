
import type { LappButton } from '@lit-app/cmp/button/button';
import { ToastEvent } from '@lit-app/event';
import { html, nothing, TemplateResult } from 'lit';
import AbstractEntity from './entityAbstract';
import {
	ActionI, AppAction,
	AppActionEmail,
	Close,
	Create,
	Delete,
	Dirty,
	Edit,
	EntityAction,
	EntityCreateDetail,
	Open,
	Reset,
	Update,
	Write
} from './events';
import RenderEntityCreateMixin,  { RenderEntityCreateInterface } from './renderEntityCreateMixin';
import { AccessActionI, ActionDetail, Collection, CollectionI,  DataI, EntityAccess, EntityElement, EntityStatus, PartialBy, RenderConfig } from './types';
import {
	Action,
	ActionType, 
	Actions,
	ButtonConfig
} from './types/action';
import entries from './typeUtils/entries';
import('@lit-app/cmp/button/button');
import('@material/web/icon/icon');
import('@material/web/iconbutton/filled-icon-button.js');
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
				unelevated: entityStatus?.isDirty
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
	delete: {
		label: 'Delete',
		icon: 'delete',
		pushHistory: true,
		// event: MarkDeleted,
		meta: {
			label: 'Deleted',
			index: -7
		},
		confirmDialog: {
			heading: 'Confirm Delete',
			render(data: any): TemplateResult {
				return html`<p>You are about to delete <strong>${data.name || 'an entity'}</strong>. Please confirm.</p>`;
			}
		},
		// handler: async function (this: HTMLElement, ref: DocumentReference, data: any, event) {
		//   // update the reporting state for the organisation
		//   console.log('MarkDeleted', ref, data, event)
		//   event.detail.promise = updateDoc(ref, { 'metaData.deleted': true })

		// }
		// ,
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
				return html`<p>You are about to mark <strong>${data.name || 'an entity'}</strong> as deleted. Please confirm.</p>`;
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

type Constructor<T = {}> = new (...args: any[]) => T;
export declare class RenderInterface<D, A extends Actions>  extends RenderEntityCreateInterface<D & DataI> {
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
		data?: D | CollectionI<D>,
		config?: ButtonConfig,
		beforeDispatch?: () => boolean | string | void,
		onResolved?: (promise: any) => void): TemplateResult

	/**
 * Utility render functions for a group of entity actions to render as buttons icons
 * @param entityAccess 
 * @param entityStatus 
 * @param data 
 * @returns 
 */
	renderBulkActions(selectedItems: Collection<D>, data: Collection<D>, entityAccess?: EntityAccess, entityStatus?: EntityStatus): TemplateResult

	renderEditActions(data: D): TemplateResult
	renderDefaultActions(data: D): TemplateResult
	renderBulkActions(selectedItems: Collection<D>, data: Collection<D>, entityAccess?: EntityAccess, entityStatus?: EntityStatus): TemplateResult
	renderBulkAction(selectedItems: Collection<D>, data: Collection<D>, action: Action, actionName: keyof A): TemplateResult
}

export interface StaticEntityActionI<D, A extends Actions > extends AbstractEntity {
	actions: A 
	_dispatchTriggerEvent(event: CustomEvent, el: HTMLElement): CustomEvent
	getEvent(actionName: keyof A, data: D, el?: HTMLElement, bulkAction?: boolean): CustomEvent
	renderAction(actionName: keyof A, element: HTMLElement, data: any, config?: ButtonConfig, beforeDispatch?: () => boolean | string | void, onResolved?: (promise: any) => void): TemplateResult
	onActionClick(actionName: keyof A, host: HTMLElement, data?: any, beforeDispatch?: () => boolean | string | void, onResolved?: (promise: any) => void, eventGetter?: () => CustomEvent): (e: Event & { target: LappButton }) => Promise<void>
	getAction(key: keyof A): Action
	getEntityAction<T extends ActionI = ActionI>(detail: T['detail'], actionName: T['actionName'], confirmed?: boolean, bulkAction?: boolean): EntityAction<T>
	setPrototypeOfActions(actions: DefaultActionsType , Proto: AbstractEntity): void
}

export default function renderMixin<D, A extends Actions>(superclass: Constructor<AbstractEntity>, actions: A) {
	class R extends RenderEntityCreateMixin(superclass) {
		showActions: boolean = false

		/**
			* inspired from https://github.com/Microsoft/TypeScript/issues/3841#issuecomment-1488919713
			* We will need to set the type of constructor on all subclasses so that
			* the type of actions is properly inferred. 
			*/
		// @ts-ignore
		declare ['constructor']: typeof R

		create(details: PartialBy<EntityCreateDetail, 'entityName'>) {
			details.entityName = this.entityName;
			details.data = this.processCreateData(details.data);
			const event = new Create(details as EntityCreateDetail, this.actions.create);
			return this._dispatchTriggerEvent(event);
		}

		open(entityName: string, id?: string) {
			if (id) {
				const event = new Open({ id, entityName }, this.actions.open);
				return this._dispatchTriggerEvent(event);
			}
			return null
		}

		markDirty(dirty: boolean = true) {
			const event = new Dirty({ entityName: this.entityName, dirty: dirty });
			return this._dispatchTriggerEvent(event);
		}

		getAction(key: keyof A): Action {
			return (this.constructor as unknown as R).getAction(key)
		}


		public dispatchAction(actionName: keyof A): CustomEvent {
			// @ts-ignore
			const action = this.actions[actionName];
			const event = new EntityAction({ id: this.host.id, entityName: action.entityName || this.entityName }, action, String(actionName));
			return this._dispatchTriggerEvent(event);
		}

		private _dispatchTriggerEvent(event: CustomEvent, el: HTMLElement = this.host) {
			el.dispatchEvent(event);
			return event
		}

		private getEvent(actionName: keyof A, data: any, bulkAction: boolean = false) {
			if (actionName === 'create') {
				console.warn('getEvent for create is deprecated!')
				return new Create({ entityName: this.entityName, data: this.getNewData() }, this.actions.create);
			}
			return (this.constructor as unknown as StaticEntityActionI<D, A>).getEvent(actionName, data, this.host, bulkAction)
		}
		override renderContent(data: D, config?: RenderConfig) {
			if (this.showActions) {
				return html`${this.renderEntityActions(data, config)}`
			}
			return nothing
		}
		renderEntityActions(data: D, config?: RenderConfig) {
			const entityAccess = config?.entityAccess || this.host.entityAccess;
			const entityStatus = config?.entityStatus || this.host.entityStatus;

			if (!entityAccess?.canEdit || this.realTime) return;
			return html`
			<div class="layout horizontal center">
				${entityStatus?.isEditing ?
					html`
						${this.renderAction('write', data)}
						${this.renderAction('cancel', data)}
						` :
					html`
						${this.renderAction('edit', data)}
						`
				}
				<span class="flex"></span>
				${entityStatus?.isEditing ? this.renderEditActions(data) : this.renderDefaultActions(data)}
			</div>`
		}

		renderAction(
			actionName: keyof A,
			data?: any,
			config?: ButtonConfig,
			beforeDispatch?: () => boolean | string | void,
			onResolved?: (promise: any) => void) {
			// @ts-ignore
			const action = (this.actions)[actionName];
			if (!action) {
				console.error(`Entity ${this.entityName} has no action found for ${String(actionName)}`);
			}
			const actionConfig = typeof (action.config) === 'function' ? action.config(data || this.host.data, this.host.entityStatus) : action.config;
			config = typeof (config) === 'function' ? config(data || this.host.data, this.host.entityStatus) : config;
			const cfg = Object.assign({}, actionConfig, config);
			// the button is active when: 
			const disabled = cfg?.disabled === true
			const unelevated = cfg?.unelevated ?? false
			const text = cfg?.text ?? false
			const outlined = cfg?.outlined ?? !text
			const label = cfg?.label ?? action.label
			return html`<lapp-button 
					class="${actionName} action"
					.icon=${action.icon || ''} 
					
					@click=${(this.constructor as unknown as StaticEntityActionI<D, A>)
					.onActionClick(actionName, this.host, data, beforeDispatch, onResolved, () => this.getEvent(actionName, data))}
					.disabled=${disabled}
					.outlined=${outlined}
					.unelevated=${unelevated}
					>
						${label}
					</lapp-button>`
		}

		renderEditActions(data: D) {
			const edit = []
			// we loop with key in as we want to include prototype properties
			for (const key in this.actions) {
				const action = this.getAction(key);
				if (action.showEdit) {
					// only add is showEdit is a function and evaluates to true
					if (typeof (action.showEdit) === 'function') {
						if (action.showEdit(data)) {
							edit.push(this.renderAction(key, data))
						}
					} else {
						edit.push(this.renderAction(key, data))
					}
				}
			}
			return edit;

		}
		renderDefaultActions(data: D) {
			const edit = []
			// we loop with key in as we want to include prototype properties
			for (const key in this.actions) {
				const action = this.getAction(key);
				if (action.showDefault) {
					// only add is showDefault is a function and evaluates to true
					if (typeof (action.showDefault) === 'function') {
						if (action.showDefault(data)) {
							edit.push(this.renderAction(key, data))
						}
					} else {
						edit.push(this.renderAction(key, data))
					}
				}
			}
			return edit;
		}

		renderBulkActions(selectedItems: Collection<D>, data: Collection<D>, _entityAccess?: EntityAccess, _entityStatus?: EntityStatus) {
			const bulkActions = entries<Actions>(this.actions)
				.filter(([_key, action]) => action.bulk)
				.sort(([_ka, a], [_kb, b]) => ((a.bulk?.index || 0) - (b.bulk?.index || 0)))

			if (bulkActions.length === 0) return;

			return html`
		<div class="layout horizontal">
			${bulkActions.map(([key, action]) => this.renderBulkAction(selectedItems, data, action, key))}
		</div>`
		}

		renderBulkAction(selectedItems: Collection<D>, data: Collection<D>, action: Action, actionName: keyof A) {
			const bulkActionHandler = () => {
				const event = this.getEvent(actionName, data, true) as EntityAction | AppAction | AppActionEmail;
				event.detail.selectedItems = selectedItems

				// const event = new EntityAction({ id: this.host.id, entityName: this.entityName }, action, actionName);
				return this._dispatchTriggerEvent(event);
			}
			return html`
		 <pwi-tooltip skipFocus discrete .tipWidth=${120} .message=${action.bulk?.tooltip || action.label} >
				<md-filled-icon-button 
					aria-haspopup="true" 
					aria-label=${action.bulk?.tooltip || action.label || ''} 
					.disabled=${action.bulk?.disabled?.(selectedItems) || false}
					@click=${bulkActionHandler}>
					<lapp-icon .icon=${action.icon}></lapp-icon>
				</md-filled-icon-button>
			</pwi-tooltip>
		`
		}


	}


	const staticApply = {
		actions: actions || defaultActions,
		_dispatchTriggerEvent(event: CustomEvent, el: HTMLElement) {
			el.dispatchEvent(event);
			return event
		},

		getEvent(this: StaticEntityActionI<D, A>, actionName: string, data: any, el?: HTMLElement, bulkAction: boolean = false): CustomEvent {
			if (actionName === 'create') {
				throw new Error('Create is not allowed in static get Event')
			}
			const action = this.getAction(actionName)
			if (!action.event) {
				action.event = EntityAction
			}

			// id is the path after /app/appID, whereas docID is the single id for a document
			const id: string | null = data?.$id || ((el as EntityElement)?.docId ? (el as EntityElement)?.docId : el?.id) || null;
			let event
			switch (action.event) {

				case Edit:
				case Close:
				case Reset:
					if (!id && import.meta.env.DEV) {
						console.warn('id is required for Edit, Close and Reset')

					}
					event = new action.event({ id: id, entityName: this.entityName }, action);
					break;
				case Delete:
				case Update:
				case Write:
					if (!id && import.meta.env.DEV) {
						console.warn('id is required for Delete, Update, and Write')
					}
					event = new action.event({ id: id, entityName: this.entityName, data: data }, action);
					break;
				case Open:
					if (!id && import.meta.env.DEV) {
						console.warn('id is required for Open')
					}
					event = new action.event({ id: id, entityName: data?.metaData?.type || this.entityName }, action);
					break;
				case AppActionEmail:
					if (!id && import.meta.env.DEV) {
						console.warn('id is required for AppActionEmail')
					}
					event = new action.event({
						id: id,
						entityName: this.entityName,
						data: data,
						target: { entity: this.entityName, entityId: id }
					}, action, false, bulkAction);
					break
				case EntityAction:
					event = this.getEntityAction(data, actionName, false, bulkAction)
					break
				case AppAction:
					event = new action.event({ id: id, entityName: this.entityName, data: data }, action, actionName as string, false, bulkAction);
					break
				default:
					throw new Error(`Unknown event type ${action.event}`)
			}
			return event

		},

		renderAction(
			this: StaticEntityActionI<D, A>,
			actionName: keyof A,
			element: HTMLElement,
			data: any = {},
			config?: ButtonConfig & { bulkAction?: boolean },
			beforeDispatch?: () => boolean | string | void,
			onResolved?: (promise: any) => void): TemplateResult {
			const action = this.getAction(actionName);
			if (!action) {
				console.error(`entity ${this.entityName} has no action found for ${String(actionName)}`);
			}
			const actionConfig = typeof (action.config) === 'function' ? action.config(data) : action.config;
			config = typeof (config) === 'function' ? config(data) : config;
			const cfg = Object.assign({}, actionConfig, config);
			// the button is active when: 
			const disabled = cfg?.disabled === true
			const unelevated = cfg?.unelevated ?? false
			const tonal = cfg?.tonal ?? false
			const text = cfg?.text ?? false
			const outlined = cfg?.outlined ?? !text
			return html`<lapp-button 
				class="${actionName} action"
				.icon=${action.icon || ''} 
				@click=${this.onActionClick(actionName, element, data, beforeDispatch, onResolved)}
				.disabled=${disabled}
				.outlined=${outlined}
				.tonal=${tonal}
				.unelevated=${unelevated}
				>
					${action.label}
				</lapp-button>`

		},

		onActionClick(
			this: StaticEntityActionI<D, A>,
			actionName: keyof A,
			host: HTMLElement,
			data?: any,
			beforeDispatch?: () => boolean | string | void,
			onResolved?: (promise: any) => void,
			eventGetter?: () => CustomEvent,
		) {
			const action = this.getAction(actionName);
			if (!action) {
				console.error(`Entity ${this.entityName} has no action found for ${String(actionName)}`);
			}
			return async (e: Event & { target: LappButton }) => {
				if (beforeDispatch?.() === false) {
					console.log('beforeDispatch returned false')
					return;
				}
				const button = e.target
				button.loading = true
				// TODO: use icon slot for the button
				try {
					// we can pass a simple handler function to the action
					if (action.onClick) {
						await action.onClick.call(host, data)
						button.loading = false
						return
					}
					const event = eventGetter ? eventGetter() : this.getEvent(actionName, data, host);
					this._dispatchTriggerEvent(event, host);
					const promise = await event.detail.promise
					if (onResolved) {
						onResolved(promise);
					}
					button.loading = false

				} catch (error) {
					button.loading = false
					console.error(error)
					// TODO: centralize the way we handler errors (see stripe-web-sdk for inspiration)
					// For the time being, we just dispatch Toast Event
					host?.dispatchEvent(new ToastEvent((error as Error).message, 'error'))
				}
			}
		},
		getAction(this: StaticEntityActionI<D, A>, key: keyof Actions): Action {
			return this.actions[key]
		},

		getEntityAction<T extends ActionI = ActionI>(
			this: StaticEntityActionI<D, A>,
			detail: T['detail'],
			actionName: keyof A,
			confirmed?: boolean,
			bulkAction?: boolean,
		) {
			const action = this.getAction(actionName);
			const d: ActionDetail = {
				entityName: action.entityName || this.entityName,
				data: detail
			}
			// @ts-ignore  
			return new EntityAction<T>(d as ActionDetail<T['detail']>, action, actionName, confirmed, bulkAction)
		},
		/** setPrototypeOfActions
		 * Set actions, inheriting Proto.actions as prototype
		 * This is useful when some actions can only be performed 
		 * by a db-ref higher up in the hierarchy
		 */
		setPrototypeOfActions(actions: Actions , Proto: StaticEntityActionI<D, A>) {
			const _actions = { ...actions } as A
			Object.setPrototypeOf(_actions, Object.fromEntries(
				entries<Actions>({ ...Proto.actions }).map(([key, value]) => {
					value = { ...value };
					(value as Action).entityName = Proto.entityName;
					return [key, value]
				})
			))

			this.actions = _actions
		}




	}
	Object.assign(R, staticApply);
	return R as unknown as Constructor<RenderInterface<D, A>> & typeof superclass & StaticEntityActionI<D, A>;
}

