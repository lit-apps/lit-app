import { nothing, TemplateResult } from "lit";
import { EntityAction, EntityCreateDetail } from "../events.js";
import {
  ActionEntityI,
  ActionKeyT,
  ActionSimpleI,
  ActionsT,
  FilterActionKeyT,
  FunctionOrButtonConfigT,
  HostElementI,
  MenuConfigT
} from "./actionTypes.js";
import { RenderConfig } from "./entity.js";

/**
 * Render Interface for renderActionMixin
 * 
 */
/**
 * Interface for rendering actions in different modes (viewing and editing).
 * 
 * @template A - Type of actions, defaults to ActionsT.
 */
export declare class RenderInterface<A extends ActionsT = ActionsT> {
  /**
   * Show actions: set true to show actions.
   */
  showActions: boolean;

  /**
   * Actions to be rendered.
   */
  actions: A;

  /**
   * Determines if actions can be viewed.
   * 
   * @param data - Data to be used for rendering actions.
   * @param config - Configuration for rendering actions.
   * @returns True if actions can be viewed, otherwise false.
   */
  protected canViewActions(data: unknown, config: RenderConfig): boolean;

  /**
   * Renders actions to display when in editing mode (write and cancel actions).
   * 
   * @param data - Data to be used for rendering actions.
   * @param config - Configuration for rendering actions.
   * @returns TemplateResult for editing actions.
   */
  protected renderEditingActions(data: unknown, config: RenderConfig): TemplateResult;

  /**
   * Renders actions to display when in viewing mode (edit action).
   * 
   * @param data - Data to be used for rendering actions.
   * @param config - Configuration for rendering actions.
   * @returns TemplateResult for viewing actions.
   */
  protected renderViewingActions(data: unknown, config: RenderConfig): TemplateResult;

  /**
   * Renders default action in viewing mode - rendered on the right (e.g. print).
   * 
   * @param data - Data to be used for rendering actions.
   * @param config - Configuration for rendering actions.
   * @returns TemplateResult for default viewing actions.
   */
  protected renderOnViewingActions(data: unknown, config: RenderConfig): TemplateResult;

  /**
   * Renders default action in editing mode - rendered on the right.
   * 
   * @param data - Data to be used for rendering actions.
   * @param config - Configuration for rendering actions.
   * @returns TemplateResult for default editing actions.
   */
  protected renderOnEditingActions(data: unknown, config: RenderConfig): TemplateResult;

  /**
   * Renders entity-specific actions.
   * 
   * @param data - Data to be used for rendering actions.
   * @param config - Configuration for rendering actions.
   * @returns TemplateResult or `nothing` for entity actions.
   */
  renderEntityActions(data: unknown, config: RenderConfig): TemplateResult | typeof nothing;

  /**
   * Renders base actions.
   * 
   * @param data - Data to be used for rendering actions.
   * @param config - Configuration for rendering actions.
   * @returns TemplateResult for base actions.
   * @private
   */
  private renderBaseActions(data: unknown, config: RenderConfig): TemplateResult;

  /**
   * Renders a specific action.
   * 
   * @param actionName - Name of the action to be rendered.
   * @param data - Data to be used for rendering the action.
   * @param config - Configuration for rendering the action.
   * @param clickHandler - Optional click handler for the action.
   * @returns TemplateResult for the specified action.
   */
  renderAction<
    N extends ActionKeyT<A, unknown>,
    // @-ts-expect-error - but this is working
    // D extends Parameters<this['actions'][N]['handler']>[1] 
    D extends this['actions'][N] extends ActionEntityI | ActionSimpleI ?
    Parameters<this['actions'][N]['handler']>[1] : any
  >(
    actionName: N,
    data: D, // we should derive D from actionName handler signature
    config?: RenderConfig | FunctionOrButtonConfigT<unknown>,
    clickHandler?: (e: CustomEvent) => void
  ): TemplateResult;

  /**
   * Renders bulk actions for the entity.
   * @param data - The data associated with the bulk actions.
   * @param config - The configuration for rendering the bulk actions.
   * @returns The rendered bulk actions as a `TemplateResult`.
   */
  renderBulkActions(data: unknown, config: RenderConfig): TemplateResult

  filterActions(key: FilterActionKeyT, data: unknown): ([string, number | MenuConfigT<any>])[]
  /**
   * Renders bulk actions.
   * 
   * @param data - Data to be used for rendering bulk actions.
   * @param config - Configuration for rendering bulk actions.
   * @returns TemplateResult for bulk actions.
   */
  protected renderBulkAction(
    actionName: ActionKeyT<A, unknown>,
    data: unknown,
    config: RenderConfig): TemplateResult

  /**
   * Handles action click events.
   * 
   * @param actionName - Name of the action clicked.
   * @param data - Data associated with the action.
   * @returns A function that handles the click event and returns a promise.
   */
  actionHandler(
    actionName: ActionKeyT<A, unknown>,
    data: unknown
  ): (e: CustomEvent) => Promise<CustomEvent | void>;



  /**
   * Opens an entity by its ID.
   * 
   * @param id - ID of the entity to open.
   * @param entityName - Name of the entity to open. We might have cases where it is different from this.entityName.
  */
  open(id: string, entityName?: string): boolean;

  /**
   * Closes an entity by its ID.
   * 
   * @param id - ID of the entity to close.
   * @param entityName - Name of the entity to open. We might have cases where it is different from this.entityName.
   */
  close(id: string, entityName?: string): boolean;

  /**
   * Marks the entity as dirty or clean.
   * 
   * @param dirty - Boolean indicating if the entity is dirty.
   */
  markDirty(dirty: boolean, id: string): boolean;

  /**
   * Creates a new entity with the provided data.
   * 
   * @param data - Partial data for the new entity.
   * @returns CustomEvent with details of the created entity.
  */
  create: (data: Partial<unknown>) => CustomEvent<EntityCreateDetail>;

  /**
    * update an entity with the provided data.
    * 
    * @param data - Partial data for the new entity.
    * @returns CustomEvent with details of the created entity.
    */
  update: (data: Partial<unknown>, entityName?: string) => CustomEvent<Omit<EntityCreateDetail, 'id'>>;
}

/**
 * Render Interface for renderActionMixin prototype
 * 
 */
export interface StaticEntityActionI<
  A extends ActionsT
> {
  actions: A
  /**
   * Renders an action button based on the provided action name, host element, data, and configuration.
   *
   * @template A - The type of actions available.
   *
   * @param {keyof A | keyof typeof defaultActions} actionName - The name of the action to render.
   * @param {HostElementI<D>} host - The host element that the action is associated with.
   * @param {D} [data={}] - The data associated with the host element.
   * @param {RenderConfig | FunctionOrButtonConfigT} [config] - Optional configuration for rendering the action button.
   * 
   * @returns {TemplateResult} The rendered action button as a TemplateResult.
   */
  renderAction<
    N extends ActionKeyT<A, unknown>,
    D extends this['actions'][N] extends ActionEntityI | ActionSimpleI ?
    Parameters<this['actions'][N]['handler']>[1] : any
  >(
    actionName: N,
    host: HostElementI<unknown>,
    data?: D,
    config?: RenderConfig | FunctionOrButtonConfigT<unknown>,
    clickHandler?: (e: CustomEvent) => void): TemplateResult


  getActionEvent(
    actionName: ActionKeyT<A, unknown>,
    host: HostElementI<unknown>,
    data: unknown,
    isBulk?: boolean
  ): Promise<EntityAction | void>;

  /**
   * Handles the click event for an action button.
   *
   * @template A - The type of actions.
   * @param {ActionKeyT<A, unknown>} actionName - The name of the action to be executed.
   * @param {HostElementI} host - The host element that will dispatch events.
   * @param {unknown} data - The data to be passed to the action handler.
   * @param {Boolean} isBulk - Whether the action is a bulk action.
   * @returns {Promise<void>} An asynchronous function that handles the click event.
   *
   * @throws {Error} If an error occurs during the execution of the action handler.
   */
  actionHandler(
    actionName: ActionKeyT<A, unknown>,
    host: HostElementI<unknown>,
    data: unknown,
    isBulk?: boolean
  ): (e: CustomEvent) => Promise<CustomEvent | void>

  /**
   * Filter actions based on the provided key.
   * 
   * @param {FilterActionKeyT} key - The key to filter actions by.
   * @param {HostElementI} host - The host element that the actions are associated with.
   * @param data - The data associated with the host element.
   */
  filterActions(
    key: FilterActionKeyT,
    host: HTMLElement,
    data: unknown): ([string, number | MenuConfigT<any>])[]
}
