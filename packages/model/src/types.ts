import type {
	ColumnsConfig,
	EntityAccess,
	EntityStatus,
	EntityElement,
	EntityElementList,
	RenderConfig,
} from './types/entity';
import type {
	Action, DefaultActions, Actions, ActionType
} from './types/action'
import type {
	Model,
	Lookup,
	GridConfig
} from './types/modelComponent'


export {
	type AccessMixinInterface,
	type ProvideAccessMixinInterface
} from './mixin/context-access-mixin';

export {
	type DataMixinInterface
} from './mixin/context-data-mixin';
export {
	type EntityMixinInterface
} from './mixin/context-entity-mixin';

export { 
	type EntityStatusMixinInterface 
} from './mixin/context-entity-status-mixin';
export {
	RenderConfig, EntityAccess, EntityStatus, ColumnsConfig, EntityElement, EntityElementList,
	Action, Actions, DefaultActions, ActionType,
	Model, Lookup, GridConfig
}
export * from './events'
export * from './types/resource'
export * from './types/dataI'
export * from './types/getAccess'
export * from './types/entityAction'

import entries from './typeUtils/entries';
import ensure from './typeUtils/ensure';
import type  {PartialBy}  from './typeUtils/partialBy';

export type Strings = {
	[key: string]: string | Strings;
};

import {Access} from './types/dataI'
export type Role = {
	name: keyof Access['user'] // | 'superAdmin' 
	level: number // 1: owner, 2: admin, 3: editor, 3: viewer - role level; only higher level can edit lower level can assign lower level	
	locale?: boolean // true to mark this role as dependent on locale (e.g. translator)
}

export {
	entries,
	ensure, 
	PartialBy
}
