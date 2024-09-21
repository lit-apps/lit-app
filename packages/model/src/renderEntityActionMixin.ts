
import type { LappButton } from '@lit-app/cmp/button/button';
import { ToastEvent } from '@lit-app/event';
import { html, nothing, TemplateResult } from 'lit';
import AbstractEntity from './abstractEntity';
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
import RenderEntityCreateMixin from './renderEntityCreateMixin';
import { ActionDetail, AnyEvent, Collection, EntityAccess, EntityElement, EntityStatus, PartialBy, RenderConfig } from './types';
import {
	Action,
	Actions,
	ButtonConfig,
	isOnClickAction,
	OnResolvedT
} from './types/action';
import { DefaultI } from './types/entity';
import entries from './typeUtils/entries';
import('@lit-app/cmp/button/button');
import('@material/web/icon/icon');
import('@material/web/iconbutton/filled-icon-button.js');

import { defaultActions, RenderInterface, StaticEntityActionI } from './types/renderEntityActionI';
export type { RenderInterface, StaticEntityActionI } from './types/renderEntityActionI';
export { defaultActions };

type Constructor<T = {}> = new (...args: any[]) => T;

export default function renderMixin<D extends DefaultI, A extends Actions>(superclass: Constructor<AbstractEntity>, actions: A) {
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
				console.warn('getEvent for create is deprecated! User `entity.create` instead.')
				return new Create({ entityName: this.entityName, data: this.processCreateData(data) }, this.actions.create);
			}
			return (this.constructor as unknown as StaticEntityActionI<D, A>).getEvent(actionName, data, this.host, bulkAction)
		}
		override renderContent(data: any, config: RenderConfig): TemplateResult | typeof nothing {
			if (this.showActions) {
				return html`<div class="layout horizontal center">${this.renderEntityActions(data, config)}</div>`
			}
			return nothing
		}
		renderEntityActions(data: D, config: RenderConfig): TemplateResult | typeof nothing {
			return this.renderBaseActions(data, config)
		}

		renderBaseActions(data: D, config: RenderConfig): TemplateResult | typeof nothing {
			const entityAccess = config.entityAccess || this.host.entityAccess;
			const entityStatus = config.entityStatus || this.host.entityStatus;

			if (!entityAccess?.canEdit || this.realTime) return nothing;
			return html`
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
				${entityStatus?.isEditing ? this.renderEditActions(data, config) : this.renderDefaultActions(data, config)}
			`
		}

		renderAction(
			actionName: keyof A,
			data?: any,
			config?: ButtonConfig,
			beforeDispatch?: () => boolean | string | void,
			onResolved?: OnResolvedT) {
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
			const filled = cfg?.filled ?? false
			const text = cfg?.text ?? false
			const outlined = cfg?.outlined ?? !text
			const label = cfg?.label ?? action.label
			return html`<lapp-button 
					class="${actionName} action"
					.icon=${action.icon || ''} 
					
					@click=${this.onActionClick(actionName, data, beforeDispatch, onResolved, () => this.getEvent(actionName, data))}
					.disabled=${disabled}
					.outlined=${outlined}
					.filled=${filled}
					>
						${label}
					</lapp-button>`
		}

		onActionClick(
			actionName: keyof A,
			data?: any,
			beforeDispatch?: () => boolean | string | void,
			onResolved?: OnResolvedT,
			eventGetter?: () => CustomEvent,
		) {
			return (this.constructor as unknown as StaticEntityActionI<D, A>)
				.onActionClick(actionName, this.host, data, beforeDispatch, onResolved, eventGetter)

		}
		renderEditActions(data: D, _config: RenderConfig) {
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
		renderDefaultActions(data: D, _config?: RenderConfig) {
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

		// create(data: Partial<D>, el: HTMLElement): CustomEvent {
		// 	const e = new Create({ entityName: this.entityName, data: data }, this.actions.create);
		// 	return this._dispatchTriggerEvent(e, el);
		// },

		getEvent(this: StaticEntityActionI<D, A>, actionName: string, data: any, el?: HTMLElement, bulkAction: boolean = false): CustomEvent {
			if (actionName === 'create') {
				throw new Error('Create is not allowed in static get Event')
			}
			const action = this.getAction(actionName)
			if (!action.event) {
				action.event = EntityAction
			}

			// id is the path after /app/appID, whereas docID is the single id for a document
			let id: string = ''
			if (!bulkAction) {
				id = data?.$id || ((el as EntityElement)?.docId ? (el as EntityElement)?.docId : el?.id) || '';
			}
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
		// static methods
		renderAction(
			this: StaticEntityActionI<D, A>,
			actionName: keyof A,
			element: HTMLElement,
			data: any = {},
			config?: ButtonConfig & { bulkAction?: boolean },
			beforeDispatch?: () => boolean | string | void,
			onResolved?: OnResolvedT): TemplateResult {
			const action = this.getAction(actionName);
			if (!action) {
				console.error(`entity ${this.entityName} has no action found for ${String(actionName)}`);
			}
			const actionConfig = typeof (action.config) === 'function' ? action.config(data) : action.config;
			config = typeof (config) === 'function' ? config(data) : config;
			const cfg = Object.assign({}, actionConfig, config);
			// the button is active when: 
			const disabled = cfg?.disabled === true
			const filled = cfg?.filled ?? false
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
				.filled=${filled}
				>
					${action.label}
				</lapp-button>`

		},

		// static methods
		onActionClick(
			this: StaticEntityActionI<D, A>,
			actionName: keyof A,
			host: HTMLElement,
			data?: any,
			beforeDispatch?: () => boolean | string | void,
			onResolved?: OnResolvedT,
			eventGetter?: () => AnyEvent,
		) {
			const action = this.getAction(actionName);
			if (!action) {
				console.error(`Entity ${this.entityName} has no action found for ${String(actionName)}`);
			}
			onResolved = onResolved || action.onResolved;
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
					if (isOnClickAction(action)) {
						await action.onClick.call(host, data)
						button.loading = false
						return
					}
					const event = eventGetter ? eventGetter() : this.getEvent(actionName, data, host);
					// we need to dispatch the event from the same target as the original event
					this._dispatchTriggerEvent(event, e.target || host);
					const promise = await event.detail.promise
					if (onResolved) {
						onResolved(promise, host, event);
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
			if (!action) throw new Error(`Action ${String(actionName)} not found for entity ${this.entityName}`)
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
		setPrototypeOfActions(actions: Actions, Proto: StaticEntityActionI<D, A>) {
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

