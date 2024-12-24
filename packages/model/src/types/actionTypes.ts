import type { CollectionI, Collection } from "./dataI.js";
import type { EntityStatus, RenderConfig } from "./entity.js";
import type { LitElement, TemplateResult } from "lit";
// import { dbRefEntity } from "@lit-app/persistence-shell";
import type { CollectionReference, DocumentReference } from "firebase/firestore";
import { EntityAction } from "../events.js";
import { Entity, EntityI } from "../../index.js";

export interface HostElementI<D = any> extends LitElement {
  entityStatus?: EntityStatus
  consumingMode?: RenderConfig['consumingMode']
  docId?: string,
  appID?: string,
}


type VoidOrEventT<E> = void | E
export type ActionHandlerT<D, TData = D, E extends CustomEvent = CustomEvent> = (
  this: HTMLElement & {Entity: EntityI, data: any}, //dbRefEntity,
  ref: DocumentReference<D> | CollectionReference<D>,
  data: TData,
  event: E) => VoidOrEventT<E> | Promise<VoidOrEventT<E>>

export type PrimitiveT = string | number | boolean
// type FunctionOrValue<T, D> = T | ((this: AbstractEntity, data: D, entityStatus?: EntityStatus) => T)
type FunctionOrValue<T, D> = T | ((this: HostElementI, data: D, entityStatus?: EntityStatus) => T)
export type FunctionOrPrimitiveT<T extends PrimitiveT, D> = FunctionOrValue<T, D>
export type FunctionOrButtonConfigT<D> = FunctionOrValue<ButtonConfigT, D>
type NumberOrFunctionT<D> = FunctionOrPrimitiveT<number, D>
type StringOrFunctionT<D> = FunctionOrPrimitiveT<string, D>

type ButtonConfigT = {
  disabled?: boolean
  outlined?: boolean
  filled?: boolean
  tonal?: boolean
  text?: boolean // true to render a text button
  label?: string | TemplateResult
}

export type ActionDataT<D> = {
  data: D | CollectionI<D>,
  // selectedItems?: Collection<D>
}

export type GetEventT<D, E = any> = (
  entityName: string,
  data: ActionDataT<D>,
  host?: HostElementI,
  isBulk?: boolean,
  confirmed?: boolean
) => CustomEvent<E>

type ConfigDialogT<D> = {
  heading: string;
  confirmLabel?: string;
  confirmDisabled?: (data: any) => boolean; // whether to disable the confirm button
  render: ((d: { data: D, selectedItems?: Collection<D> }) => TemplateResult);
};

type BulkDialogT<D> = Omit<ConfigDialogT<D>, 'render'> & {
  index: number // index used to sort the bulk actions
  tooltip?: string;
  icon?: string;  // we can override default icon
  disabled?: (selectedItems: Collection<D>) => boolean
  render: ((d: { data: D, selectedItems: Collection<D> }) => TemplateResult);
};

interface ActionBaseI<D = any> {
  label: StringOrFunctionT<D>
  ariaLabel?: StringOrFunctionT<D>
  icon?: string

  /**
   * Text to appear with the action, for instance in tooltips
   */
  supportingText?: string

  /** 
   * If set, the action is displayed on view mode
   * The value is the index of the action in the list of actions
   */
  showOnViewing?: NumberOrFunctionT<D>
  /** 
   * If set, the action is displayed on edit mode
   * The value is the index of the action in the list of actions
   */
  showOnEditing?: NumberOrFunctionT<D>
  config?: FunctionOrButtonConfigT<D>
  /**
   * Called before handling the action or dispatching the event.
   * If the function returns false, the action is not handled or the event is not dispatched.
   */
  beforeDispatch?: (data: D) => boolean
  /**
   * Called after the action is handled or the event is dispatched and the action is resolved
   */
  afterResolved?: (event: CustomEvent, host: HostElementI) => void

  /**
   * Config for bulk Action. Bulk actions appear when a view has items selected
   */
  bulk?: BulkDialogT<D>

  /**
   * display a dialog to confirm the action when present
   */
  confirmDialog?: ConfigDialogT<D>
}

type ActionConfigT<D, TData = D, E extends CustomEvent = CustomEvent> = {
  handler?: ActionHandlerT<D, TData, E>
  /**
   * push the action to the history stack when true
   */
  pushHistory?: boolean
  /**
   * prevent the event to be written on /internals/event
   * TODO: replace by pushEvent and do not write by default to event
   */
  preventWriteEvent?: boolean
  /**
   * handle the action on the server (via userAction trigger)
   */
  handleOnServer?: boolean
  /** 
   * if to to display with metaData
   */

  meta?: {
    label: string
    index: number
  }
}

/**
 * simple actions are actions that do not require any event to be dispatched. 
 * Handler is called directly on click
 */
export interface ActionSimpleI<D = any> extends ActionBaseI<D> {
  kind: 'simple'
  handler: (data: D) => void
}

/**
 * Event actions are actions that require an event to be dispatched. The event fired is returned by getEvent
 */
export interface ActionEventI<D = any> extends ActionBaseI<D>, ActionConfigT<D, CustomEvent> {
  kind: 'event'
  getEvent: GetEventT<D>
}

/**
 * Entity actions are actions that require an entityAction to be dispatched. There is no need to define a getEvent function
 * The handler is either called on entity-action-handler or directly on the server when handleOnServer is true
 */
export interface ActionEntityI<D = any, TData = any> extends ActionBaseI<D>, ActionConfigT<D, TData, EntityAction> {
  kind: 'entity'
  /** when true, simply write the entityAction at the corresponding ref */
  handleOnServer?: boolean
  handler?: ActionHandlerT<D, TData, EntityAction>

}

export interface ActionMixinI<D = any> extends ActionBaseI<D> {
  kind: 'mixin'
  getEvent: GetEventT<D>
}

/**
 * 
 */
export type ActionT<D = any> =
  | ActionSimpleI<D>
  | ActionEventI<D>
  | ActionMixinI<D>
  | ActionEntityI<D>

export type ActionsT<D = any> = Record<string, ActionT<D>>

/**
 * util type to get the key of all actions
 */
export type ActionKeyT<T, D> = keyof T | keyof DefaultActionsT<D>

export type DefaultActionsT<D> = {
  create: ActionT<D>,
  write: ActionT<D>,
  cancel: ActionT<D>,
  edit: ActionT<D>,
  open: ActionT<D>,
  close: ActionT<D>,
  delete: ActionT<D>,
  markDeleted: ActionT<D>,
  restore: ActionT<D>,
  setAccess: ActionT<D>,
  addAccess: ActionT<D>,
  removeAccess: ActionT<D>,
  invite: ActionT<D>,
}

/**
 * Returns true if `action` contains a handler
 * @param action Action
 * @returns Boolean
 */
export function isHandlerAction(action: ActionT): action is ActionEntityI | ActionEventI | ActionSimpleI {
  return 'handler' in action
}



/**
 * utile type to test if a type is an action
 * const a1 = {
 *	a: {name: 'test', label: 'test'},
 * 	b: {name: 'b', label: 'b'},
 * }
 * const ta1:  ActionType<typeof a1> = a1
 * type K = keyof typeof a1
 * ---> K = "a" | "b"
 **/
// type EvaluateAction<T> = T extends ActionT ? T : never;
// type EvaluateType<T> = T extends infer O ? {
//   [K in keyof O]: EvaluateAction<O[K]>;
// } : never;
// export type ActionType<T extends ActionsT> = EvaluateType<{
//   [key in keyof T]: ActionT;
// }>;
