import { CSSResult } from 'lit';
import type AbstractEntity from './AbstractEntity.js';
import type {
	AccessT,
	AuthorizationT,
	GetAccessT,
	StatusT,
	UserAccessT
} from './types/access';
import type {
	ColumnsConfig,
	DefaultI,
	EntityElement,
	EntityElementList,
	EntityStatus,
	RenderConfig,
} from './types/entity';
import type {
	FieldConfig,
	GridConfig,
	Lookup,
	Model
} from './types/modelComponent';
export {
	AccessT,
	AuthorizationT, GetAccessT, StatusT, UserAccessT
};

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
// export * from './types/entityAction';
export * from './types/entityResource';
export * from './types/resource';
export {
	ColumnsConfig,
	EntityElement,
	EntityElementList,
	EntityStatus, FieldConfig, GridConfig, Lookup,
	Model,
	RenderConfig
};

// import type { ensure, entries, PartialBy } from '@lit-app/shared/types.js'


export type Strings = {
	[key: string]: string | Strings;
};

export type Role = {
	name: keyof AccessT['user'] // | 'superAdmin' 
	level: number // 1: owner, 2: admin, 3: editor, 3: viewer - role level; only higher level can edit lower level can assign lower level	
	locale?: boolean // true to mark this role as dependent on locale (e.g. translator)
}



import type { DocumentationKeysT } from './AbstractEntity.js';
import type { ActionsT } from './types/actionTypes.js';
import type { RenderInterface as ActionI, StaticEntityActionI } from './types/renderActionI.js';
import type { RenderInterface as CreateI } from './types/renderEntityCreateI.js';
import type { RenderInterface as FieldI, StaticEntityField } from './types/renderEntityFieldI.js';
import type { RenderInterface as RenderI } from './types/renderEntityI.js';

export interface StaticEntityI<D extends DefaultI = any, A extends ActionsT = ActionsT> {
	actions: A
	styles: CSSResult | CSSResult[];
	getAccess: GetAccessT
	accessDataGetter: (data: any) => Promise<AccessT>
	locale?: Strings
	roles: Readonly<Role[]>
	userLoader?: (search: string) => Promise<any>
	documentationKeys: DocumentationKeysT
	getDefaultData: () => Partial<D>
	['constructor']: typeof AbstractEntity<D, A>

}
export interface EntityI<
	D extends DefaultI = DefaultI,
	C extends RenderConfig = RenderConfig,
	A extends ActionsT = ActionsT
> extends
	StaticEntityActionI<A>,
	StaticEntityField<D>,
	StaticEntityI<D, A> {
	// documentationKeys: DocumentationKeysT
	entityName: string,
	icon: string,
	new(cmp: EntityElement, realtime?: boolean): entityI<D, C, A>
	// renderForm(): string
}

export interface entityI<
	D extends DefaultI = DefaultI,
	C extends RenderConfig = RenderConfig,
	A extends ActionsT = ActionsT,
> extends
	Omit<AbstractEntity<D, A>, 'actions' | 'renderContent' | 'renderFieldUpdate'>,
	ActionI<A>,
	Omit<RenderI<D, C>, 'renderFieldUpdate'>,
	FieldI<D, C>,
	CreateI<D> { }


/**
 * Effect 
 */
export { Access, UserAccess } from './effect/Access.js';
export { DataStructFact, ResourceStructFact } from './effect/DataM.js';
export { LocaleUI, type LocaleI } from './effect/LocaleM.js';
export { MetaDataSchema, RefSchema } from './effect/MetaData.js';

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