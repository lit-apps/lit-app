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
import { Actions, Collection, CollectionI, ensure, EntityElementList, isCollection, RenderConfig } from './types';
import {
  GridConfig,
  Model,
  ModelComponent,
  ModelComponentSelect
} from './types/modelComponent';


import { RenderInterface } from './types/renderEntityI';
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
 *				${this.renderBody(data, config) {
 *          data === undefined ? this.renderDataLoading() : 
 *          array ? 
 *            array.length === 0 ? this.renderEmptyArray() :  
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
export default function renderMixin<D extends DefaultI, A extends Actions = Actions, C extends RenderConfig = RenderConfig>(superclass: Constructor<AbstractEntity & { open: Open }>) {
  class R extends superclass {
    // class R extends RenderActionMixin(superclass) {

    showMetaData: boolean = false
    itemIdPath: string = '$id' // collectionGroup will need to use $path

    renderGrid(data: Collection<D>, config: C) {
      // bring selection up to host 
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
        class="flex entity grid ${this.entityName}"
        .itemIdPath=${this.itemIdPath}
        .items=${data}
        ${gridRowDetailsRenderer((data:CollectionI<D>, model: any, grid: any) => this.renderGridDetail(data, config, model, grid))}
        @active-item-changed=${config?.gridConfig?.preventDetails ? null : activeItemChanged}
        @dblclick=${config?.gridConfig?.preventDblClick ? null : onDblClick}
        @selected-items-changed=${onSelected}
        @size-changed=${onSizeChanged}>
        ${this.renderGridColumns(config)}
      </vaadin-grid>`
    }

    renderGridColumns(config: C) {
      // console.log('renderGridColumns')
      const showSelectionColumn = config.columnsConfig?.showSelectionColumn;
      const model = this.model;
      const colTag = literal`vaadin-grid-column`
      const colSortTag = literal`vaadin-grid-sort-column`

      // const fields = getFieldsFromModel(model, model?.grid?.condition ? model.grid?.condition : (model) => !!model.grid)
      const fields = getFieldsFromModel(model, config, (model) => model.grid)
        .sort((a, b) => (a[1].grid?.index || 0) - (b[1].grid?.index || 0));

      return html`
      ${showSelectionColumn ? html`<vaadin-grid-selection-column ></vaadin-grid-selection-column>` : nothing}
      ${fields.map(([key, m]) => {

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

    renderGridDetail(data: CollectionI<D>, config: C , _model: any, _grid: any) {
      return html`
			<div class="layout vertical">
				${this.renderTable(data, config)}
			</div>`
    }

    renderTable(data: CollectionI<D>, config: C) {
      const model = this.model;
      // get the fields to render in table
      const fields = getFieldsFromModel(model, config, (model) => model.table)
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

    renderMetaData(_data: D, _config: C) {
      return html`<meta-data></meta-data>`
    }

    renderBody(data: D, config: C) {
      if(data === undefined) {
        return this.renderDataLoading(config)
      }
      if (Array.isArray(data)) {
        if (data && data.length === 0 && (config?.variant !== 'list')) {
          return this.renderEmptyArray(config);
        }
        return this.renderArrayContent(data, config)
      }
      return this.renderContent(data, config)
    }

    renderDataLoading(config: C) {
      return html`Loading...`
    }

    override renderContent(data: D, config: C) {
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
            html`<form id="entityForm">
              ${config?.entityStatus.isNew ?
                this.renderFormNew(data, config) :
                this.renderForm(data, config)}
            </form>`

          ]
        }
			</div>`
    }

    private renderArrayContent(data: Collection<D>, config: C) {
      if (config?.variant === 'card') {
        return this.renderCard(data, config)
      }
      if (config?.variant === 'list') {
        return this.renderList(data, config)
      }
      return this.renderGrid(data, config)
    }

    renderCard(data: Collection<D>, config: C) {
      const layout = config?.layout || 'horizontal'
      const gridMap = (d: D, index: number) => this.renderCardItem(d, config, index)
      const map = (d: D, index: number) => html`<div class="flex">${gridMap(d, index)}</div>`
      return html`<div class="entity card layout ${layout} ${this.entityName} wrap">
			${repeat(data, (d: CollectionI<D>) => d.$id, layout.indexOf('grid') > -1 ? gridMap : map)}
      
    </div>`
    }

    renderCardItem(_data: D, _config: C, _index?: number) {
      return html``
    }

    renderList(data: Collection<D>, config: C) {
      if (data.length === 0) {
        return this.renderEmptyArray(config)
      }
      return html`<md-list class="entity list ${this.entityName}">
				${repeat(data, (d: CollectionI<D>) => d.$id, (d: CollectionI<D>, index: number) => this.renderListItem(d, config, index))}
			</md-list>`


    }

    renderListItem(_data: D, _config: C, _index?: number) {
      return html`<md-list-item></md-list-item>`
    }

    renderEmptyArray(_config?: C) {
      return nothing
    }

    renderTitle(_data: D, _config: C) {
      return html`${this.entityName}`
    }
    renderArrayTitle(_data: Collection<D>, _config: C) {
      return html`${this.entityName}`
    }

    renderHeader(data: D | Collection<D>, config: C) {
      const title = isCollection<D>(data) ? this.renderArrayTitle(data, config) : this.renderTitle(data, config)
      const icon = this.host.icon || this.icon
      return html`${choose(config?.level,
        [
          [2, () => html`<h3 style="display: flex; flex-direction: row;">${title}</h3>`],
          [3, () => html`<h5 class="secondary" style="display: flex; flex-direction: row;">${title}</h5>`],
          [4, () => html``]
        ],
        () => html`
      <h2  class="underline layout horizontal">
        <lapp-icon .icon=${config?.entityStatus?.isEditing ? 'edit' : icon}></lapp-icon>
        ${title}
      </h2>`
      )}`
    }

    renderSubHeader(_data: D, _config: C) {
      return nothing
    }


    renderFooter(_data: D, _config: C) {
      return nothing
    }

    renderForm(_data: D, _config: C) {
      return html`Form`
    }
    renderFormNew(data: D, _config: C) {
      return html`
      <div class="layout vertical  wrap">
				${this.renderFieldUpdate('name', undefined, data)}
				${this.renderFieldUpdate('title', undefined, data)}
			</div>`
    }
    renderFieldUpdate(_name: string, _config: any, _data?: D): TemplateResult {
      return html``
    }
  };
  return R as unknown as Constructor<RenderInterface<D, A, C>> & typeof superclass;
}

function getFieldsFromModel(model: Model<any>, renderConfig: RenderConfig,  getConfig: (m: ModelComponent) => ModelComponent['grid'] | ModelComponent['table'] | undefined): [string, ModelComponent][] {
  function getFields(model: Model<any>, path: string = ''): [string, ModelComponent][] {
    const fields: [string, ModelComponent][] = [];

    for (const key in model) {
      const component = model[key];
      const p = path ? `${path}.${key}` : key
      const config = getConfig(component)
      if (config) {
        if (config?.condition && !config.condition(renderConfig)) {
          continue;
        }
        fields.push([p, component]);
      }
      else if (typeof component === 'object') {
        fields.push(...getFields(component as Model<any>, p));
      }
      else if (typeof component === 'object') {
        fields.push(...getFields(component as Model<any>, p));
      }
    }

    return fields;
  }
  return getFields(model)
}