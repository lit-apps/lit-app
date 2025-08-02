import { BuildResultLocaleI } from '@lit-app/app-survey/src/entity/BuildM.js';
import { PageDrawerBase } from '@lit-app/base';
import '@lit-app/cmp/container/expansion-panel.js';
import '@lit-app/cmp/container/widget-container';
import { ellipsis } from '@lit-app/shared';
import watch from '@lit-app/shared/decorator/watch.js';
import { typography } from '@lit-app/shared/styles';
import '@preignition/preignition-analytics/src/widget/pan-download-dialog.js';
import '@preignition/preignition-analytics/src/widget/pan-filter-chip.js';
// import '@preignition/preignition-analytics/src/widget/pan-survey-question-item.js';
import '@vaadin/grid/all-imports.js';
import * as time from 'd3-time';
import { collection, getDocs, getFirestore, query } from 'firebase/firestore';
import type { PropertyValues } from 'lit';
// @ts-expect-error - multi-verse is not typed
import('@preignition/multi-verse');


import { css, html, nothing } from "lit";
import { queryAll, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { styleMap } from 'lit/directives/style-map.js';
import './question.js';
import('@material/web/progress/linear-progress.js')
import('@material/web/iconbutton/filled-icon-button.js');
import('@material/web/icon/icon.js');
import('@material/web/button/filled-button.js');
import('@material/web/button/outlined-button.js');
import('@material/web/dialog/dialog.js');
import('@material/web/list/list-item.js');
import('@material/web/list/list.js');

import type { PageT, QuestionT, SectionT } from '@lit-app/app-survey/src/entity/types.recursive.js';
import { AllBuildEntitiesT } from '@lit-app/app-survey/src/entity/types.recursive.js';
import { IRoute } from 'router-slot';
import { QuestionFieldT } from './analytics-config.js';
import { ProvideBuildMixin } from './context-build-mixin.js';
import { ProvideViewMixin } from './context-view-mixin.js';
import { lappAnalyticsQuestion } from './question.js';
import { getItemsOfType } from './types.js';


/**
 * TODO: 
 * - [x] type for view: AnalyticsM
 * - [x] do we need to walk the view to get the fields?
 * - [ ] implement caching of data
 * - [ ] keep track  latest submission to know if we need to refetch data
 * - [x] add table view
 * - [x] implement see raw
 * - [x] add timestamp to dataset
 * - [ ] indications that behavior and settings not implemented yet
 * - [ ] implement download
 * - [ ] type event details
 * - [ ] add "specify" as a new chart
 * - [ ] restore edit settings (`pan-edit-settings` event)
 * - [ ] fix first paint on data table does not show data (reimport pan-data-table to lapp-analytics)
 * - [ ] table should display lookup values for categories
 * 
 * 
 * TODO Later: 
 * - [ ] context for filters
 * - [ ] context for selection (`selected` / `selectedValues`)
 * - [ ] context for data passing between group and charts
 */


const styles = css`
    :host {
      display: block;
      overflow: hidden;
    }
    
    mwc-drawer {
      position: relative;
    }

    .panel {
      margin: var(--space-small);
    }
  
    .panel::part(content) {
      padding: 0;
      background: var(--color-surface-container);
    }

    .panel h4 {
      margin: var(--space-small) 0;
    }
    
    .error {
      padding: var(--space-small);
      color: var(--color-error);
    }

    .grid-container {
      padding: var(--space-x-small);;
      display: grid;
      grid-flow: row dense;
      grid-template-columns: repeat(3, 1fr);
      grid-gap: var(--space-x-small);
      grid-auto-rows: 233px;
      /* grid-auto-rows: minmax(200px, auto); */
    }
    
    .grid-columns-1 .grid-container {
      grid-template-columns: repeat(1, 1fr);
    }
    .grid-columns-2 .grid-container {
      grid-template-columns: repeat(2, 1fr);
    }
    .grid-columns-3 .grid-container {
      grid-template-columns: repeat(3, 1fr);
    }
    .grid-columns-4 .grid-container {
      grid-template-columns: repeat(4, 1fr);
    }
    .grid-columns-5 .grid-container {
      grid-template-columns: repeat(5, 1fr);
    }

    .widget {
      margin-top: var(--space-x-small);
      --lapp-widget-container-container-color: var(--color-background);
    }
    .widget[inverted] {
      --lapp-widget-container-container-color: var(--color-primary);
      --lapp-widget-container-color: var(--color-on-primary);
    }
    #detail {
      grid-column: 1 / 1;
    }

    .widget.big {
    }

    .nested, .widget.full {
      grid-column: 1 / 4;
    }

    .nested > .grid-container {
    }

    .nested h5 {
      margin: var(--space-medium) -8px 0;
      background: var( --color-background);
      padding: var(--space-medium);
    }
  
    .widget.padded::part(grid-container) {
      padding: var(--space-x-small);
    }
    
    .question-item {
          height: 100%;
    }

    #detail {
    
    }

    #detail table {
      margin: var(--space-small);
      font-size: var(--font-size-small);
    }

    table .title {
        text-align: right;
        padding-right: var(--space-small);
        font-weight: var(--font-weight-semi-bold);
    }

    .widget-title {
      border-bottom: 1px solid;
      border-color: var(--color-secondary);
      margin-bottom: var(--space-x-small);
      margin-top: var(--space-x-small);
      text-transform: uppercase;
      font-weight: var(--font-weight-normal);
      font-weight: 400;
      font-size: var(--font-size-x-small);
      
    }
    
    .widget-title lapp-icon {
      vertical-align: bottom;
    }

    #dataDialog, #settingsDialog {
      min-width: 400px;
      max-width: 60vw;
    }


`

const walkView = (form: BuildResultLocaleI['form']) => {
  const fieldMap = new Map();
  const walk = <N extends AllBuildEntitiesT>(node: N, parentKey?: string) => {
    const key = parentKey ? `${parentKey}.${node.$id}` : node.$id;
    // if (node.type === 'page') {
    // }
    if (node.type === 'question') {
      fieldMap.set(key, node);

      if (parentKey) {
        (node as QuestionFieldT).$parentId = parentKey;
        (node as QuestionFieldT).groupBy = key;
      }
    }
    if ('data' in node && node.data && 'items' in node.data && node.data.items) {
      // only pass parent key if node is a section
      const key = node.type === 'section' ? (parentKey ? `${parentKey}.${node.$id}` : node.$id) : '';
      node.data.items.forEach((child: any) => walk(child, key));
    }
  };

  if (form.items) {
    form.items.forEach(node => walk(node));
  }

  // Object.keys(pages).forEach(key => {
  //   if (pages[key].items.length === 0) {
  //     delete pages[key];
  //   }
  // });

  return { fieldMap };
};

const getWidgetStyle = (field: any) => ((field.layout && field.layout.setPosition) ? {
  'grid-column': `${field.layout.colStart || ''} / ${field.layout.colEnd || ''}`,
  'grid-row': `${field.layout.rowStart || ''} / ${field.layout.rowEnd || ''}`
} : {});

const div = document.createElement('div');

export class Dashboard extends ProvideBuildMixin(
  ProvideViewMixin(
    PageDrawerBase)) {
  static override styles = [
    ...PageDrawerBase.styles,
    typography,
    styles
  ];

  // @property({ attribute: false })
  // build?: BuildResultLocaleI;


  // @property({ attribute: false })
  // view?: AnalyticsI;

  @state()
  private pages: Record<string, any> = {};

  // @state()
  // private selectedPageKey?: string;

  @state()
  private data: any[] = [];

  @state()
  private errors: string[] = [];

  @state()
  private filters: { key: string; label: string; value: any, selected: string }[] = [];

  @state()
  private filteredCount: number = 0;

  @state()
  private headerOpened: boolean = true;

  fieldMap = new Map<string, any>();

  @watch('build')
  @watch('view') onBuildOrViewChange() {
    if (!this.build || !this.view) return;
    // this.menu = (this.build.form.items as unknown as PageI[])
    this.menu = this.build.form.items
      .filter((item) => item.type === 'page')
      .map(item => ({
        id: item.$id,
        title: item.locale.heading || item.$id,
        // description: item.locale.description || '',
        // icon: item.locale.icon || 'view_list',
        // meta: item.locale.description || ''
      }));
    this.headerTitle = this.view.heading || '';
    this.headerSubtitle = this.view.shortDesc || '';

    const { fieldMap } = walkView(this.build.form);
    this.fieldMap = fieldMap;

    if (this.routerSlot) {
      this.routerSlot.add(this.routes, true);
    }
    this._fetchData();
  }

  @queryAll('lapp-analytics-question') questionItems!: lappAnalyticsQuestion[];

  get surveyId() {
    return this.build?.survey.$id || '';
  }

  get formId() {
    return this.build?.form.$id || '';
  }

  get isReady() {
    return this.build && this.view && this.data !== undefined;
  }

  get dataLength() {
    return this.data?.length || 0;
  }

  get pinnedFields() {
    return this.view?.pinnedFields || [];
  }

  get activePage() {
    return this.matchedRoute?.route.path || Object.keys(this.pages)[0];
  }
  get page(): PageT | null {
    return this.build?.form.items.find(item => item.$id === this.activePage) || null;
  }
  get routes(): IRoute[] {
    if (!this.build) return [];
    const routes: IRoute[] = this.build.form.items.map(page => ({
      path: page.$id,
      component: div,
    }));
    routes.push({
      redirectTo: this.build.form.items[0].$id,
      path: '**',
    });
    return routes;
  }

  constructor() {
    super();

    // this.downloadFormat = 'json';
    // this.downloadType = 'anonymized';

    // this.filters = [];

    this.addEventListener('pan-data-overlay', e => this._onDataOverlay(e));
    this.addEventListener('pan-clear-filter', e => this.clearFilter(e.detail.key));
    // this.addEventListener('pan-edit-settings', this.onEditSettings);
    this.addEventListener('filter-changed', e => this._onFilter(e));
  }
  _onDataOverlay(e: Event): void {
    console.warn('onDataOverlay not implemented', e);
  }


  override firstUpdated(props: PropertyValues<this>) {
    super.firstUpdated(props);
    if (this.build && this.routerSlot) {
      this.routerSlot.add(this.routes, true);
    }
  }


  override renderContent() {
    return html`
      ${super.renderContent()}
      <multi-verse 
        .data=${this.data} 
        .columns=${{ $index: '$index' }} 
        @multi-filtered-changed=${(e: CustomEvent) => this.filteredCount = e.detail.value?.length} 
        >
        <lapp-expansion-panel class="panel grid-columns-${this.view && this.view.layout.column}" id="meta" 
        .opened=${this.headerOpened} 
        @opened-changed=${(e: CustomEvent) => this.headerOpened = e.detail.value}>
          <h4 slot="header">Meta Fields</h4>
          <div class="grid-container">
            <lapp-widget-container class="widget padded" id="detail" inverted no-transform header="Details">
             <div>
               <table>
                 <tbody>
                   <tr>
                     <td class="title">Survey</td>
                     <td class="value"><code>${ellipsis(this.build?.survey.name || '', 25)}</code></td>
                    </tr>
                    <tr>
                      <td class="title">Form</td>
                      <td class="value"><code>${ellipsis(this.build?.form.locale.heading || '', 25)}</code></td>
                   </tr>
                   <tr>
                     <td class="title">Count (Filtered/Total)</td>
                     <td class="value"><code>${this.filteredCount} / ${this.dataLength}</code></td>
                   </tr>
                 </tbody>
               </table>
               ${this.filters.length ? html`
                 <h5 class="widget-title"><lapp-icon>filter_list</lapp-icon>Active filters</h5>
                 <div>
                   ${this.filters.map(f => html`<pan-filter-chip .key="${f.key}" .label="${Array.isArray(f.value) ? f.value.join(', ') : f.value}" .questionLabel="${f.label}"></pan-filter-chip>`)}
                 </div>
                 ` : ''}
             </div> 
            </lapp-widget-container>
            ${repeat((this.view?.metaFields || []).filter(field => field.hidden !== true), (field) => field._key, (field, index) => html`
              <lapp-widget-container style="${styleMap(getWidgetStyle(field))}" class="widget" .header="${field.locale.title}" >
                <vaadin-tooltip message="${field.locale.description || ''}" for="${field._key}"></vaadin-tooltip>
                <md-filled-tonal-icon-button slot="action" class="info toggle" id="${field._key}">
                  <lapp-icon>info</lapp-icon>
                </md-filled-tonal-icon-button>
                ${this.renderQuestionItem(field, index)}
              </lapp-widget-container>
               `)}
             ${repeat((this.pinnedFields || []).map(key => this.fieldMap.get(key)), (field) => field._key, (field, index) => html`
              <lapp-widget-container style="${styleMap(getWidgetStyle(field))}" class="widget" .header="${field.locale.title}">
                <lapp-icon-button-star
                  slot="action"
                  @click=${() => this._onUnpin(field, index)}
                  selected
                ></lapp-icon-button-star>
                 <md-filled-tonal-icon-button slot="action" class="info toggle" title=${field.locale.description} aria-label=${field.locale.description}>
                  <lapp-icon>info</lapp-icon>
                </md-filled-tonal-icon-button>
                ${this.renderQuestionItem(field, index)}
              </lapp-widget-container>
               `)}
          </div>
        </lapp-expansion-panel>

        ${this.page ? getItemsOfType<SectionT>(this.page, 'section')
        .filter(section => getItemsOfType<QuestionT>(section, 'question').length > 0)
        .map((section, index) => html`
            <lapp-expansion-panel class="panel grid-columns-${this.view?.layout.column || 3}" id="main" opened>
              <h4 slot="header">${section.name || `Section ${index + 1}`}</h4>
              <div class="grid-container">
                 ${this.renderRepeatField(getItemsOfType<QuestionT>(section, 'question'))}
              </div>
            </lapp-expansion-panel>
          `) : nothing
      }

      </multi-verse>
    `;
  }
  private renderQuestionItem(field: QuestionT, index: number) {
    const getItemSelection = (key: string) => {
      const sel = this.filters.find(f => f.key === key);
      return sel && sel.selected || null;
    };
    return html`
        <lapp-analytics-question 
          class="question-item"
          .index="${index}" 
          .field=${field}
          .selected=${getItemSelection(field.$id)}
          ></lapp-analytics-question>
      `;
  }
  renderRepeatField(fields: ReadonlyArray<QuestionFieldT> = []) {
    return repeat(
      fields,
      field => field.$id,
      (field, index) => {
        // return field.type === 'fieldContainer' ?
        //          html`
        //            <div class="nested">
        //              <h5>${field[this.language].title}</h5>
        //              <div class="grid-container">
        //              ${this.renderRepeatField(field.items)
        //            }
        //              </div>
        //            </div>
        //            ` :
        return html`
          <lapp-widget-container style="${styleMap(getWidgetStyle(field))}" 
            class="widget" 
            question header="${field.locale.label}" >
          <lapp-icon-button-star
            slot="action"
            @click=${() => this._onPin(field, index)}
            ></lapp-icon-button-star>
            ${this.renderQuestionItem(field, index)}
          </lapp-widget-container>
          `;
      }
    );
  }

  private async _fetchData() {
    if (!this.build) return;
    // this.ready = false;
    const { databaseId } = this.build;
    if (databaseId) {
      const q = query(collection(getFirestore(databaseId), `survey/${this.surveyId}/raw`));
      const snap = await getDocs(q);
      const now = new Date();
      this.data = snap.docs.map((doc, i) => {
        const data = doc.data();
        const ts = data.metaData?.timestamp;
        const day = ts ? time.timeDay(ts.toDate()) : time.timeDay(now);
        data.$id = doc.id;
        data.$index = i;
        data.$day = day;
        return data;
      });
      this.errors = [];
      if (!this.data.length) {
        this.errors.push('No data collected for this survey yet.');
      }
      // this.ready = true;
    } else {
      this.errors = ['Missing databaseId to fetch data'];
    }
  }

  private _activatePin(pinned: string[]) {
    Object.assign(this.view!, { pinnedFields: pinned });
    this.requestUpdate();
  }
  private _onPin(field: QuestionFieldT, index: number) {
    const pinned = (this.view?.pinnedFields || []).concat(field.$id);
    this._activatePin(pinned);
  }

  private _onUnpin(field: QuestionFieldT, index: number) {
    const pinned = this.pinnedFields.filter((key) => key !== field.$id);
    this._activatePin(pinned);

  }
  _onFilter(e: CustomEvent) {
    const { value, key } = e.detail;
    const filters = this.filters.filter(item => item.key !== key);
    if (Array.isArray(value)) {
      if (value.length) {
        filters.push(e.detail);
      }
    } else if (value) {
      filters.push(e.detail);
    }
    this.filters = filters;
  }

  /**
   * clear filters for all widget
   * @return {[type]} [description]
   */
  clearExistingFilters() {
    [...this.questionItems]
      .forEach(el => {
        el.selected = null;
      });
  }

  clearFilter(key: string) {
    if (key) {
      [...this.questionItems]
        .filter(el => el.field.$id === key)
        .forEach(el => el.clearFilter());
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lapp-analytics': Dashboard;
  }
}


