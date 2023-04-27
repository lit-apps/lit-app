import { Access } from './dataI'
export interface GetAccess<D = any, T = Access> {
	isOwner(access: T, data: D): boolean
	canEdit(access: T, data: D): boolean
	canView(access: T, data: D): boolean
	canDelete(access: T, data: D): boolean
}
