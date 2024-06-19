import { CSSResult } from 'lit';
import type AbstractEntity from './abstractEntity';
import type {
	Action,
	Actions, ActionType,
	DefaultActions
} from './types/action';
import type {
	ColumnsConfig,
	DefaultI,
	EntityAccess,
	EntityElement,
	EntityElementList,
	EntityStatus,
	RenderConfig
} from './types/entity';
import { GetAccess } from './types/getAccess';
import type {
	GridConfig,
	Lookup,
	Model
} from './types/modelComponent';

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

export * from './events';
export * from './types/communication';
export {
	type EntityStatusMixinInterface
} from './mixin/context-entity-status-mixin';
export * from './types/dataI';
export * from './types/getAccess';
export * from './types/resource';
export * from './types/entityResource';
export {
	Action, Actions, ActionType, ColumnsConfig, DefaultActions, EntityAccess, EntityElement, EntityElementList, EntityStatus, GridConfig, Lookup, Model, RenderConfig
};
export * from './types/entityAction';
export * from './types/mixin';

import ensure from './typeUtils/ensure';
import entries from './typeUtils/entries';
import type { PartialBy } from './typeUtils/partialBy';

export type Strings = {
	[key: string]: string | Strings;
};

import { Access } from './types/dataI';
export type Role = {
	name: keyof Access['user'] // | 'superAdmin' 
	level: number // 1: owner, 2: admin, 3: editor, 3: viewer - role level; only higher level can edit lower level can assign lower level	
	locale?: boolean // true to mark this role as dependent on locale (e.g. translator)
}

export {
	ensure, entries, PartialBy
};

import { RenderInterface as FieldI, StaticEntityField } from './types/renderEntityFieldI';
import { RenderInterface as RenderI } from './types/renderEntityI';
import { RenderInterface as RenderA, StaticEntityActionI } from './types/renderEntityActionI';


export interface StaticEntityI<D = any, A extends Actions = Actions> {
	// entityName: string
	// model: Model<D>
	icon: string
	actions: A
	styles: CSSResult | CSSResult[];
	getAccess: GetAccess
	locale?: Strings
	roles: Role[]
	userLoader?: (search: string) => Promise<any>
	['constructor']: typeof AbstractEntity;
}
export interface EntityI<
	D extends DefaultI = DefaultI, 
	A extends Actions = Actions,
	C extends RenderConfig = RenderConfig 
> extends 
	StaticEntityActionI<D, A>,
	StaticEntityField<D>,
	StaticEntityI<D, A>
	{
		new(cmp: EntityElement, realtime?: boolean, listenOnAction?: boolean ): entityI<D, A, C>;
	}

export interface entityI<
	D extends DefaultI = DefaultI, 
	A extends Actions = Actions, 
	C extends RenderConfig = RenderConfig> extends 
		Omit<AbstractEntity<D, A>,'actions' | 'renderContent'>,  
		RenderI<D, A, C>,
		FieldI<D, C>,
		RenderA<D, A>  { }

