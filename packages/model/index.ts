// import BaseDetailMixin from './mixin/base-detail-mixin';
import mergeStatic from "./src/mergeStatic";
import renderConfirmDialogMixin from './src/mixin/render-confirm-dialog-mixin';

export {
	RenderHeaderMixin,
} from './src/mixin/render-header-mixin';

export {
	ConsumeUidMixin,
	ProvideUidMixin,
} from './src/mixin/context-uid-mixin';
export {
	ConsumeAccessMixin,
	ProvideAccessMixin,
} from './src/mixin/context-access-mixin';
export {
	ConsumeDataMixin,
	ProvideDataMixin,
	dataContext
} from './src/mixin/context-data-mixin';
export {
	ConsumeEntityMixin,
	ProvideEntityMixin,
} from './src/mixin/context-entity-mixin';
export {
	ConsumeEntityStatusMixin,
	ProvideEntityStatusMixin,
} from './src/mixin/context-entity-status-mixin';
export {
	mergeStatic,
	renderConfirmDialogMixin,
};
export * from './src/types';




