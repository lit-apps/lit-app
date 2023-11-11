import { get } from '@preignition/preignition-util/src/deep';
import { activeItemChanged } from '@preignition/preignition-util/src/grid';
import { Grid } from '@vaadin/grid';
import '@vaadin/grid/theme/material/vaadin-grid-column.js';
import '@vaadin/grid/theme/material/vaadin-grid-sort-column.js';
import '@vaadin/grid/theme/material/vaadin-grid.js';
import { html, nothing, TemplateResult } from 'lit';
import {
	columnBodyRenderer,
	columnHeaderRenderer,
	gridRowDetailsRenderer
} from 'lit-vaadin-helpers';
import { choose } from 'lit/directives/choose.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { html as htmlStatic, literal } from 'lit/static-html.js';
import AbstractEntity from './entityAbstract';
import { Collection, CollectionI, ensure, RenderConfig } from './types';
import {
	GridConfig,
	Model,
	ModelComponent,
	ModelComponentSelect
} from './types/modelComponent';

import {RenderInterface as RenderActionInterface } from './renderEntityActionMixin';

type Constructor<T = {}> = new (...args: any[]) => T;

/**
 * 
 * 
 * Mixin in charge of the overall rendering of an entity
 * 
 * 
 * 
 * renderEntityAccess() {
 *		return html`
 *			<slot name="header">
 *				${this.renderHeader(){
 *             this.renderTitle
 *         }}
 *			</slot>
 *			<slot name="sub-header"></slot>
 *			<slot name="body">
 *				${this.renderBody() {
 *          array ? 
 *              this.renderArrayContent() {
 *                 variant === 'card' ?
 *                   this.renderCard() {
 *                     this.renderCardItem() {}
 *                   } :     
 *                   this.renderGrid() {
 *                      this.gridDetailRenderer() {
 *                        this.renderTable() {}
 *                      }
 *                      this.renderGridColumn() {}         
 *                      <slot name="body-grid-column">       
 *                    }  
	*               } : 
 *            this.renderContent() {
 *                showMetaData ? this.renderMetaData() : ''
 *                showAction ? this.renderAction() : ''
 *                this.renderForm)}
 *           }}
 *			</slot>
 *			<slot name="footer">
 *				${this.renderFooter()}
 *			</slot>
 *		`;
 */



export declare class RenderInterface<D, C extends RenderConfig = RenderConfig> extends RenderActionInterface<D, any> {
	showMetaData: boolean
	
	public renderFooter(_data: D, _config?: C): TemplateResult
	public renderBody(data: D, config?: C): TemplateResult
	public renderHeader(data: D, config?: C): TemplateResult
	
	private renderArrayContent(data: Collection<D>, config?: C): TemplateResult
	private renderGrid(data: Collection<D>, config?: C): TemplateResult
	/* renderContent should be private, but we use it in renderEntityActionMixin */
	protected renderContent(data: D, config?: C): TemplateResult

	protected renderTitle(data: D, config?: C): TemplateResult
	protected renderGridColumns(config?: C): TemplateResult
	protected gridDetailRenderer(data: CollectionI<D>, _model?: any, _grid?: any): TemplateResult
	protected renderTable(data: CollectionI<D>, config?: C): TemplateResult
	protected renderMetaData(_data: D, _config?: C): TemplateResult
	protected renderCard(data: Collection<D>, config?: C): TemplateResult
	protected renderCardItem(data: D, config?: C): TemplateResult
	protected renderEmptyArray(_config?: C): TemplateResult
	protected renderForm(_data: D, _config?: C): TemplateResult
}

type Open = (entityName: string, id: string) => void
/**
 * RenderMixin 
 */
export default function renderMixin<D, C extends RenderConfig = RenderConfig>(superclass: Constructor<AbstractEntity & {open: Open}> ) {
	class R extends superclass {
	// class R extends RenderActionMixin(superclass) {

		showMetaData: boolean = false
		// open!: (entityName: string, id: string) => void

		renderGrid(data: Collection<D>, config?: C) {
			const onSelected = async (e: CustomEvent) => {
				(this.host as EntityElementList).selectedItems = [...(e.target as Grid).selectedItems];
			}
			const onSizeChanged = async (e: CustomEvent) => {
				await this.host.updateComplete;
				(this.host as EntityElementList).size = e.detail.value;
			}

			const onDblClick = async (e: CustomEvent) => {
				const context = (e.currentTarget as Grid).getEventContext(e);
				// by default, open the item
				if (context.item) {
					this.open(this.entityName, context.item.$id)
				}
			}

			return html`<vaadin-grid 
			id="grid"
      class="flex grid entity ${this.entityName}"
			.itemIdPath=${'$id'}
			.items=${data}
			${gridRowDetailsRenderer(this.gridDetailRenderer.bind(this))}
			@active-item-changed=${config?.gridConfig?.preventDetails ? null : activeItemChanged}
      @dblclick=${config?.gridConfig?.preventDblClick ? null : onDblClick}
			@selected-items-changed=${onSelected}
			@size-changed=${onSizeChanged}>
      ${this.renderGridColumns(config)}
      <slot name="body-grid-columns"></slot>
		</vaadin-grid>`
		}

		renderGridColumns(_config?: C) {
			// console.log('renderGridColumns')
			const model = this.model;
			const colTag = literal`vaadin-grid-column`
			const colSortTag = literal`vaadin-grid-sort-column`

			const fields = getFieldsFromModel(model, (model) => !!model.grid)
				.sort((a, b) => (a[1].grid?.index || 0) - (b[1].grid?.index || 0));

			return html`${fields.map(([key, m]) => {

				const grid = ensure<GridConfig>(m.grid as GridConfig)

				const tagName = grid.sortable ? colSortTag : colTag
				return htmlStatic`<${tagName} 
        flex-grow=${ifDefined(grid.width ? '0' : grid.flex)} 
        width=${ifDefined(grid.width)} 
        ?resizable=${ifDefined(grid.resizable)} 
        path=${grid.path || key}
        header=${grid.header || m.label}
        ${grid.bodyRenderer ? columnBodyRenderer(grid.bodyRenderer) : nothing}  
        ${grid.headerRenderer ? columnHeaderRenderer(grid.headerRenderer) : nothing}  
        ></${tagName}>
      `})
				}`
		}

		gridDetailRenderer(data: CollectionI<D>, _model?: any, _grid?: any) {
			return html`
			<div class="layout vertical">
				${this.renderTable(data)}
			</div>
	`
		}

		renderTable(data: CollectionI<D>, _config?: C) {
			const model = this.model;
			// get the fields to render in table
			const fields = getFieldsFromModel(model, (model) => !!model.table)
				.sort((a, b) => (a[1].table?.index || 0) - (b[1].table?.index || 0));

			return html`
        <table class="entity table ${this.entityName}">
          ${fields.map(([key, m]) => {
				const component = m.component || 'textfield';
				const value = get(m.table?.path || key, data)
				let display = value

				if ((m.table?.optional === true) && (value == undefined)) {
					return
				}
				if (m.table?.renderer) {
					display = m.table.renderer(data)
				}
				else if (component === 'select') {
					const item = (m as ModelComponentSelect).items?.find(i => i.code === value)
					display = item?.label || key
				}
				return html`<tr class="${key}"><td class="label">${m.table?.label || m.label || key}</td><td>${display}</td></tr>`
			})
				}
        </table>
     `
		}

		renderMetaData(_data: D, _config?: C) {
			return html`<meta-data></meta-data>`
		}

		override renderBody(data: D, config?: C) {
			if (Array.isArray(data)) {
				if (data && data.length === 0) {
					this.renderEmptyArray(config);
				}
				return this.renderArrayContent(data, config)
			}
			return this.renderContent(data, config)
		}

		override renderContent(data: D, config?: C) {
			if (config?.variant === 'card') {
				return this.renderCardItem(data, config)
			}
			return html`
			<div class="layout vertical">							
				${data === undefined ? html`Loading...` :
					[
						this.showMetaData ? this.renderMetaData(data, config) : html``,
						// this should be renderEntityActions from renderEntityActionMixin
						super.renderContent(data, config), 
						this.renderForm(data, config)
					]
				}
			</div>`
		}

		private renderArrayContent(data: Collection<D>, config?: C) {
			if (config?.variant === 'card') {
				return this.renderCard(data, config)
			}
			return this.renderGrid(data, config)
		}

		renderCard(data: Collection<D>, config?: C) {
			const layout = config?.layout || 'horizontal'
			const gridMap = (d: D) => this.renderCardItem(d, config)
			const map = (d: D) => html`<div class="flex">${gridMap(d)}</div>`
			return html`<div class="container layout ${layout} large wrap">
      ${layout === 'grid' ? data.map(gridMap) : data.map(map)}
    </div>`
		}

		renderCardItem(_data: D, _config?: C) {
			return html``
		}

		renderEmptyArray(_config?: C) {
			return html`<p><lapp-icon class="secondary">info</lapp-icon></md-info>No ${this.entityName} found</p>`
		}

		renderTitle(_data: D, _config?: C) {
			return html`${this.entityName}`
		}

		override renderHeader(data: D, config?: C) {
			const title = this.renderTitle(data, config)
			const icon = this.host.icon || this.icon
			return html`${choose(config?.level,
				[
					[2, () => html`<h3 style="display: flex; flex-direction: row;">${title}</h3>`],
					[3, () => html`<h5 class="secondary">${title}</h5>`],
					[4, () => html``]
				],
				() => html`
      <h2  class="underline layout horizontal">
        <lapp-icon .icon=${config?.entityStatus?.isEditing ? 'edit' : icon}></lapp-icon>
        ${title}
      </h2>`
			)}`

		}

		override renderFooter(_data: D, _config?: C) {
			return html``
		}

		renderForm(_data: D, _config?: C) {
			return html`Form`
		}

	};
	return R as unknown as Constructor<RenderInterface<D, C>> & typeof superclass;
}

function getFieldsFromModel(model: Model<any>, condition: (m: ModelComponent) => boolean): [string, ModelComponent][] {
	function getFields(model: Model<any>, path: string = ''): [string, ModelComponent][] {
		const fields: [string, ModelComponent][] = [];

		for (const key in model) {
			const component = model[key];
			const p = path ? `${path}.${key}` : key
			if (condition(component)) {
				fields.push([p, component]);
			}
			else if (typeof component === 'object') {
				fields.push(...getFields(component as Model<any>, p));
			}
		}

		return fields;
	}
	return getFields(model)
}