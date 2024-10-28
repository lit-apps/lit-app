/**
 * Base types for resource
 */
import type { DocumentReference } from 'firebase/firestore';
import type { DataI, Ref, UserAccess } from './dataI';
import type { ResourceUI, ResourceMetaData } from './resource';
export interface EntityResourceRef extends Ref {
	customer: string
	team: string
	entity: DocumentReference // the entity this entityResource is associated with
};
type AccessType = 'public' | 'private' | 'protected'

export  interface EntityResourceAccess  {
	app: string
	user?: UserAccess // access data - usually a copy of ref.entity.metaData.access.user
	// entityAccess?: ResourceAccess // the data for the entity - loaded async from the entity reference when we read a channel
	status: AccessType // access type for discussions in this channel; if the channel is public (only signed-in users), private (same entity reference) or protected (only channel members)
	userById: {[key: string]: (keyof UserAccess)[]}
}

export interface EntityResourceMetaData<A = EntityResourceAccess, T = string> extends ResourceMetaData<A, T>  {
	entityType: any // the type of entity this channel is associated with
	// allowedElement?: string[] // the allowed elements for this resourceEntity
}

export interface EntityResourceI<M = EntityResourceMetaData, R = EntityResourceRef> 
	extends ResourceUI, DataI<M, R> { }



