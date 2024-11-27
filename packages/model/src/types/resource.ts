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
	/**
	 * Internal name
	 */
	name: string // internal name
	/**
	 * Primary language of the resource
	 */
	language: string
	/**
	 * external name - when the resource is not localized
	 */
	title?: string // external name
	shortDesc?: string
}

export interface ResourceI<M = ResourceMetaData, R = ResourceRef> extends ResourceUI, DataI<M, R> { }



