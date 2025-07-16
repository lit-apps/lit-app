import { activeItemChanged } from '@lit-app/shared/grid';
import { ensure } from '@lit-app/shared/types.js';
import { get } from '@preignition/preignition-util/src/deep';
import { ContextMenuLitRenderer, contextMenuRenderer } from '@vaadin/context-menu/lit.js';
import '@vaadin/context-menu/vaadin-context-menu.js';
import {
  columnBodyRenderer,
  columnHeaderRenderer,
  gridRowDetailsRenderer
} from '@vaadin/grid/lit';
import type { Grid } from '@vaadin/grid/vaadin-grid.js';
import { html, nothing, TemplateResult } from 'lit';
import { join } from 'lit/directives/join.js';

import('@vaadin/grid/all-imports.js');

import { choose } from 'lit/directives/choose.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { repeat } from 'lit/directives/repeat.js';
import { html as htmlStatic, literal } from 'lit/static-html.js';
import AbstractEntity from './AbstractEntity';
import { Collection, CollectionI, EntityElementList, RenderConfig } from './types';
import {
  GridConfig,
  Model,
  ModelComponent,
  ModelComponentSelect
} from './types/modelComponent';


import { RenderInterface, StaticRenderEntity } from './types/renderEntityI';
export type { RenderInterface } from './types/renderEntityI';

import { Parser } from '@json2csv/plainjs';
import { ActionKeyT, ActionsT, FilterActionKeyT, MenuConfigT } from './types/actionTypes.js';
import { DefaultI } from './types/entity';

type Constructor<T = {}> = new (...args: any[]) => T;
type Open = (entityName: string, id: string) => void

/**
 * Mixin in charge of the overall rendering of an entity
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
export default function renderMixin<
  D extends DefaultI,
  C extends RenderConfig = RenderConfig
>(
  superclass: Constructor<AbstractEntity & {
    open: Open
    filterActions: (
      key: FilterActionKeyT, data: unknown
    ) => ([string, number | MenuConfigT<any>])[]
    actionHandler: (
      actionName: ActionKeyT<ActionsT, unknown>,
      data: unknown,
      isBulk?: boolean
    ) => (e: CustomEvent) => void

  }>,
) {
  class R extends superclass {
    // class R extends superclass implements RenderInterfaceImpl<D, C> {

    showMetaData: boolean = false
    itemIdPath: string = '$id' // collectionGroup will need to use $path

    protected onActiveItemChanged(e: CustomEvent) {
      activeItemChanged(e)
    }

    // protected getEntityData(data: D | Collection<D>, config: C): unknown {
    //   return data;
    // }

    getContextActions(
      item: D,
      config: C): TemplateResult {

      const actions = this.filterActions('showInContextMenu', item);
      const groupedActions = actions.reduce((acc, [key, config]) => {
        const group = (config as MenuConfigT<any> & { disabled?: boolean }).group || 'default';
        acc[group] = acc[group] || [];
        acc[group].push([key, config as MenuConfigT<any>]);
        return acc;
      }, {} as Record<string, [string, MenuConfigT<unknown>][]>);

      const actionItems = Object.entries(groupedActions).map(([group, groupActions]) => {
        const groupActionsItems = groupActions.map(([key, config]) => {
          let disabled = false;
          if (this.actions[key].disabled !== undefined) {
            disabled = this.actions[key].disabled(item)
          }
          return html`<md-list-item
            type="button"
            ?disabled=${disabled}
            @click=${this.actionHandler(key, item)}>
            ${config.label}
            <lapp-icon slot="start" icon="${config.icon || ''}"></lapp-icon>
          </md-list-item>`;
        });
        return groupActionsItems

      });
      return html`${join(
        actionItems.filter(group => group.length > 0),
        html`<md-divider></md-divider>`
      )}`
    }



    renderContextMenu(data: Collection<D>, config: C): ContextMenuLitRenderer {
      return (context, _menu) => {
        const { sourceEvent } = context.detail as { sourceEvent: Event };
        const grid = (sourceEvent.currentTarget as Element)?.firstElementChild as Grid<D>;
        const eventContext = grid?.getEventContext(sourceEvent) || {};
        const { item } = eventContext;
        if (!item) {
          return;
        }

        // const parentItem = this.getCache(item)?.parentItem;
        // TODO: 'en' should be the language
        const title = this.renderTitle(item, config);
        const icon = this.icon || this.host.icon;
        return html`
          <md-list style="max-width:200px;">       
            <md-list-item > 
              <span slot="headline">${title}</span>
              <lapp-icon slot="start" .icon=${icon}></lapp-icon>
            </md-list-item>
            <md-divider></md-divider>
            ${this.getContextActions(item, config)}
          </md-list>
        `;
      };
    }

    getDDconfig(config: C) {
      return config?.gridConfig?.dd;
    }
    renderGrid(data: Collection<D>, config: C) {
      // bring selection up to host 
      const onSelected = async (e: CustomEvent) => {
        (this.host as EntityElementList).selectedItems = [...(e.target as Grid).selectedItems];
      }
      const onSizeChanged = async (e: CustomEvent) => {
        await this.host.updateComplete;
        (this.host as EntityElementList).size = e.detail.value;
      }
      const renderMenu = this.renderContextMenu(data, config);

      const onActiveItemChanged = (e: CustomEvent) => {
        this.onActiveItemChanged(e);
      }
      const onContextMenu = (e: MouseEvent) => {
        // Prevent opening context menu on header row.
        if ((e.currentTarget as Grid).getEventContext(e).section === 'header') {
          e.stopPropagation();
        }
      }

      const ddConfig = this.getDDconfig(config)
      // console.log('renderGrid', this.entityName, ddConfig?.dropMode);
      const doc = this.constructor.documentationKeys?.grid
      // const dataProvider = this.getDataProvider(data, config)
      const grid = html`<vaadin-grid 
        accessible-name="grid for ${this.entityName}"
        id="grid"
        data-documentation="${doc ? (typeof doc === 'string' ? doc : 'grid') : nothing}"
        class="flex entity grid ${this.entityName}"
        .itemIdPath=${this.itemIdPath}
        .items=${data}
        ${gridRowDetailsRenderer(
        (data: CollectionI<D>,
          model: any,
          grid: any) => this.renderGridDetail(data, config, model, grid),
        [this])}
        @vaadin-contextmenu=${onContextMenu}
        @active-item-changed=${config?.gridConfig?.preventDetails ? null : onActiveItemChanged}
        @dblclick=${config?.gridConfig?.preventDblClick ? null : this.onGridDblClick.bind(this)}
        @selected-items-changed=${onSelected}
        @size-changed=${onSizeChanged}

        .dropMode=${ddConfig?.dropMode || nothing}
        .rowsDraggable=${ddConfig?.rowsDraggable || false}
        .dragFilter=${ddConfig?.dragFilter || nothing}
        .dropFilter=${ddConfig?.dropFilter || nothing}
        @grid-dragend=${ddConfig?.dragEnd || nothing}
        @grid-dragstart=${ddConfig?.dragStart || nothing}
        @grid-drop=${ddConfig?.drop || nothing}
        >
        <slot name="grid-column-leading"></slot>
        ${this.renderGridColumns(config)}
        <slot name="grid-empty-state" slot="empty-state">
          ${this.renderGridEmptyState(config)}
        </slot>
        <slot name="grid-column"></slot>
      </vaadin-grid>`

      // TODO: review if we should have a other authorization type (canViewContextMenu or similar) ?
      return config.authorization?.canEdit && renderMenu ?
        html`<vaadin-context-menu  style="display: contents;" ${contextMenuRenderer(renderMenu, [])}
              >${grid}</vaadin-context-menu>` :
        grid;
    }

    // protected getDataProvider(_data: Collection<D>, _config: C) {
    //   return undefined
    // }

    protected onGridDblClick(e: CustomEvent): void {
      const context = (e.currentTarget as Grid).getEventContext(e);
      // by default, open the item
      if (context.item) {
        this.open(context.item.$id, this.entityName)
      }
    }


    renderGridDetail(data: CollectionI<D>, config: C, _model: any, _grid: any) {
      return html`
			<div class="layout vertical">
        ${this.renderTable(data, config)}
			</div>`
    }


    protected canRender(data: D, config: C) {
      const consumingMode = this.host.consumingMode || 'edit';
      return consumingMode === 'print' || consumingMode === 'offline' || data !== undefined;
    }

    renderMetaData(_data: D, _config: C) {
      return html`<meta-data></meta-data>`
    }

    renderBody(data: D, config: C) {
      if (!this.canRender(data, config)) {
        return this.renderDataLoading(config)
      }
      if (Array.isArray(data)) {
        return this.renderArrayContent(data, config)
      }
      return this.renderContent(data, config)
    }

    renderDataLoading(_config: C) {
      return html`Loading...`
    }

    override renderContent(data: D, config: C) {
      if (config?.variant === 'card') {
        return this.renderCardItem(data, config)
      }
      return html`
			<div class="layout vertical" id="entityContent">							
				${[this.showMetaData ? this.renderMetaData(data, config) : html``,
        super.renderContent(data, config),
        html`<form id="entityForm">
              ${config?.entityStatus.isNew ?
            this.renderFormNew(data, config) :
            this.renderForm(data, config)}
            </form>`
        ]}
			</div>`
    }

    private renderArrayContent(data: Collection<D>, config: C): TemplateResult {
      if (config?.variant === 'card') {
        if (data && data.length === 0) {
          return this.renderEmptyArray(config);
        }
        return this.renderCard(data, config)
      }
      if (config?.variant === 'list') {
        if (data && data.length === 0) {
          return this.renderEmptyArray(config);
        }
        return this.renderList(data, config)
      }
      return this.renderGrid(data, config)
    }

    renderCard(data: Collection<D>, config: C) {
      const layout = config?.layout || 'horizontal'
      const gridMap = (d: D, index: number) => this.renderCardItem(d, config, index)
      const map = (d: D, index: number) => html`<div class="flex flex-1">${gridMap(d, index)}</div>`
      return html`<div class="entity card layout ${layout} ${this.entityName} wrap">
			${repeat(data, (d: CollectionI<D>) => d.$id, layout.indexOf('grid') > -1 ? gridMap : map)}
      
    </div>`
    }

    renderCardItem(_data: D, _config: C, _index?: number) {
      return nothing as any
    }

    renderList(data: Collection<D>, config: C) {
      if (data.length === 0) {
        return this.renderEmptyArray(config)
      }
      return html`
      <md-list class="entity list ${this.entityName}" id="entityList">
				${repeat(data, (d: CollectionI<D>) => d.$id, (d: CollectionI<D>, index: number) => this.renderListItem(d, config, index))}
			</md-list>`


    }

    renderListItem(_data: D, _config: C, _index?: number) {
      return html`<md-list-item></md-list-item>`
    }

    renderEmptyArray(_config?: C) {
      return nothing as any
    }

    renderGridEmptyState(config: C) {
      return html`<div >No ${config?.heading || this.entityName} found</div>`
    }

    renderTitle(_data: D, config: C) {
      return html`${config.heading || this.entityName}`
    }
    renderNoDataTitle(config: C) {
      return html`No Data`
    }
    renderArrayTitle(_data: Collection<D>, config: C) {
      return html`${config.heading || this.entityName}`
    }

    renderHeader(data: D | Collection<D>, config: C) {
      const title = config.dataIsArray ?
        this.renderArrayTitle(data as Collection<D>, config) :
        this.renderTitle(data as D, config)
      if (!title) {
        return nothing as any
      }
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
      return nothing as any
    }


    renderFooter(_data: D, _config: C) {
      return nothing as any
    }

    renderForm(_data: D, _config: C) {
      return nothing as any
    }

    renderFormNew(data: D, _config: C) {
      return html`
      <div class="layout vertical  wrap">
				${this.renderFieldUpdate('name', undefined, data)}
				${this.renderFieldUpdate('title', undefined, data)}
			</div>`
    }
    renderFieldUpdate(_name: string, _config: any, _data?: D) {
      return nothing as any
    }

    protected getCsvParser(renderConfig: C | undefined) {
      return this.constructor.getCsvParser(renderConfig)
    }
    renderGridColumns(config: C) {
      return this.constructor.renderGridColumns(config)

    }

    renderTable(data: CollectionI<D>, config: C, tableFields?: [string, ModelComponent][]) {
      return this.constructor.renderTable(data, config, tableFields)
    }

    getDefaultData(): Partial<D> {
      return this.constructor.getDefaultData()
    }

  };


  const staticApply: StaticRenderEntity<D, C> = {

    getCsvParser(this: AbstractEntity, renderConfig: C | undefined) {
      const fields = getFieldsFromModel(this.model, renderConfig, (model) => model.csv)
        .sort((a, b) => (a[1].csv?.index || 0) - (b[1].csv?.index || 0))
        .map(([key, m]) => {
          const csv = ensure(m.csv)
          return {
            label: csv.label || m.label as string || key,
            value: csv.value || key,
            default: csv.default,
          }
        })
      return new Parser({ fields });
    },

    renderGridColumns(this: AbstractEntity, config: C) {
      const showSelectionColumn = config.columnsConfig?.showSelectionColumn;
      const model = this.model;
      const colTag = literal`vaadin-grid-column`
      const colSortTag = literal`vaadin-grid-sort-column`

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
    },

    renderTable(this: AbstractEntity, data: CollectionI<D>, config: C, tableFields?: [string, ModelComponent][]) {
      const model = this.model;
      // get the fields to render in table
      const fields = tableFields || getFieldsFromModel(model, config, (model) => model.table)
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
    },

    getDefaultData(this: AbstractEntity): Partial<D> {
      return {}
    }
  }
  Object.assign(R, staticApply);
  return R as unknown as Constructor<RenderInterface<D, C>> & typeof superclass;
}

export function getFieldsFromModel(
  model: Model<any>,
  renderConfig: RenderConfig | undefined,
  getConfig: (m: ModelComponent) => ModelComponent['grid'] | ModelComponent['csv'] | ModelComponent['table'] | ModelComponent | undefined
): [string, ModelComponent][] {
  function getFields(model: Model<any>, path: string = ''): [string, ModelComponent][] {
    const fields: [string, ModelComponent][] = [];

    for (const key in model) {
      const component = model[key];
      if (!component || key.startsWith('_') || Array.isArray(component)) {
        continue
      }
      const p = path ? `${path}.${key}` : key
      const config = getConfig(component) as ModelComponent['grid']
      if (config) {
        if (config?.condition && !config.condition(renderConfig)) {
          continue;
        }
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

