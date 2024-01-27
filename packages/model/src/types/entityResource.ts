/**
 * Base types for resource
 */
import type { DocumentReference } from 'firebase/firestore';
import type { Access, DataI } from './dataI';
import type {  ResourceAccess, ResourceUI, ResourceMetaData } from './resource';
export type EntityResourceRef =  {
	customer: string
	app: string
	team: string
	entity: DocumentReference // the entity this entityResource is associated with
};
type AccessType = 'public' | 'private' | 'protected'

export type EntityResourceAccess = {
	app: string
	user?: Access // access data - usually a copy of ref.entity.metaData.access.user
	// entityAccess?: ResourceAccess // the data for the entity - loaded async from the entity reference when we read a channel
	status: AccessType // access type for discussions in this channel; if the channel is public (only signed-in users), private (same entity reference) or protected (only channel members)
}

export type EntityResourceMetaData<A = EntityResourceAccess, T = string> = ResourceMetaData<A, T> & {
	entityType: any // the type of entity this channel is associated with
	// allowedElement?: string[] // the allowed elements for this resourceEntity
}

export interface EntityResourceI<M = EntityResourceMetaData, R = EntityResourceRef> extends ResourceUI, DataI<M, R> { }



