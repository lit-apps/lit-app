import AbstractEntity from './abstractEntity';
import fieldMixin, {RenderInterface as FieldI, StaticEntityField} from './renderEntityFieldMixin';
import entityMixin, {RenderInterface as RenderI} from './renderEntityMixin';
import actionMixin, {RenderInterface as ActionI, StaticEntityActionI, defaultActions} from './renderEntityActionMixin';
import { Actions,  RenderConfig, StaticEntityI} from './types';
import { DefaultI } from './types/entity';
import { Model} from './types/modelComponent';

type Constructor<T = {}> = new (...args: any[]) => T;

export {
	defaultActions
}

/**
 * # Abstract Entity Factory 
 * 
 * This is the base class for all Entity classes.
 * 
 * If applies a series of mixin that define the rendering and action of the entity: 
 * 
 * ```ts
 *  renderEntityAccess() {
 *		return html`
 *			<slot name="header">
 *				${this.renderHeader(){
 *             this.renderTitle
 *         }}
 *			</slot>
 *     <slot name="sub-header">
 *				${this.renderSubHeader()}
 *			</slot>
 *			<slot name="body">
 *				${this.renderBody() {
 *          array ? 
 *              this.renderArrayContent() {
 *                 variant === 'card' ?
 *                   this.renderCard() {
 *                     this.renderCardItem() {}
 *                   } :     
 * 								 variant === 'list' ?
 *                   this.renderList() {
 *                     this.renderListItem() {}
 *                   } :  
 *                   this.renderGrid() {
 *                      this.renderGridDetail() {
 *                        this.renderTable() {}
 *                      }
 *                      this.renderGridColumn() {}         
 *                    }  
 *               } : 
 *            this.renderContent() {
 *                showMetaData ? this.renderMetaData() : ''
 *                showAction ? this.renderEntityActions() : ''
 * 								config.entityStatus.isNew ? this.renderFormNew() : this.renderForm() 
 *           }}
 *			</slot>
 *			<slot name="footer">
 *				${this.renderFooter()}
 *			</slot>
 *		`;
 * ```
 * 
 * @param model 
 * @param action 
 * @returns 
 */
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
			entityMixin<D, A, C>(
				actionMixin<D, typeof action>(AbstractEntity, action)), model) { }
	
	return R as unknown as Constructor<AbstractEntity> & 
		Constructor<RenderI<D, typeof action, C>> &
		Constructor<FieldI<D, C>> &
		Constructor<ActionI<D, typeof action>> &
		StaticEntityActionI<D, typeof action> & 
		StaticEntityField<D> & 
		StaticEntityI
}