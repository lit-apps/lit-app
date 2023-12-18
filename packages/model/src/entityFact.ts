import EntityAbstract, {StaticEntityI} from './entityAbstract';
import fieldMixin, {RenderInterface as FieldI, StaticEntityField} from './renderEntityFieldMixin';
import entityMixin, {RenderInterface as renderI} from './renderEntityMixin';
import actionMixin, {RenderInterface as ActionI, StaticEntityActionI, defaultActions} from './renderEntityActionMixin';
import { Actions,  RenderConfig } from './types';
import { DefaultI } from './types/entity';
import { Model} from './types/modelComponent';

type Constructor<T = {}> = new (...args: any[]) => T;

export {
	defaultActions
}

export default function abstractEntityFact<
	D extends DefaultI, 
	C extends RenderConfig = RenderConfig,
	A extends Actions = Actions
>(
	model: Model<D>, action?: A) {
		if(!action) {
			action = defaultActions as unknown as A
		}
	class R extends 
		fieldMixin<D, C>(
			entityMixin<D, C>(
				actionMixin<D, typeof action>(EntityAbstract, action)), model) { }
	
	return R as unknown as Constructor<EntityAbstract> & 
		Constructor<renderI<D, C>> &
		Constructor<FieldI<D, C>> &
		Constructor<ActionI<D, typeof action>> &
		StaticEntityActionI<D, typeof action> & 
		StaticEntityField<D> & 
		StaticEntityI
}