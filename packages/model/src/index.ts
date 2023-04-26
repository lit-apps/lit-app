// import BaseDetailMixin from './mixin/base-detail-mixin';
import DispatchActionMixin from './mixin/dispatch-action-mixin';
import renderConfirmDialogMixin from './mixin/render-confirm-dialog-mixin';
import Entity, { mergeStatic } from './entity';
import type { DefaultActions, Actions } from './entity';
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
	Action
} from './types/action'
import type {
	Model,
	Lookup,
} from './types/modelComponent'

export { ProvideAccessMixin, ConsumeAccessMixin, entityAccessContext, type ProvideAccessMixinInterface, type AccessMixinInterface } from './mixin/context-access-mixin';
export { ProvideEntityStatusMixin, ConsumeEntityStatusMixin, entityStatusContext, type EntityStatusMixinInterface } from './mixin/context-entity-status-mixin';
export { ProvideEntityMixin, ConsumeEntityMixin, entityContext, type EntityMixinInterface } from './mixin/context-entity-mixin';
export { ProvideDataMixin, ConsumeDataMixin, dataContext, type DataMixinInterface } from './mixin/context-data-mixin';

export {
	Entity, mergeStatic, Actions, DefaultActions,
	DispatchActionMixin,
	renderConfirmDialogMixin,
	RenderConfig, EntityAccess, EntityStatus, ColumnsConfig, EntityRenderer, EntityElement, EntityElementList,
	Action,
	Model, Lookup,
}

export * from './events'
export * from './types/dataI'
export * from './types/getAccess'

import entityHolder from './entity-holder';
import './entity-holder'
export {entityHolder}
