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

export type ResourceMetaData<A = ResourceAccess, T = string> = MetaData<A, T> & {
	access: A
}

export interface ResourceUI {
	name: string // internal name
	language: string
	slug?: string // slug from title
	title?: string // external name
	shortDesc?: string
}

export interface ResourceI<M = ResourceMetaData, R = ResourceRef> extends ResourceUI, DataI<M, R> { }



