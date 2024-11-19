/**
 * Base types for resource
 */

import type { Access, MetaData, Ref, DataI } from './dataI';

export type ResourceRef = Ref & {
	team: string
};

export interface ResourceAccess extends Access {
	team: string
}

export interface ResourceMetaData<
	A  = ResourceAccess,
	T = string
> extends MetaData<A, T> {
	access: A
}

export interface ResourceUI {
	name: string // internal name
	language: string
	title?: string // external name
	shortDesc?: string
}

export interface ResourceI<M = ResourceMetaData, R = ResourceRef> extends ResourceUI, DataI<M, R> { }



