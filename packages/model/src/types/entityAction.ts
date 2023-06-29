/**
 * Types used for EntityAction Event
 */

import { Access } from './dataI'
type Detail = {
}

interface BaseActionI {
	uid?: string
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


type InviteAction = 'invite'
type InviteDetail = Detail & {
	uid: string
  role: string
  language?: string // potential language for the role (e.g. translator)
	inviteId?: string
}
export interface InviteActionI extends BaseActionI {
	actionName: InviteAction
	detail: InviteDetail
}

type RevokeInviteAction = 'revokeInvite' 
type RevokeInviteDetail = Detail & {
	uid: string
	inviteId: string
}

export interface RevokeInviteActionI extends BaseActionI {
	actionName: RevokeInviteAction
	detail: RevokeInviteDetail
}

export function isInviteAction(data: AllActionI): data is InviteActionI {
	const actionName = data.actionName
	return actionName === 'revokeInvite' || actionName === 'invite'
}

export type AllActionI = PrivateActionI | AccessActionI | NameActionI | InviteActionI | RevokeInviteActionI
export type AllAction = AllActionI['actionName'] 