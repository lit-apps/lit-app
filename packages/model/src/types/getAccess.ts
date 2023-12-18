import { Access } from './dataI'
export interface GetAccess<D = any, T extends Access = any> {
	isOwner: ((access: T, data: D) => boolean) | boolean
	canEdit: ((access: T, data: D) => boolean) | boolean
	canView: ((access: T, data: D) => boolean) | boolean
	canDelete: ((access: T, data: D) => boolean) | boolean
}
