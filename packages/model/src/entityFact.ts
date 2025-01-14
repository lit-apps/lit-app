/**
 * Entity in which we replace @Lit-app/model actionMixin with a new implementation
 */

import AbstractEntity, { DocumentationKeysT } from "./AbstractEntity.js";

import { type RenderInterface as CreateI } from './renderEntityCreateMixin.js';
import fieldMixin, { RenderInterface as FieldI, StaticEntityField } from './renderEntityFieldMixin';
import entityMixin, { RenderInterface as RenderI } from './renderEntityMixin';
import { RenderInterface as ActionI, StaticEntityActionI } from "./types/renderActionI.js";
import { type StaticRenderInterface as StaticCreate } from "./types/renderEntityCreateI.js";

import { CSSResult } from 'lit';
// import { defaultActions } from './defaultActions';
import actionMixin from './renderActionMixin';
import { RenderConfig, StaticEntityI } from './types';
import type { ActionsT } from "./types/actionTypes";
import { DefaultI } from "./types/entity.js";
import type { Model } from './types/modelComponent';

type Constructor<T = {}> = new (...args: any[]) => T;


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
  // type AA = typeof actions & ActionsT
  // if (!actions) {
  //   actions = defaultActions<D>() as unknown as A 
  // }
  class R extends
    fieldMixin<D>(
      entityMixin<D, C>(
        actionMixin<A>(AbstractEntity, actions)), model) {
    static declare entityName: string
    static declare title: string
    static declare icon: string
    static declare model: Model<any>
    static declare actions: A
    static declare styles: CSSResult | CSSResult[]
    static declare documentationKeys: DocumentationKeysT
    
  }

  return R as unknown as 
    Constructor<AbstractEntity<D, A>> &
    Constructor<RenderI<D, C>> &
    Constructor<FieldI<D>> &
    Constructor<ActionI<A>> &
    Constructor<CreateI<D>> &
    StaticEntityActionI<A> &
    StaticEntityField<D> &
    StaticEntityI<D, A> &
    StaticCreate<D>
}

