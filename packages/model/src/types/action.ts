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

export type Action = {
	label?: string
	icon?: string
	description?: string
	showDefault?: boolean // whether to show as a default action (appearing when not editing)
	showEdit?: boolean // whether to show as an edit action (appearing when  editing)
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
	onClick?: (data: any) => void // as simple handler - this will not trigger any entity Event
	handler?: Handler
	// the event to fire when the action is executed - the default is EntityAction
	event?: Exclude<TypeofAnyEvent, typeof Dirty>
	condition?: (data: any) => boolean
}
// export type Actions = { [key: string]: Action }

export type DefaultActions = 
	'create' | 'edit' | 'write' | 'cancel' | 'delete' |'markDeleted' | 'restore' | 'open' | 'close' |
  'removeAccess' | 'setAccess' | 'addAccess'
// export type ActionRecord<K extends string, T> = { [P in K]: T; }
export type Actions = Record<DefaultActions , Action>