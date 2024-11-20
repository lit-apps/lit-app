import type { CollectionI, Collection } from "./dataI.js";
import type { EntityStatus, RenderConfig } from "./entity.js";
import type { LitElement, TemplateResult } from "lit";
// import { dbRefEntity } from "@lit-app/persistence-shell";
import type { CollectionReference, DocumentReference } from "firebase/firestore";

export interface HostElementI<D = any> extends LitElement {
  entityStatus: EntityStatus
  consumingMode?: RenderConfig['consumingMode']
  docId?: string
}

type ActionHandlerT<D> = (
  this: any, //dbRefEntity,
  ref: DocumentReference | CollectionReference,
  data: D,
  event: CustomEvent) => void

export type PrimitiveT = string | number | boolean
// type FunctionOrValue<T, D> = T | ((this: AbstractEntity, data: D, entityStatus?: EntityStatus) => T)
type FunctionOrValue<T, D> = T | ((this: HostElementI, data: D, entityStatus?: EntityStatus) => T)
export type FunctionOrPrimitiveT<T extends PrimitiveT, D> = FunctionOrValue<T, D>
export type FunctionOrButtonConfigT<D> = FunctionOrValue<ButtonConfigT, D>
type NumberOrFunctionT<D> = FunctionOrPrimitiveT<number, D>

type ButtonConfigT = {
  disabled?: boolean
  outlined?: boolean
  filled?: boolean
  tonal?: boolean
  text?: boolean // true to render a text button
  label?: string | TemplateResult
}

export type ActionDataT<D> = {
  data: CollectionI<D> ,
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
  render: (data: D) => TemplateResult;
};

type BulkDialogT<D> = ConfigDialogT<D> & {
  index: number // index used to sort the bulk actions
  tooltip?: string;
  icon?: string;  // we can override default icon
  disabled?: (selectedItems: Collection<D>) => boolean
  // TODO: type should be (data: D[], selectedItems: Collection<D>) => TemplateResult when this is integrated
  render: (data: any, selectedItems: Collection<any>) => TemplateResult;
};

interface ActionBaseI<D = any> {
  label: string
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



export interface ActionSimpleI<D = any> extends ActionBaseI<D> {
  kind: 'simple'
  handler: (data: D) => void
}
export interface ActionEventI<D = any> extends ActionBaseI<D> {
  kind: 'event'
  getEvent: GetEventT<D> 
  handler?: ActionHandlerT<D>
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
export interface ActionMixinI<D = any> extends ActionBaseI<D> {
  kind: 'mixin'
  GetEventT: GetEventT<D>
}

/**
 * 
 */
export type ActionT<D = any> = ActionSimpleI<D> | ActionEventI<D> | ActionMixinI<D>
export type ActionsT = Record<string, ActionT>

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
