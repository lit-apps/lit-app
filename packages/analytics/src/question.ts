import { showHover } from '@lit-app/shared/styles/index.js';
import { ConsumeUniverse } from '@preignition/multi-verse/src/mixin/context-universe-mixin.js';
import '@preignition/preignition-analytics/src/widget/pan-data-table.js';
import { css, html, LitElement, nothing, PropertyValues } from "lit";
import { customElement, property, query, state } from 'lit/decorators.js';
import { CharTypeT, getChartType, QuestionFieldT } from "./analytics-config.js";
import './chart.js';
import type { lappAnalyticsChart } from './chart.js';
import { ConsumeViewMixin } from './context-view-mixin.js';

type TabT = 'raw' | 'chart' | 'settings';
type FilterT = string | { label: string, value: string }[];


const styles = css`
    :host {
       display: flex;
      flex-direction: column;
    }
    .container {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: auto;
    }
    .flex {
      flex: 1;
    }

    .tabs {
      color: var(--color-secondary-text);
      font-size: var(--font-size-x-small);
      display: flex;
      // margin-bottom: var(--space-xx-small);
    }

    .tab {
      flex: 1;
      border-top: 3px solid transparent;
      border-bottom: 3px solid transparent;
      text-align: center;
      cursor: pointer;
    }

    .tab.settings  {
      flex: none;
      width: 40px;
    }
  
    .tab.settings lapp-icon,
    .tab.filter lapp-icon {
      width: var(--font-size-small);
      height: var(--font-size-small);
    }
  
    .tab.filter {
     flex: 2;
     height: 13px;
     z-index: 1;
     color: var(--color-accent);
     border-top: 3px solid var(--color-accent);
     text-align: right;
    }

    .tab-icon {
      vertical-align: middle;
    }

    .tab:hover {
      background: var(--color-surface-container-high);
    }

    .tab[active] {
      border-top: 3px solid var(--color-primary);
    }

    .footer {
      padding: var(--space-x-small);
      transform-origin: right;
      transform: scale(0.9);
      text-align: right;
    }

    #chart {
       /* margin: var(--space-medium) var(--space-small); */
       flex: 1;
    }
`
/**
 *  
 */

@customElement('lapp-analytics-question')
export class lappAnalyticsQuestion extends
  ConsumeUniverse(
    ConsumeViewMixin(LitElement)) {

  static override styles = [showHover, styles];

  @property({ attribute: false }) field!: QuestionFieldT;
  @property() chartType?: CharTypeT | null = null;

  @state() selectedTab: TabT = 'chart';
  @state() filter: FilterT[] | null = null;

  // TODO: selected should be a context
  @state() selected: string | null = null;
  @state() selectedValues: string[] = [];


  @query('#tabs') tabs!: HTMLElement;
  @query('#chart') chart!: lappAnalyticsChart;
  @query('.tab') tab!: HTMLElement;

  get _chartType() {
    return this.chartType || getChartType(this.field);
  }

  override firstUpdated(props: PropertyValues<this>) {
    super.firstUpdated(props);
    if (this._chartType === 'table') {
      this.selectedTab = 'raw';
    }
  }

  override render() {
    const type = this._chartType;

    return html`
      ${type ? this.renderTabs(type) : nothing}
      <div class="container">
        ${this.selectedTab === 'raw' ? this.renderRaw() :
        this.selectedTab === 'chart' ? this.renderChart(type) :
          nothing}
      </div>
      ${this.selectedTab === 'raw' ? html`
      <div class="footer" show-hover>
       <md-outlined-button dense  @click=${this.seeAll}>See All</md-outlined-button>
       <md-outlined-button dense  @click=${this.seeFiltered}>See Filtered</md-outlined-button>
     </div>` : nothing}`;
  }

  private renderChart(chartType: CharTypeT) {
    if (!chartType) {
      return html`<div>Chart Not build for this type of question (${this.field.data.subType})</div>`;
    }

    return html`
         <lapp-analytics-chart 
           id="chart"
           .field=${this.field} 
           .selected=${this.selected}
           .selectedValues=${this.selectedValues}
           .chartType=${chartType}
            @filter-changed=${this._onFilter}></lapp-analytics-chart>
        `;
  }

  private renderRaw() {
    const maxRows = this.view?.config?.chart?.table?.maxRows || 20;
    return html`
       <div class="flex">
           <pan-data-table 
             .data=${this.universe && this.universe.data}
             .maxRows=${maxRows}
             .key="${this.field.groupBy}" 
             .specify=${this.field.hasSpecify}></pan-data-table>

       </div>
       `
      ;
  }

  private renderTabs(type: CharTypeT) {
    const select = (name: TabT) => () => {
      this.selectedTab = name;
    }
    return html`
      <div class="tabs" id="tabs">
        ${type !== 'table' ? html`<div ?active="${this.selectedTab === 'chart'}" @click=${select('chart')} class="tab"><span show-hover>Chart</span></div>` : ''}
        <div ?active="${this.selectedTab === 'raw'}" @click=${select('raw')} class="tab"><span show-hover>Raw</span></div>
        <div ?active="${this.selectedTab === 'settings'}" @click=${() => this.dispatchEvent(new CustomEvent('pan-edit-settings', { detail: this.field, bubbles: true, composed: true }))} class="tab settings"><lapp-icon show-hover class="tab-icon">settings</lapp-icon></div>
        ${this.filter ? this.renderFilter() : ''}
      </div>
      `;
  }

  private renderFilter() {
    const filter = html`<div class="tab filter">${this.filter}<lapp-icon class="tab-icon" title="clear filter" @click=${this.clearFilter}>close</lapp-icon></div>`;
    if (Array.isArray(this.filter)) {
      if (this.filter.length) {
        return filter;
      }
      return '';
    }
    return filter;
  }

  reset() {
    if (this.chart) {
      this.chart.requestUpdate();
    } else {
      this.tab.click()
    }
  }

  clearFilter() {
    this.chart?.clearFilter();
  }

  seeAll() {
    this.dispatchEvent(new CustomEvent('pan-data-overlay', {
      detail: {
        type: 'all',
        field: this.field,
        key: this.field.groupBy
      }, bubbles: true, composed: true
    }));
  }

  seeFiltered() {
    this.dispatchEvent(new CustomEvent('pan-data-overlay', {
      detail: {
        type: 'filtered',
        field: this.field,
        key: this.field.groupBy
      }, bubbles: true, composed: true
    }));
  }

  constructor() {
    super();
    this.addEventListener('filtered-changed', this._onFilter);
  }

  _onFilter(e: CustomEvent) {
    const { value, isMulti, isRange, selection } = e.detail;
    if (isMulti) {
      this.selectedValues = selection;
    } else {
      this.selected = selection;
    }
    if ((isMulti || isRange)) {
      if (value && value.length) {
        this.filter = value;
      } else {
        this.filter = null;
      }
    } else {
      this.filter = value;
    }

    // Note(cg): and we buble the event higher up
    e.detail.label = this.field.locale.label;
    e.detail.key = this.field.$id;
    e.detail.sectionKey = this.field.$parentId;
  }

}

declare global {
  interface HTMLElementTagNameMap {
    'lapp-analytics-question': lappAnalyticsQuestion;
  }
}
