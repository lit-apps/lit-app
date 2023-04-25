// if (import.meta.hot) {
//   import.meta.hot.on('entity-update', (data) => {
//     // trying out HMR for entity
//     console.info('entity-update', data)
//   })
// }

import { html, TemplateResult } from 'lit'
import { get } from '@preignition/preignition-util/src/deep';
import { activeItemChanged } from '@preignition/preignition-util/src/grid'
import '@vaadin/grid/theme/material/vaadin-grid.js';

import '@material/mwc-button'

import {
  Model,
  Action,
  // Actions,
  ButtonConfig,
  FieldConfig,
  ModelComponent,
  ModelComponentSelect,
  DefaultI,
  ModelComponentText,
  EntityStatus,
  EntityAccess,
  EntityElement,
  EntityElementList,
  ColumnsConfig,
  RenderConfig,
  FieldConfigUpload
} from './types';
import {
  EntityAction,
  Reset,
  // Delete,
  // Create,
  Edit,
  Write,
  Create,
  EntityCreateDetail,
  Delete,
  Restore,
  MarkDeleted,
  Open,
  Close,
  AppAction,
  Dirty,
  AppActionEmail,
  Update,
  AnyEvent
} from './events'
import { MetaData, Ref, DataI } from '@lit-app/base-model';
import { DocumentReference, serverTimestamp, updateDoc } from 'firebase/firestore';
import { renderField } from './renderField';
import {
  gridRowDetailsRenderer,
} from 'lit-vaadin-helpers';
import { Grid } from '@vaadin/grid';
import { AppToastEvent } from '@lit-app/app-event';

/**
 * Decorator to merge static properties of a class with the properties of a superclass.
 * This is used form instance to inherit actions defined in a superclass when extending
 * @param key - the static key to merge
 */
export function mergeStatic(key: string): ClassDecorator {
  return (target: any) => {
    if (target.hasOwnProperty(key)) {
      const proto = Object.getPrototypeOf(target)[key]
      // merge individual keys with proto keys
      Object.keys(target[key]).forEach((k) => {
        if (proto[k]) {
          target[key][k] = { ...proto[k], ...target[key][k] }
        }
      })

      target[key] = { ...proto, ...target[key] }

    }
    return target
  }
}

/**
 * Actions inherited by all entities (provided they use @mergeStatic('actions'))
 * We do not set pushHistory those actions are automatically added
 * history and metaData events in `action-handler-mixin.ts`. However, we keep 
 * metaData here to display them in the UI. 
 */
export type DefaultActions = 'create' | 'edit' | 'write' | 'cancel' | 'delete' | 'restore' | 'open' | 'close'
export type Actions = Record<DefaultActions, Action>
const actions: Actions = {
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
    config: (data: any, entityStatus?: EntityStatus) => {
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
    event: MarkDeleted,
    meta: {
      label: 'Deleted',
      index: -7
    },
    confirmDialog: {
      heading: 'Confirm Delete',
      render(data: any): TemplateResult {
        return html`<p>You are about to delete an entity. Please confirm.</p>`;
      }
    },
    handler: async function (this: HTMLElement, ref: DocumentReference, data: any, event) {
			// update the reporting state for the organisation
			console.log('MarkDeleted', ref, data, event)
      event.detail.promise = updateDoc(ref, {'metaData.deleted': true })
			
		}
    ,
  },
  restore: {
    label: 'Restore',
    icon: 'restore_from_trash',
    event: Restore,
    meta: {
      label: 'Restored',
      index: -8
    },
    handler: async function (this: HTMLElement, ref: DocumentReference, data: any, event) {
			// update the reporting state for the organisation
			console.log('Restored', ref, data, event)
      event.detail.promise = updateDoc(ref, {'metaData.deleted': false })
			
		}
  },
}



/**
 * Base class for entity. 
 * 
 * And entity has a model, defining the structure of the data,
 * and actions, defining the operations that can be performed on the data.
 * 
 * It can also contain renderer helper  
 */
export default class Entity<
  Interface extends DefaultI = DefaultI,
  ActionKeys extends DefaultActions = DefaultActions> {
  static _entityName: string
  static get entityName(): string {
    const name = this._entityName || this.name
    return name.charAt(0).toLowerCase() + name.slice(1);
  }
  static set entityName(name): string {
    this._entityName = name
  }
  static model: Model<DefaultI>
  static actions: Record<string, Action> = actions
  static setActions(actions: Actions) {
    const superCtor = Object.getPrototypeOf(this) as typeof Entity;
    this.actions = Object.assign(superCtor.actions || {}, actions);
  }

  /**
   * @param element the element to render the action on
   * @param realTime when true, will dispatch update events on data-input 
   *         this also changes the rendering of renderActions
   * @param listenOnAction when true, will listen to action events on the element
   */
  constructor(protected element: EntityElement | EntityElementList, public realTime: boolean = false, public listenOnAction: boolean = false) {

    // we only add event listeners if the element is a dataController (e.g. skip list and grids)
    if (this.listenOnAction) {
      Object.entries(this.actions).forEach(([_k, action]) => {
        if (action.event && action.onAction) {
          element.addEventListener(action.event.eventName, ((event: AnyEvent) => {
            action.onAction?.call(this.element, event)
            event.onActionProcessed = true;
          }) as EventListener)
        }
      })
    }
  }

  get entityName() {
    return (this.constructor as typeof Entity).entityName 
    
  }
  get model() {
    return (this.constructor as typeof Entity).model
  }
  get actions() {
    return (this.constructor as typeof Entity).actions;
  }

  /**
   * Bind an Entity with a LitElement. 
   * This needs to be done before any other operations like rendering can be performed.
   * @param el ReactiveElement
   */
  public bind(el: EntityElement) {
    this.element = el;
  }

  /**
    * renders a data-entry field, depending on the model definition
    */
  public renderField(name: string, config?: FieldConfig | FieldConfigUpload, data?: Interface): TemplateResult | undefined {
    if (!this.element) {
      throw new Error('Entity not bound to element');
    }
    return (renderField<Interface>).call(this.element as EntityElement, name, data ?? this.element.data, false, this.model, this, config);
  }
  /**
   * renders a data-entry field, depending on the model definition
   * and updates the data object on input
   */
  public renderFieldUpdate(name: string, config?: FieldConfig | FieldConfigUpload, data?: Interface) {
    if (!this.element) {
      throw new Error('Entity not bound to element');
    }
    return (renderField<Interface>).call(this.element as EntityElement, name, data ?? this.element.data, true, this.model, this, config);
  }

  protected onError(error: Error) {
    console.error(error)
    // TODO: centralize the way we handler errors (see stripe-web-sdk for inspiration)
    // For the time being, we just dispatch Toast Evnt
    this.element.dispatchEvent(new AppToastEvent(error.message, 'error')))
  }

  public create(details: EntityCreateDetail) {
    details.entityName = this.entityName;
    const event = new Create(details, this.actions.create);
    return this._dispatchTriggerEvent(event);
  }

  public open(entityName: string, id?: string ) {
    if (id) {
        const event = new Open({ id, entityName }, this.actions.open);
        return this._dispatchTriggerEvent(event);
    }
    return null
    
  }

  public dispatchAction(actionName: ActionKeys | DefaultActions): CustomEvent {
    const action = this.actions[actionName as DefaultActions];

    const event = new EntityAction({ id: this.element.id, entityName: this.entityName }, action, String(actionName));
    return this._dispatchTriggerEvent(event);
  }

  private _dispatchTriggerEvent(event: CustomEvent) {
    this.element.dispatchEvent(event);
    return event
  }

  private _getEvent(action: Action, actionName: ActionKeys | DefaultActions, data: any, bulkAction: boolean = false) {
    if (!action.event) {
      action.event = EntityAction
    }

    // id is the path after /app/appID, whereas docID is the single id for a document
    const id = data?.$id || ((this.element as EntityElement).docId ? (this.element as EntityElement).docId : this.element.id) as string;;
    let event
    switch (action.event) {
      case Delete:
      case MarkDeleted:
      case Update:
      case Restore:
      case Write:
        event = new action.event({ id: id, entityName: this.entityName, data: data }, action);
        break;
      case Create:
        event = new action.event({ entityName: this.entityName, data: this.getNewData() }, action);
        break;
      case Edit:
      case Close:
      case Reset:
        event = new action.event({ id: id, entityName: this.entityName }, action);
        break;
      case Open:
        event = new action.event({ id: id, entityName: data?.metaData?.type || this.entityName }, action);
        break;
      case AppActionEmail:
        event = new action.event({ 
          id: id, 
          entityName: this.entityName, 
          data: data, 
          target: {entity: this.entityName, entityId: id} }, action, false, bulkAction);
        break
      case EntityAction:
      case AppAction:
        event = new action.event({ id: id, entityName: this.entityName, data: data }, action, actionName as string, false, bulkAction);
        break
      default:
        throw new Error(`Unknown event type ${action.event}`)
    }
    return event

  }

  /**
   * Utility render functions for a group of entity actions to render as buttons
   * @param entityAccess 
   * @param entityStatus 
   * @param data 
   * @returns 
   */
  public renderActions(data: any, config?: RenderConfig): TemplateResult | undefined {
    const entityAccess = config?.entityAccess || this.element.entityAccess;
    const entityStatus = config?.entityStatus || this.element.entityStatus;

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

  protected renderEditActions(data: any) {
    return Object.entries(this.actions)
      .filter(([_key, action]) => action.showEdit)
      .map(([key, _action]) => this.renderAction(key as ActionKeys, data));
  }
  protected renderDefaultActions(data: any) {
    return Object.entries(this.actions)
      .filter(([_key, action]) => action.showDefault)
      .map(([key, _action]) => this.renderAction(key as ActionKeys, data));
  }

  /**
   * Utility render functions for a single entity actions to render as button and trigger an Action event
   * @param actionName the name of the action to render
   * @param config button config to apply to the button 
   * @param beforeDispatch a function called before the action is dispatched - dispatch will not happen if this function returns false 
   * @param onResolved a function called when the action event.detail.promise is resolved
   * @returns 
   */
  public renderAction(actionName: ActionKeys | DefaultActions, data?: any, config?: ButtonConfig, beforeDispatch?: () => boolean | string | void, onResolved?: (promise: any) => void) {
    const action = this.actions[actionName as DefaultActions];
    if (!action) {
      console.error(`No action found for ${String(actionName)}`);
    }
    const actionConfig = typeof (action.config) === 'function' ? action.config(data || this.element.data, this.element.entityStatus) : action.config;
    config = typeof (config) === 'function' ? config(data || this.element.data, this.element.entityStatus) : config;
    const cfg = Object.assign({}, actionConfig, config);
    // the button is active when: 
    const disabled = cfg?.disabled === true
    const unelevated = cfg?.unelevated ?? false
    const outlined = cfg?.outlined ?? !unelevated

    return html`<mwc-button 
        class="${actionName} action"
        .icon=${action.icon || ''} 
        @click=${this.onActionClick(actionName, data, beforeDispatch, onResolved)}
        .disabled=${disabled}
        .outlined=${outlined}
        .unelevated=${unelevated}
        >${action.label}</mwc-button>`
  }

  public onActionClick(actionName: ActionKeys | DefaultActions, data?: any, beforeDispatch?: () => boolean | string | void, onResolved?: (promise: any) => void) {
    const action = this.actions[actionName as DefaultActions];
    if (!action) {
      console.error(`No action found for ${String(actionName)}`);
    }
    return async () => {
      if (beforeDispatch) {
        const _beforeDispatch = beforeDispatch()
        if (_beforeDispatch === false) {
          console.log('beforeDispatch returned false')
          return;
        }
      }
      // we can pass a simple handler function to the action
      if (action.onClick) {
        return action.onClick.call(this, data)
      }
      try {
        const event = this._getEvent(action, actionName, data);
        this._dispatchTriggerEvent(event);
        const promise = await event.detail.promise
        if (promise) {
          promise.catch((error: Error) => this.onError(error))
        }
        if (onResolved) {
          onResolved(promise);
        }
      } catch (error) {
        this.onError(error as Error)
      }
    }
  }


  /**
 * Utility render functions for a group of entity actions to render as buttons icons
 * @param entityAccess 
 * @param entityStatus 
 * @param data 
 * @returns 
 */
  public renderBulkActions(selectedItems: any[], data: any[], entityAccess?: EntityAccess, entityStatus?: EntityStatus): TemplateResult | undefined {
    // entityAccess ??= this.element.entityAccess;
    // entityStatus ??= this.element.entityStatus;

    // if (!entityAccess?.canEdit) return;

    const bulkActions = Object.entries(this.actions)
      .filter(([_key, action]) => action.bulk)
      .sort(([_ka, a], [_kb, b]) => ((a.bulk?.index || 0) - (b.bulk?.index || 0)))

    if (bulkActions.length === 0) return;

    return html`
      <div class="layout horizontal">
        ${bulkActions.map(([key, action]) => this.renderBulkAction(selectedItems, data, action, key as ActionKeys))}
        
      </div>`
  }

  public renderBulkAction(selectedItems: any[], data: any[], action: Action, actionName: ActionKeys | DefaultActions) {
    const bulkActionHandler = () => {
      const event = this._getEvent(action, actionName, data, true) as EntityAction | AppAction | AppActionEmail;
      event.detail.selectedItems = selectedItems

      // const event = new EntityAction({ id: this.element.id, entityName: this.entityName }, action, actionName);
      return this._dispatchTriggerEvent(event);
    }
    return html`
       <pwi-tooltip skipFocus discrete .tipWidth=${120} .message=${action.bulk?.tooltip || action.label} >
          <mwc-icon-button 
            style="color: var(--color-accent);" 
            aria-haspopup="true" 
            .ariaLabel=${action.bulk?.tooltip || action.label || ''} 
            .icon=${action.icon} 
            .disabled=${action.bulk?.disabled?.(selectedItems) || false}
            @click=${bulkActionHandler}></mwc-icon-button>
        </pwi-tooltip>
      `

  }

  /**
   * render a table derived from the model
   * @param data 
   */
  public renderTable(data: any) {
    const model = this.model;

    // get the fields to render in table
    const fields = Object.entries(model)
      .filter(([_key, m]) => !!m.table)
      .sort(([_key1, m1], [_key2, m2]) => ((m1 as ModelComponent).table?.index || 0) - ((m2 as ModelComponent).table?.index || 0))

    return html`
      <table class="entity table ${this.entityName}">
        ${fields.map(([key, m]) => {
      const component = (m as ModelComponent).component || 'textfield';
      const value = get(key, data)
      let display = value
      if (((m as ModelComponent).table?.optional === true) && (value == undefined)) {
        return
      }
      if (component === 'select') {
        const item = (m as ModelComponent as ModelComponentSelect).items?.find(i => i.code === value)
        display = item?.label || key
      }
      return html`<tr class="${key}"><td class="label">${m.table?.label || m.label || key}</td><td>${display}</td></tr>`
    })
      }
      </table>
   `
  }

  /**
   * grid with commitment list 
   * This is the faced for GDS app member
   * 
   * @param data - the data for the grid
   * @param withOrganisation - true to display organisation column
   */
  public renderGrid(data: any[], config?: ColumnsConfig) {
    const onSelected = async (e: CustomEvent) => {
      (this.element as EntityElementList).selectedItems = [...(e.target as Grid).selectedItems];
    }
    const onSizeChanged = async (e: CustomEvent) => {
      await this.element.updateComplete;
      (this.element as EntityElementList).size = e.detail.value;
    }
    return html`<vaadin-grid 
			id="grid"
			class="flex grid ${this.entityName}"
			.itemIdPath=${'$id'}
			.items=${data}
			${gridRowDetailsRenderer(this.gridDetailRenderer.bind(this))}
			@active-item-changed=${activeItemChanged}
			@selected-items-changed=${onSelected}
			@size-changed=${onSizeChanged}>
      ${this.renderGridColumns(config)}
		</vaadin-grid>`
  }

  /**
   * Renders the content of the grid
   * @param withOrganisation 
   * @param showSelectionColumn 
   * @returns 
   */
  renderGridColumns(_config?: ColumnsConfig) {
    return html`Grid Columns`
  }

  gridDetailRenderer(item: Interface, _model?: any, _grid?: any): TemplateResult {
		return html`
		<div class="layout vertical">
			${this.renderTable(item)}
		</div>
	`
	}
  renderContent(_data: Interface, _config?: RenderConfig): TemplateResult {
    return html`Content`
  }

  renderTitle(_data: Interface, _config?: RenderConfig): TemplateResult {
    return html`Title`
  }

  renderForm(_data: Interface, _config?: RenderConfig): TemplateResult {
    return html`Form`
  }

  /** 
   * returns data to be stored in the database when creating a new entity
   * @param userID - the user owning the entity - it can be a different user than the one logged in
   * @param businessID - the business owning the entity
   * @param organisationOwnerID - the organisation owning the entity (e.g. ida_secretariat)
   * @param appOwnerID - the group owning the entity (e.g. gds)
   */
  public getNewData(..._args: any[]): DataI {
    // @ts-ignore
    return {}
  }



}

