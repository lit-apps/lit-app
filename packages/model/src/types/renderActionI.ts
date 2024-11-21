import { nothing, TemplateResult } from "lit"
import { EntityCreateDetail } from "../events.js"
import { ActionKeyT, ActionsT, FunctionOrButtonConfigT, HostElementI } from "./actionTypes.js"
import { RenderConfig } from "./entity.js"

/**
 * Render Interface for renderActionMixin
 * 
 */
export declare class RenderInterface<
  A extends ActionsT = ActionsT
> {
  /**
   * Show actions: set true to show actions
   */
  showActions: boolean
  actions: A
  /**
   * The entry point for rendering actions
   * @param data 
   * @param config 
   */
  canViewActions(data: unknown, config: RenderConfig): boolean

  /**
   * Actions to display when in editing mode (write and cancel actions)
   * @param data 
   * @param config 
   * @returns 
   */
  renderEditingActions(data: unknown, config: RenderConfig): TemplateResult

  /**
   * Actions to display when in viewing mode (edit action)
   * @param data 
   * @param config 
   * @returns 
   */
  renderViewingActions(data: unknown, config: RenderConfig): TemplateResult

  /**
   * Render default action is Viewing mode - rendered on the right (e.g. print)
   * was previously renderDefaultActions
   */
  renderOnViewing(data: unknown, config: RenderConfig): TemplateResult

  /**
   * Render default action is Editing mode - rendered on the right (e.g. )
   */
  renderOnEditingActions(data: unknown, config: RenderConfig): TemplateResult

  renderEntityActions(data: unknown, config: RenderConfig): TemplateResult | typeof nothing

  renderAction(
    actionName: ActionKeyT<A, unknown>, 
    data: unknown, 
    config?: RenderConfig | FunctionOrButtonConfigT<unknown>,
    clickHandler?: (e: CustomEvent) => void): TemplateResult

  onActionClick(
    actionName: ActionKeyT<A, unknown>, 
    data: unknown
  ): (e: CustomEvent) => Promise<CustomEvent | void>

  // open is required as it is declared in RenterEntityMixin - this should be removed at some stage
  open: (id: string) => void
  close: (id: string) => void
  markDirty: (dirty?: boolean) => void
  create: (data: Partial<unknown>) => CustomEvent<EntityCreateDetail>
}

/**
 * Render Interface for renderActionMixin prototype
 * 
 * TODO:  
 * 
 * - [x]  add bulk actions
 * - [ ]  make this the default renderActionMixin !
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
  renderAction(
    actionName: ActionKeyT<A, unknown>,
    host: HostElementI<unknown>,
    data?: unknown,
    config?: RenderConfig | FunctionOrButtonConfigT<unknown>,
    clickHandler?: (e: CustomEvent) => void): TemplateResult

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
  onActionClick(
    actionName: ActionKeyT<A, unknown>,
    host: HostElementI<unknown>,
    data: unknown,
    isBulk?: boolean
  ): (e: CustomEvent) => Promise<CustomEvent | void>
}
