import type {  DocumentReference } from 'firebase/firestore'
import type { AnyEvent, Dirty, TypeofAnyEvent } from '../events'
import type { LitElement, TemplateResult } from 'lit'
import type { EntityStatus } from './entity'

type Handler = (this: LitElement, ref: DocumentReference, data: any, event: AnyEvent) => Promise<unknown>
type BtnCfg = {
	disabled?: boolean
	outlined?: boolean
	unelevated?: boolean
	tonal?: boolean
	text?: boolean // true to render a text button
	label?: string | TemplateResult
}

export type ButtonConfig = BtnCfg | ((data: any, entityStatus?: EntityStatus) => BtnCfg)

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
	// allow to add listener while action runs. This is used for instance to alter data on write
	// and set `reviewStatus` to `edited`
	onAction?: (event: AnyEvent) => void
	// dynamically config the button
	config?: ButtonConfig
	// meta is used to know if we need to display the action in the metadata section
	meta?: {
		label: string,
		index: number // index used to sort the actions
	},
	bulk?: {
		render: (selectedItems: any[], data?:  any) => TemplateResult
		index: number // index used to sort the actions
		tooltip?: string,
		disabled?: (data: any[]) => boolean
	},
	entityName?: string // the name of the entity - this is useful for actions that need to be handled at the correct db reference
	pushHistory?: boolean // true to push the action to the history when executed
	handleOnServer?: boolean // true to handle the action on the server (via userAction trigger)
	onClick?: (data: any) => void // as simple handler - this will not trigger any entity Event
	
	// the event to fire when the action is executed - the default is EntityAction
	event?: Exclude<TypeofAnyEvent, typeof Dirty>
}

export type FsmAction = ActionBase & {
	machineID: string
}
export type HandlerAction = ActionBase & {
	handler: Handler
}
export type Action = FsmAction | HandlerAction | ActionBase

export type DefaultActions = 
	'create' | 'edit' | 'write' | 'cancel' | 'delete' |'markDeleted' | 'restore' | 'open' | 'close' |
  'removeAccess' | 'setAccess' | 'addAccess' | 'invite'
export type Actions = Record<string , Action>

export function isFsmAction(action: Action): action is FsmAction {
	return 'machineID' in action
}
export function isHandlerAction(action: Action): action is HandlerAction {
	return 'handler' in action
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

