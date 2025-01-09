/**
 * Types used for EntityAction Event
 * 
 * TODO: This should be moved to actionTypes and simplified
 */

import { Access } from './dataI'
type Detail = {
}

interface BaseActionI {
	uid?: string
}

type DefaultAction = 'markDeleted' | 'restore'
export interface DefaultActionI extends BaseActionI {
	actionName: DefaultAction
	detail: Detail
}

export function isDefaultAction(data: AllActionI): data is DefaultActionI {
	const actionName = data.actionName
	return actionName === 'markDeleted' || actionName === 'restore'
}

type PrivacyAction = 'setPrivate' | 'setPublic'
type PrivacyDetail = Detail & {
}

export interface PrivateActionI extends BaseActionI {
	actionName: PrivacyAction
	detail: PrivacyDetail
}

export function isPrivacyAction(data: AllActionI): data is PrivateActionI {
	const actionName = data.actionName
	return actionName === 'setPrivate' || actionName === 'setPublic'
}

type NameAction = 'setName'
type NameDetail = Detail & {
	name: string
}
export interface NameActionI extends BaseActionI {
	actionName: NameAction
	detail: NameDetail
}

export function isNameAction(data: AllActionI): data is NameActionI {
	const actionName = data.actionName
	return actionName === 'setName'
}

type AccessAction = 'setAccess' | 'addAccess' | 'removeAccess'
type Role = keyof Access['user']
type AccessDetail = Detail & {
	uid: string
	role: Role
	language?: string
	type?: keyof Access
}

export interface AccessActionI extends BaseActionI {
	actionName: AccessAction
	detail: AccessDetail
}

export function isAccessAction(data: AllActionI): data is AccessActionI {
	const actionName = data.actionName
	return actionName === 'setAccess' || actionName === 'addAccess' || actionName === 'removeAccess'
}

export type AllActionI =
	
PrivateActionI |
	AccessActionI |
	NameActionI |
	DefaultActionI
export type AllAction = AllActionI['actionName'] 