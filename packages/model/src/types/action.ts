import type {  DocumentReference } from 'firebase/firestore'
import type { AnyEvent, AppAction, AppActionEmail, Dirty, TypeofAnyEvent } from '../events'
import type { LitElement, TemplateResult } from 'lit'
import type { EntityElement, EntityStatus } from './entity'

export type OnResolvedT = (resolved: any, host: HTMLElement, event: AnyEvent) => void
type Handler = (
  this: LitElement,
  ref: DocumentReference,
  data: any,
  event: AnyEvent
) => Promise<unknown>
type BtnCfg = {
	disabled?: boolean
	outlined?: boolean
	filled?: boolean
	tonal?: boolean
	text?: boolean // true to render a text button
	label?: string | TemplateResult
}

export type ButtonConfig = BtnCfg | ((data: any, entityStatus?: EntityStatus) => BtnCfg)
type BulkT = {
	render: (selectedItems: any[], data?:  any) => TemplateResult
	index: number // index used to sort the actions
	tooltip?: string,
	disabled?: (data: any[]) => boolean
}
export type ActionBase = {
	label?: string
	icon?: string
	description?: string
	showDefault?: ((data: any) => boolean) | boolean // whether to show as a default action (appearing when not editing)
	showEdit?: ((data: any) => boolean ) | boolean // whether to show as an edit action (appearing when  editing)
	// when confirmDialog is set, a confirm dialog is shown before the action is executed
	confirmDialog?: {
		heading?: string
		confirmLabel?: string
		confirmDisabled?: (data: any) => boolean // whether to disabled the confirm button
		render: (data: any) => TemplateResult
	}
	// dynamically config the button
	config?: ButtonConfig
	// meta is used to know if we need to display the action in the metadata section
	meta?: {
		label: string,
		index: number // index used to sort the actions
	},
	bulk?: BulkT
	entityName?: string // the name of the entity - this is useful for actions that need to be handled at the correct db reference
	pushHistory?: boolean // true to push the action to the history when executed
	preventWriteEvent?: boolean // true to prevent the event to be written on /internals/event
	handleOnServer?: boolean // true to handle the action on the server (via userAction trigger)
	// allow to add listener while action runs. This is used for instance to alter data on write
	// and set `reviewStatus` to `edited`
  onAction?: ((this: EntityElement, event: AppActionEmail) => void) | 
		((this: EntityElement, event: AppAction) => void )
	onResolved?: OnResolvedT // called when the action is resolved
	
	// the event to fire when the action is executed - the default is EntityAction
	event?: Exclude<TypeofAnyEvent, typeof Dirty>
}

export type DefaultAction = ActionBase & {
}

// export type RendererAction = {
// 	renderer: (this: EntityElement, data: any, config: BtnCfg) => TemplateResult
// 	description?: string
// 	showDefault?: ((data: any) => boolean) | boolean // whether to show as a default action (appearing when not editing)
// 	showEdit?: ((data: any) => boolean ) | boolean // whether to show as an edit action (appearing when  editing)
// 	bulk?: BulkT
// 	entityName?: string // the name of the entity - this is useful for actions that need to be handled at the correct db reference

// }

// export type OnClickAction = Omit<ActionBase, 'onResolved' > & {
export type OnClickAction = ActionBase & {
  onClick: (this: HTMLElement, data: any) => void | Promise<void> // as simple handler - this will not trigger any entity Event
}

/**
 * Under actions are actions that just sends an event. 
 * The handler is called within-entity-action-handler-mixing. 
 */
export type HandlerAction = ActionBase & {
	handler: Handler
}
export type Action =  HandlerAction | OnClickAction | DefaultAction 

export type DefaultActions = 
	'create' | 'edit' | 'write' | 'cancel' | 'delete' |'markDeleted' | 'restore' | 'open' | 'close' |
  'removeAccess' | 'setAccess' | 'addAccess' | 'invite'
export type Actions = Record<string , Action>



/**
 * Returns true if `action` contains a handler
 * @param action Action
 * @returns Boolean
 */
export function isHandlerAction(action: Action): action is HandlerAction {
	return 'handler' in action
}

/**
 * Returns true if `action` contains an onClick
 * @param action Action
 * @returns Boolean
 */
export function isOnClickAction(action: Action): action is OnClickAction {
  return 'onClick' in action
}

/**
 * type to test if a type is an action
 * const a1 = {
 *	a: {name: 'test', label: 'test'},
 * 	b: {name: 'b', label: 'b'},
 * } 
 * const ta1:  ActionType<typeof a1> = a1  
 * type K = keyof typeof a1 // "a" | "b"
 **/ 
type EvaluateAction<T> = T extends Action ? T : never;
type EvaluateType<T> = T extends infer O ? { [K in keyof O]: EvaluateAction<O[K]> } : never;
export type ActionType<T extends Actions> = EvaluateType<{[key in keyof T]: Action }>;

