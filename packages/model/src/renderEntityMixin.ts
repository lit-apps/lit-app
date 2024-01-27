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
import { repeat } from 'lit/directives/repeat.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { html as htmlStatic, literal } from 'lit/static-html.js';
import AbstractEntity from './abstractEntity';
import { Actions, Collection, CollectionI, ensure, EntityElementList, RenderConfig } from './types';
import {
	GridConfig,
	Model,
	ModelComponent,
	ModelComponentSelect
} from './types/modelComponent';


import {RenderInterface} from './types/renderEntityI';
export type { RenderInterface } from './types/renderEntityI';

import { DefaultI } from './types/entity';

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
 * 								config.entityStatus.isNew ? this.renderFormNew() : this.renderForm() 
 *           }}
 *			</slot>
 *			<slot name="footer">
 *				${this.renderFooter()}
 *			</slot>
 *		`;
 */





type Open = (entityName: string, id: string) => void
/**
 * RenderMixin 
 */
export default function renderMixin<D extends DefaultI, A extends Actions = Actions, C extends RenderConfig = RenderConfig>(superclass: Constructor<AbstractEntity & {open: Open}> ) {
	class R extends superclass {
	// class R extends RenderActionMixin(superclass) {

		showMetaData: boolean = false

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

		renderBody(data: D, config?: C) {
			if (Array.isArray(data)) {
				if (data && data.length === 0 && (config?.variant !== 'list')) {
					return this.renderEmptyArray(config);
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
						config?.entityStatus.isNew ? 
							this.renderFormNew(data, config) : 
							this.renderForm(data, config)
					]
				}
			</div>`
		}

		private renderArrayContent(data: Collection<D>, config?: C) {
			if (config?.variant === 'card') {
				return this.renderCard(data, config)
			}
			if (config?.variant === 'list') {
				return this.renderList(data, config)
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

		renderList(data: Collection<D>, config?: C) {
			if(data.length === 0) {
				return this.renderEmptyArray(config)
			}
			return html`<md-list>
				${repeat(data, (d: CollectionI<D>) => d.$id, (d: CollectionI<D>, index: number) => this.renderListItem(d, config, index))}
			</md-list>`
			
						
		}
		
		renderListItem(_data: D, _config?: C, _index: number) {
			return html`<md-list-item></md-list-item>`
		}

		renderEmptyArray(_config?: C) {
			return nothing
		}

		renderTitle(_data: D, _config?: C) {
			return html`${this.entityName}`
		}

		renderHeader(data: D, config?: C) {
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
		renderSubHeader(_data: D, _config?: C) {
			return nothing
		}


		renderFooter(_data: D, _config?: C) {
			return nothing
		}

		renderForm(_data: D, _config?: C) {
			return html`Form`
		}
		renderFormNew(data: D, _config?: C) {
			return html`
      <div class="layout vertical  wrap">
				${this.renderFieldUpdate('name', undefined, data)}
				${this.renderFieldUpdate('title', undefined, data)}
			</div>`
		}
		renderFieldUpdate(_name : string, _config?: any, _data?: D): TemplateResult {
			return html``
		}
	};
	return R as unknown as Constructor<RenderInterface<D, A, C>> & typeof superclass;
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