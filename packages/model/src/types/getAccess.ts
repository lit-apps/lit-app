import { Access } from './dataI'
import type { EntityAccess } from '../types/entity'
// export interface GetAccess<D = any, T extends Access = any> {
// 	isOwner: ((access: T, data: D) => boolean) | boolean
// 	canEdit: ((access: T, data: D) => boolean) | boolean
// 	canView: ((access: T, data: D) => boolean) | boolean
// 	canDelete: ((access: T, data: D) => boolean) | boolean
// }

export type GetAccess<D = any, T extends Access = any, AA extends EntityAccess = EntityAccess> = 
(access: T, data: D) => AA

