import { CSSResult } from 'lit';
import type AbstractEntity from './AbstractEntity.js';
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
export {
	type EntityStatusMixinInterface
} from './mixin/context-entity-status-mixin';
export * from './types/communication';
export * from './types/dataI';
export { isCollection } from './types/dataI';
export * from './types/entityAction';
export * from './types/entityResource';
export * from './types/getAccess';
export * from './types/resource';
export {
	ColumnsConfig, EntityAccess, EntityElement, EntityElementList, EntityStatus, GridConfig, Lookup, Model, RenderConfig
};

// import type { ensure, entries, PartialBy } from '@lit-app/shared/types.js'


export type Strings = {
	[key: string]: string | Strings;
};

import { Access } from './types/dataI';
export type Role = {
	name: keyof Access['user'] // | 'superAdmin' 
	level: number // 1: owner, 2: admin, 3: editor, 3: viewer - role level; only higher level can edit lower level can assign lower level	
	locale?: boolean // true to mark this role as dependent on locale (e.g. translator)
}



import { ActionsT } from './types/actionTypes.js';
import { RenderInterface as ActionI, StaticEntityActionI } from './types/renderActionI.js';
import { RenderInterface as CreateI } from './types/renderEntityCreateI.js';
import { RenderInterface as FieldI, StaticEntityField } from './types/renderEntityFieldI.js';
import { RenderInterface as RenderI } from './types/renderEntityI.js';

export interface StaticEntityI<D = any, A extends ActionsT = ActionsT> {
	actions: A
	styles: CSSResult | CSSResult[];
	getAccess: GetAccess
	accessDataGetter: (data: any) => Promise<Access>
	locale?: Strings
	roles: Readonly<Role[]>
	userLoader?: (search: string) => Promise<any>
	['constructor']: typeof AbstractEntity;
}
export interface EntityI<
	D extends DefaultI = DefaultI, 
	C extends RenderConfig = RenderConfig,
	A extends ActionsT = ActionsT
> extends 
	StaticEntityActionI< A>,
	StaticEntityField<D>,
	StaticEntityI<D, A>
	{
		entityName: string,
		icon: string,
		new(cmp: EntityElement, realtime?: boolean ): entityI<D, C, A>;
	}

export interface entityI<
	D extends DefaultI = DefaultI, 
	C extends RenderConfig = RenderConfig,
	A extends ActionsT = ActionsT,
	> extends 
		Omit<AbstractEntity<D, A>, 'actions' | 'renderContent' | 'renderFieldUpdate'>,  
		ActionI<A>,
		Omit<RenderI<D, C>, 'renderFieldUpdate'>,
		FieldI<D>,
		CreateI<D>  { }


// NOTE: we cannot use the following because it breaks TS. However, this 
// would be the ideal way to define the interfaces
//import abstractEntity from './entityFact.js';
// export interface EntityI<
// D extends DefaultI = DefaultI,
// C extends RenderConfig = RenderConfig,
// A extends ActionsT = ActionsT
// > extends ReturnType<typeof abstractEntity<D, C, A>> {
// 	entityName: string
// 	icon: string
// }

// export interface entityI<
// D extends DefaultI = DefaultI,
// C extends RenderConfig = RenderConfig,
// A extends ActionsT = ActionsT
// >  extends InstanceType<EntityI<D,C, A>> {}