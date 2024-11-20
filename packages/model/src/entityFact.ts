/**
 * Entity in which we replace @Lit-app/model actionMixin with a new implementation
 */

import AbstractEntity from "./abstractEntity.js";

import entityMixin, { RenderInterface as RenderI } from './renderEntityMixin';
import fieldMixin, { RenderInterface as FieldI, StaticEntityField } from './renderEntityFieldMixin';
import { RenderInterface as ActionI, StaticEntityActionI } from "./types/renderActionI.js";
import createMixin, { type RenderEntityCreateInterface as CreateI} from './renderEntityCreateMixin.js';

import { DataI, DefaultActions, RenderConfig, StaticEntityI } from './types';
import type { Model } from './types/modelComponent';
import { CSSResult } from 'lit';
import type { ActionsT, DefaultActionsT } from "./types/actionTypes";
import { defaultActions } from './defaultActions';
import actionMixin from './renderActionMixin';
import { DefaultI } from "./types/entity.js";

type Constructor<T = {}> = new (...args: any[]) => T;

export {
  defaultActions
};

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
  A extends ActionsT = ActionsT
>(
  { model, actions }:
    { model: Model<D>, actions?: A }
) {

  if (!actions) {
    actions = defaultActions as unknown as A
  }
  class R extends
    fieldMixin<D>(
      entityMixin<D, C>(
        actionMixin<typeof actions>(AbstractEntity, actions)), model) {
    static declare entityName: string
    static declare icon: string
    static declare model: Model<any>
    static declare actions: ActionsT
    static declare styles: CSSResult | CSSResult[];
  }

  return R as unknown as Constructor<AbstractEntity> &
    Constructor<RenderI<D, C>> &
    Constructor<FieldI<D>> &
    Constructor<ActionI<typeof actions>> &
    // Constructor<ActionI<DefaultActionsT<D>> &
    Constructor<CreateI<D>> &
    StaticEntityActionI<typeof actions> &
    StaticEntityField<D> &
    StaticEntityI
}