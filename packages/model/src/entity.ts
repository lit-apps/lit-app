import { get } from '@preignition/preignition-util/src/deep';
import { activeItemChanged } from '@preignition/preignition-util/src/grid';
import '@vaadin/grid/theme/material/vaadin-grid.js';
import { TemplateResult, html } from 'lit';
import { html as htmlStatic, literal } from 'lit/static-html.js';
import { choose } from 'lit/directives/choose.js';


import '@lit-app/component/button/button';
import type { LapButton } from '@lit-app/component/button/button';
import '@material/web/icon/icon';

import { AppToastEvent } from '@lit-app/app-event';
import { Grid } from '@vaadin/grid';
import { DocumentReference, updateDoc } from 'firebase/firestore';
import {
  columnBodyRenderer,
  columnHeaderRenderer,
  gridRowDetailsRenderer,
} from 'lit-vaadin-helpers';
import {
  AnyEvent,
  AppAction,
  AppActionEmail,
  Close,
  Create,
  Delete,
  // Delete,
  // Create,
  Edit,
  EntityAction,
  EntityCreateDetail,
  MarkDeleted,
  Open,
  Reset,
  Restore,
  Update,
  Write
} from './events';
import { renderField } from './renderField';
import {
  Action,
  Actions,
  ButtonConfig
} from './types/action';
import { DataI } from './types/dataI';
import {
  ColumnsConfig,
  DefaultI,
  EntityAccess,
  EntityElement,
  EntityElementList,
  EntityI,
  EntityStatus,
  FieldConfig,
  FieldConfigUpload,
  RenderConfig
} from './types/entity';
import { GetAccess } from './types/getAccess';
import {
  Model,
  ModelComponent,
  ModelComponentSelect
} from './types/modelComponent';
import entries from './typeUtils/entries';
import { ifDefined } from 'lit/directives/if-defined.js';
import { ensure } from './types';

/**
 * Actions inherited by all entities (provided they use @mergeStatic('actions'))
 * We do not set pushHistory those actions are automatically added
 * history and metaData events in `action-handler-mixin.ts`. However, we keep 
 * metaData here to display them in the UI. 
 */
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
      event.detail.promise = updateDoc(ref, { 'metaData.deleted': true })

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
      event.detail.promise = updateDoc(ref, { 'metaData.deleted': false })

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
export default class Entity<Interface extends DefaultI = DefaultI>
  implements EntityI<Interface>  {

  /**
   * inspired from https://github.com/Microsoft/TypeScript/issues/3841#issuecomment-1488919713
   * We will need to set the type of constructor on all subclasses so that
   * the type of actions is properly inferred. 
   */
  declare ['constructor']: typeof Entity;

  static _entityName: string
  static get entityName(): string {
    const name = this._entityName || this.name
    return name.charAt(0).toLowerCase() + name.slice(1);
  }
  static set entityName(name: string) {
    this._entityName = name
  }

  static model: Model<DefaultI>
  static actions = actions

  static setActions(actions: Actions) {
    const superCtor = Object.getPrototypeOf(this) as typeof Entity;
    this.actions = Object.assign(superCtor.actions || {}, actions);
  }

  showMetaData: boolean = false
  showActions: boolean = false

  // define a private _icon property to be used by the icon getter
  _icon!: string
  get icon(): string {
    return this._icon || ''
  }

  set icon(icon: string) {
    this._icon = icon
    this.host.requestUpdate()
  }

  _selected: number = 0
  get selected(): number {
    return this._selected
  }
  set selected(selected: number) {
    this._selected = selected
    this.host.requestUpdate()
  }

  get entityName() {
    return (this.constructor).entityName

  }
  get model() {
    return (this.constructor).model
  }

  get actions() {
    return (this.constructor).actions;
  }

  /**
  * The access control for this entity - this needs to be overridden in subclasses
  * { 
  *   isOwner: (_access: Access, _data: any) => true,
  *   canEdit: (_access: Access, _data: any) => true,
  *   canView: (_access: Access, _data: any) => true,
  *   canDelete: (_access: Access, _data: any) => true
  * }
  */
  static getAccess: GetAccess

  hostConnected() {
    // this.subscribe(this.ref)
  }

  hostDisconnected() {
    // this.unsubscribe()
  }
  /**
   * @param element the element to render the action on
   * @param realTime when true, will dispatch update events on data-input 
   *         this also changes the rendering of renderActions
   * @param listenOnAction when true, will listen to action events on the element
   */
  constructor(public host: EntityElement | EntityElementList, public realTime: boolean = false, public listenOnAction: boolean = false) {
    host.addController(this);
    // we only add event listeners if the element is a dataController (e.g. skip list and grids)
    if (this.listenOnAction) {
      entries<Actions>(this.actions).forEach(([_k, action]) => {
        if (action.event && action.onAction) {
          host.addEventListener(action.event.eventName, ((event: AnyEvent) => {
            action.onAction?.call(this.host, event)
            event.onActionProcessed = true;
          }) as EventListener)
        }
      })
    }
    if (import.meta.hot) {
      import.meta.hot.accept((Entity) => {
        console.info('Entity HMR', Entity)
        if (Entity) {
          this.host.requestUpdate()
        }
      })
    }

  }


  /**
   * Bind an Entity with a LitElement. 
   * This needs to be done before any other operations like rendering can be performed.
   * @param el ReactiveElement
   */
  public bind(el: EntityElement) {
    this.host = el;
  }

  /**
    * renders a data-entry field, depending on the model definition
    */
  public renderField(name: string, config?: FieldConfig | FieldConfigUpload, data?: Interface): TemplateResult | undefined {
    if (!this.host) {
      throw new Error('Entity not bound to element');
    }
    return (renderField<Interface>).call(this.host as EntityElement, name, data ?? this.host.data, false, this.model, this, config);
  }
  /**
   * renders a data-entry field, depending on the model definition
   * and updates the data object on input
   */
  public renderFieldUpdate(name: string, config?: FieldConfig | FieldConfigUpload, data?: Interface): TemplateResult | undefined {
    if (!this.host) {
      throw new Error('Entity not bound to element');
    }
    return (renderField<Interface>).call(this.host as EntityElement, name, data ?? this.host.data, true, this.model, this, config);
  }

  protected onError(error: Error) {
    console.error(error)
    // TODO: centralize the way we handler errors (see stripe-web-sdk for inspiration)
    // For the time being, we just dispatch Toast Evnt
    this.host?.dispatchEvent(new AppToastEvent(error.message, 'error'))
  }

  public create(details: EntityCreateDetail) {
    details.entityName = this.entityName;
    const event = new Create(details, this.actions.create);
    return this._dispatchTriggerEvent(event);
  }

  public open(entityName: string, id?: string) {
    if (id) {
      const event = new Open({ id, entityName }, this.actions.open);
      return this._dispatchTriggerEvent(event);
    }
    return null

  }

  public dispatchAction(actionName: keyof this['actions']): CustomEvent {
    // @ts-ignore
    const action = this.actions[actionName];

    const event = new EntityAction({ id: this.host.id, entityName: this.entityName }, action, String(actionName));
    return this._dispatchTriggerEvent(event);
  }

  private _dispatchTriggerEvent(event: CustomEvent, el: HTMLElement = this.host) {
    el.dispatchEvent(event);
    return event
  }
  private static _dispatchTriggerEvent(event: CustomEvent, el: HTMLElement) {
    el.dispatchEvent(event);
    return event
  }


  private getEvent(actionName: keyof this['actions'], data: any, bulkAction: boolean = false) {
    if (actionName === 'create') {
      return new Create({ entityName: this.entityName, data: this.getNewData() }, this.actions.create);
    }
    return this.constructor.getEvent(String(actionName), data, this.host, bulkAction)
  }

  static getEvent(actionName: string, data: any, el: HTMLElement, bulkAction: boolean = false) {
    if (actionName === 'create') {
      throw new Error('Create is not allowed in static get Event')
    }
    // @ts-ignore 
    const action = this.actions[actionName];
    if (!action.event) {
      action.event = EntityAction
    }

    // id is the path after /app/appID, whereas docID is the single id for a document
    const id = data?.$id || ((el as EntityElement).docId ? (el as EntityElement).docId : el.id) as string;;
    let event
    switch (action.event) {
      case Delete:
      case MarkDeleted:
      case Update:
      case Restore:
      case Write:
        event = new action.event({ id: id, entityName: this.entityName, data: data }, action);
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
          target: { entity: this.entityName, entityId: id }
        }, action, false, bulkAction);
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

  protected renderEditActions(data: any) {
    return entries<Actions>(this.actions)
      .filter(([_key, action]) => action.showEdit)
      .map(([key, _action]) => this.renderAction(key, data));
  }
  protected renderDefaultActions(data: any) {
    return entries<Actions>(this.actions)
      .filter(([_key, action]) => action.showDefault)
      .map(([key, _action]) => this.renderAction(key, data));
  }

  static renderAction<K extends { actions: Record<string, Action> }>(
    actionName: keyof K['actions'],
    element: HTMLElement,
    data: any = {},
    config?: ButtonConfig & { bulkAction?: boolean },
    beforeDispatch?: () => boolean | string | void,
    onResolved?: (promise: any) => void) {
    // @ts-ignore
    const action = this.actions[actionName];
    if (!action) {
      console.error(`No action found for ${String(actionName)}`);
    }
    const actionConfig = typeof (action.config) === 'function' ? action.config(data) : action.config;
    config = typeof (config) === 'function' ? config(data) : config;
    const cfg = Object.assign({}, actionConfig, config);
    // the button is active when: 
    const disabled = cfg?.disabled === true
    const unelevated = cfg?.unelevated ?? false
    const tonal = cfg?.tonal ?? false
    const outlined = cfg?.outlined ?? !unelevated
    return html`<lap-button 
      class="${actionName} action"
      .icon=${action.icon || ''} 
      @click=${this.onActionClick(actionName, element, data, beforeDispatch, onResolved)}
      .disabled=${disabled}
      .outlined=${outlined}
      .tonal=${tonal}
      .unelevated=${unelevated}
      >
        ${action.label}
      </lap-button>`

  }

  static onActionClick<K extends { actions: Record<string, Action> }>(
    actionName: keyof K['actions'],
    host: HTMLElement,
    data?: any,
    beforeDispatch?: () => boolean | string | void,
    onResolved?: (promise: any) => void,
    eventGetter?: () => CustomEvent,
  ) {
    // @ts-ignore
    const action = (this.actions)[actionName];
    if (!action) {
      console.error(`No action found for ${String(actionName)}`);
    }
    return async (e: Event & { target: LapButton }) => {
      if (beforeDispatch?.() === false) {
        console.log('beforeDispatch returned false')
        return;
      }
      const button = e.target
      button.loading = true
      // TODO: use icon slot for the button
      // we can pass a simple handler function to the action
      if (action.onClick) {
        await action.onClick.call(host, data)
        button.loading = false
        return
      }
      try {
        const event = eventGetter ? eventGetter() : this.getEvent(String(actionName), data, host);
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
        // For the time being, we just dispatch Toast Evnt
        host?.dispatchEvent(new AppToastEvent((error as Error).message, 'error'))

      }
    }
  }

  /**
   * Utility render functions for a single entity actions to render as button and trigger an Action event
   * @param actionName the name of the action to render
   * @param config button config to apply to the button 
   * @param beforeDispatch a function called before the action is dispatched - dispatch will not happen if this function returns false 
   * @param onResolved a function called when the action event.detail.promise is resolved
   * @returns 
   */
  public renderAction(
    actionName: keyof this['actions'],
    data?: any,
    config?: ButtonConfig,
    beforeDispatch?: () => boolean | string | void,
    onResolved?: (promise: any) => void): TemplateResult {
    // @ts-ignore
    const action = (this.actions)[actionName];
    if (!action) {
      console.error(`No action found for ${String(actionName)}`);
    }
    const actionConfig = typeof (action.config) === 'function' ? action.config(data || this.host.data, this.host.entityStatus) : action.config;
    config = typeof (config) === 'function' ? config(data || this.host.data, this.host.entityStatus) : config;
    const cfg = Object.assign({}, actionConfig, config);
    // the button is active when: 
    const disabled = cfg?.disabled === true
    const unelevated = cfg?.unelevated ?? false
    const outlined = cfg?.outlined ?? !unelevated

    return html`<lap-button 
        class="${actionName} action"
        .icon=${action.icon || ''} 
        
        @click=${this.constructor
        .onActionClick(actionName, this.host, data, beforeDispatch, onResolved, () => this.getEvent(actionName, data))}
        .disabled=${disabled}
        .outlined=${outlined}
        .unelevated=${unelevated}
        >
          ${action.label}
        </lap-button>`
  }

  /**
* Utility render functions for a group of entity actions to render as buttons icons
* @param entityAccess 
* @param entityStatus 
* @param data 
* @returns 
*/
  public renderBulkActions(selectedItems: any[], data: any[], entityAccess?: EntityAccess, entityStatus?: EntityStatus): TemplateResult | undefined {
    // entityAccess ??= this.host.entityAccess;
    // entityStatus ??= this.host.entityStatus;

    // if (!entityAccess?.canEdit) return;

    const bulkActions = entries<Actions>(this.actions)
      .filter(([_key, action]) => action.bulk)
      .sort(([_ka, a], [_kb, b]) => ((a.bulk?.index || 0) - (b.bulk?.index || 0)))

    if (bulkActions.length === 0) return;

    return html`
      <div class="layout horizontal">
        ${bulkActions.map(([key, action]) => this.renderBulkAction(selectedItems, data, action, key))}
        
      </div>`
  }

  public renderBulkAction(selectedItems: any[], data: any[], action: Action, actionName: keyof this['actions']) {
    const bulkActionHandler = () => {
      const event = this.getEvent(actionName, data, true) as EntityAction | AppAction | AppActionEmail;
      event.detail.selectedItems = selectedItems

      // const event = new EntityAction({ id: this.host.id, entityName: this.entityName }, action, actionName);
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
    const fields = entries<Model<DefaultI>>(model)
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
      (this.host as EntityElementList).selectedItems = [...(e.target as Grid).selectedItems];
    }
    const onSizeChanged = async (e: CustomEvent) => {
      await this.host.updateComplete;
      (this.host as EntityElementList).size = e.detail.value;
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
    console.log('renderGridColumns')
    const model = this.model;
    const colTag = literal`vaadin-grid-column`
    const colSortTag = literal`vaadin-grid-sort-column`
    // by default, get config from model - for more complex grid, override this method
    const fields = entries<Model<DefaultI>>(model)
      .filter(([_key, m]) => !!m.grid)
      .sort(([_key1, m1], [_key2, m2]) => ((m1 as ModelComponent).grid?.index || 0) - ((m2 as ModelComponent).grid?.index || 0))

    return html`${fields.map(([key, m]) => {
      const grid = ensure<Required<ModelComponent>['grid']>(m.grid)

      const tagName = grid.sortable ? colSortTag : colTag
      return htmlStatic`<${tagName} 
        flex-grow=${ifDefined(grid.width ? '0' : grid.flex)} 
        width=${ifDefined(grid.width)} 
        ?resizable=${ifDefined(grid.resizable)} 
        path=${grid.path || key}
        header=${grid.header || m.label}
        ${grid.bodyRenderer ? columnBodyRenderer(grid.bodyRenderer) : null}  
        ${grid.headerRenderer ? columnHeaderRenderer(grid.headerRenderer) : null}  
        ></${tagName}>
      `})
      }`
  }

  gridDetailRenderer(item: Interface, _model?: any, _grid?: any): TemplateResult {
    return html`
		<div class="layout vertical">
			${this.renderTable(item)}
		</div>
	`
  }
  renderMetaData(_data: Interface, _config?: RenderConfig): TemplateResult {
    return html`<meta-data></meta-data>`
  }
  renderBody(data: Interface, config?: RenderConfig): TemplateResult {
    if (Array.isArray(data)) {
      return this.renderArrayContent(data, config)
    }
    return this.renderContent(data, config)
  }

  renderContent(data: Interface, config?: RenderConfig): TemplateResult {
    return html`
    <div class="layout vertical">							
      ${data === undefined ? html`Loading...` :
        data === null ? html`<p>${this.entityName} data not found</p>` :
          [
            this.showMetaData ? this.renderMetaData(data, config) : html``,
            this.showActions ? this.renderActions(data, config) : html``,
            this.renderForm(data, config)
          ]
      }
    </div>`
  }

  renderArrayContent(data: Interface[], config?: RenderConfig): TemplateResult {
    return this.renderGrid(data, config)
  }

  renderTitle(_data: Interface, _config?: RenderConfig): TemplateResult {
    return html`Title`
  }

  renderHeader(data: Interface, config: RenderConfig): TemplateResult {
    const title = this.renderTitle(data, config)
    return html`${choose(config.level,
      [
        [2, () => html`<h3 style="display: flex; flex-direction: row;">${title}</h3>`],
        [3, () => html`<h5 class="secondary">${title}</h5>`],
        [4, () => html``]
      ],
      () => html`
      <h2 style="display: flex; flex-direction: row;" class="underline">
        <mwc-icon>${config.entityStatus.isEditing ? 'edit' : this.icon}</mwc-icon>
        ${title}
      </h2>`
    )}`

  }

  renderFooter(_data: Interface, _config?: RenderConfig): TemplateResult {
    return html``
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
  // TODO : this should be a static method		
  public getNewData(..._args: any[]): Partial<DataI> {
    // @ts-ignore
    return {}
  }



}


