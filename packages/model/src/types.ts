import type {
	ColumnsConfig,
	EntityAccess,
	EntityStatus,
	EntityElement,
	EntityElementList,
	EntityRenderer,
	RenderConfig,
} from './types/entity';
import type {
	Action, DefaultActions, Actions
} from './types/action'
import type {
	Model,
	Lookup,
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
	RenderConfig, EntityAccess, EntityStatus, ColumnsConfig, EntityRenderer, EntityElement, EntityElementList,
	Action, Actions, DefaultActions,
	Model, Lookup
}
export * from './events'
export * from './types/dataI'
export * from './types/getAccess'

import entries from './typeUtils/entries';
import ensure from './typeUtils/ensure';

export type Strings = {
	[key: string]: string | Strings;
};

import {Access} from './types/dataI'
export type Role = {
	name: keyof Access['user'] | 'superAdmin' 
	level: number // 1: owner, 2: admin, 3: editor, 3: viewer - role level; only higher level can edit lower level can assign lower level	
	locale?: boolean // true to mark this role as dependent on locale (e.g. translator)
}

export {
	entries,
	ensure
}