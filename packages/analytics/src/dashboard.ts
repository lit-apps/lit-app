import { BuildResultLocaleI } from '@lit-app/app-survey/src/entity/BuildM.js';
import { PageDrawerBase } from '@lit-app/base';
import { ellipsis } from '@lit-app/shared';
import watch from '@lit-app/shared/decorator/watch.js';
import * as time from 'd3-time';
import { collection, getDocs, getFirestore, query } from 'firebase/firestore';
// @ts-expect-error - multi-verse is not typed
import('@preignition/multi-verse');

import { css, html, PropertyValues } from "lit";
import { customElement, property, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { styleMap } from 'lit/directives/style-map.js';



/**
 * TODO: 
 * - [ ] type for view: AnalyticsM
 * - [ ] implement caching of data
 * - [ ] keep track  latest submission to know if we need to refetch data
 */

type ViewT = any

const walkView = (form: BuildResultLocaleI['form']) => {
  const fieldMap = new Map();
  const pageMap = new Map();
  const pages: Record<string, any> = {};

  const walk = (node: any, parentKey?: string) => {
    const key = parentKey ? `${parentKey}.${node.id}` : node.id;
    if (node.type === 'page') {
      pageMap.set(key, node);
      pages[key] = { ...node, items: [] };
    }
    if (node.type === 'field') {
      fieldMap.set(key, node);
      if (parentKey) {
        const parentPage = pages[parentKey];
        if (parentPage) {
          parentPage.items.push(node);
        }
      }
    }
    if (node.items) {
      node.items.forEach((child: any) => walk(child, node.type === 'page' ? key : parentKey));
    }
  };

  if (form.items) {
    form.items.forEach(node => walk(node));
  }

  Object.keys(pages).forEach(key => {
    if (pages[key].items.length === 0) {
      delete pages[key];
    }
  });

  return { fieldMap, pageMap, pages };
};

const getWidgetStyle = (field: any) => ((field.layout && field.layout.setPosition) ? {
  'grid-column': `${field.layout.colStart || ''} / ${field.layout.colEnd || ''}`,
  'grid-row': `${field.layout.rowStart || ''} / ${field.layout.rowEnd || ''}`
} : {});

@customElement('lapp-dashboard')
export class Dashboard extends PageDrawerBase {
  static override styles = [
    ...PageDrawerBase.styles,
    css`
    :host { display: block; overflow: hidden; }
    .panel { margin: var(--space-small); }
    .grid-container { display: grid; grid-template-columns: repeat(3, 1fr); grid-gap: var(--space-x-small); grid-auto-rows: 233px; }
    .widget { margin-top: var(--space-x-small); }
  `];

  @property({ attribute: false })
  build?: BuildResultLocaleI;


  @property({ attribute: false })
  view?: ViewT;

  @state()
  private pages: Record<string, any> = {};

  @state()
  private selectedPageKey?: string;

  @state()
  private data: any[] = [];

  @state()
  private errors: string[] = [];


  @state()
  private filters: string[] = [];

  get surveyId() {
    return this.build?.survey.$id || '';
  }

  get formId() {
    return this.build?.form.$id || '';
  }

  get isReady() {
    return this.build && this.view && this.data !== undefined;
  }

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
    this.headerTitle = this.build.survey.name;
    this.headerSubtitle = this.build.survey.shortDesc || '';
  }


  // override renderDrawerContent() {
  //   return html`<div>
  //     <h2>Menu</h2>
  //     </div>`;
  // }


  override renderContent() {
    return html`
      <multi-verse 
        .data=${this.data} 
        .columns=${{ $index: '$index' }} 
        @multi-filtered-changed=${e => this.filteredCount = e.detail.value?.length} 
        @universe-changed=${e => this.universe = e.detail.value}>
        <lapp-expansion-panel class="panel grid-columns-${this.view && this.view.layout.column}" id="meta" .opened=${this.headerOpened} @opened-changed=${e => this.headerOpened = e.detail.value}>
          <h4 slot="header">Meta Fields</h4>
          <div class="grid-container">
            <lapp-widget-container class="widget padded" id="detail" inverted no-transform header="Details">
             <div>
               <table>
                 <tbody>
                   <tr>
                     <td class="title">Survey</td>
                     <td class="value"><code>${ellipsis(this.view?.source?.title, 25)}</code></td>
                    </tr>
                    <tr>
                      <td class="title">Form</td>
                      <td class="value"><code>${ellipsis(this.view && this.view.locale.title, 25)}</code></td>
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
            ${repeat((this.view.metaFields || []).filter(field => field.hidden !== true), (field) => field._key, (field, index) => html`
              <lapp-widget-container style="${styleMap(getWidgetStyle(field))}" class="widget" .header="${field.locale.title}" >
                <md-filled-tonal-icon-button slot="action" class="info toggle"  title=${field.locale.description} aria-label=${field.locale.description}>
                  <lapp-icon>info</lapp-icon>
                </md-filled-tonal-icon-button>
                ${this.renderQuestionItem(field, index)}
              </lapp-widget-container>
               `)}
             ${repeat((this.pinnedFields || []).map(key => this.fieldMap.get(key)), (field) => field._key, (field, index) => html`
              <lapp-widget-container style="${styleMap(getWidgetStyle(field))}" class="widget" .header="${field.locale.title}">
                <lapp-icon-button-star
                  slot="action"
                  @click=${e => this._onUnpin(field, index)}
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

        ${this.pages && this.selectedPageKey ? (this.pages[this.selectedPageKey].items || []).filter(section => section.hidden !== true).map(section => html`
            <lapp-expansion-panel class="panel grid-columns-${this.view && this.view.layout.column}" id="main" opened>
              <h4 slot="header">${section.locale.title || 'missing title'}</h4>
              <div class="grid-container">
                 ${this.renderRepeatField((section.items || []))}
              </div>
            </lapp-expansion-panel>
          `) : ''
      }

      </multi-verse>
    `;
  }

  renderRepeatField(fields: any[] = []) {
    return repeat(
      fields,
      field => field.id,
      field => html`
        <div class="widget" style=${styleMap(getWidgetStyle(field))}>
          <div>${field.locale?.heading || field.id}</div>
          <!-- Render question item here -->
        </div>
      `
    );
  }

  override willUpdate(props: PropertyValues<this>) {
    if (props.has('build') && this.build) {
      const { pages } = walkView(this.build.form);
      this.pages = pages;
      this.selectedPageKey = Object.keys(pages)[0];
      this._fetchData();
    }
    super.willUpdate(props);
  }

  private async _fetchData() {
    if (!this.build) return;
    // this.ready = false;
    const { databaseId } = this.build;
    if (databaseId) {
      const q = query(collection(getFirestore(databaseId), `survey/${this.surveyId}/raw`));
      const snap = await getDocs(q);
      this.data = snap.docs.map((doc, i) => {
        const data = doc.data();
        data.$id = doc.id;
        data.$index = i;
        data.$day = time.timeDay(data.metaData?.timestamp);
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
}

declare global {
  interface HTMLElementTagNameMap {
    'lapp-dashboard': Dashboard;
  }
}
