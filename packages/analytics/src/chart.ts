import { OptionT } from '@lit-app/app-survey/src/entity/types.recursive.js';
import { ellipsis } from '@lit-app/shared';
import { get } from '@lit-app/shared/dataUtils/index.js';
import { ConsumeUniverse } from "@preignition/multi-verse/src/mixin/context-universe-mixin.js";
import { css, html, LitElement, nothing, PropertyValues } from "lit";
import { customElement, property, query, state } from 'lit/decorators.js';
import { CharTypeT, getAnalyticsConfig, getDataType, hasLookup, QuestionFieldT } from "./analytics-config.js";
// @ts-expect-error - not typed
import { wrap } from '@preignition/multi-chart';
import '@preignition/preignition-analytics/src/widget/chart/pan-choropleth-map.js';
import { ascending, extent } from 'd3-array';
import * as format from 'd3-format';
import { scaleOrdinal } from 'd3-scale';
import * as time from 'd3-time';
import * as timeFormat from 'd3-time-format';
import { ConsumeBuildMixin } from "./context-build-mixin.js";
import { ConsumeViewMixin } from "./context-view-mixin.js";
import { getItemsOfType } from './types.js';

const missingKey = '___';

const fl = (val: string, groupValue = 10, defaultValue: string) =>
(val === undefined ? (defaultValue || Infinity) : Math.floor(Number(val) / groupValue) * groupValue);
const _groupByBoolean = (path: string, defaultValue = 'missing') => {
  return (d: any) => {
    const v = get(path as "", d);
    return (v === undefined ? defaultValue : v) + '';
  };
};
const _groupBy = (path: string, groupValue: number, defaultValue: string) => {
  return (d: any) => fl(get(path as "", d), groupValue, defaultValue);
};

type DataT = { key: string, values: any };
/**
 *  
 */

@customElement('lapp-analytics-chart')
export class lappAnalyticsChart extends
  ConsumeBuildMixin(
    ConsumeViewMixin(
      ConsumeUniverse(LitElement))) {

  static override styles = css`
  host {
      display: block;
      height: 100%;
   } `;

  @property({ attribute: false }) field!: QuestionFieldT;
  @property() chartType!: CharTypeT;

  @state() scale: any
  @state() data!: DataT[]
  @state() _groupKeys!: string[]
  @state() options!: ReadonlyArray<OptionT>;
  @state() labels!: string[];

  // TODO: selected should be a context
  @state() selected: string | null = null;
  @state() selectedValues: string[] = [];

  @query('#group') group!: HTMLElement;
  @query('#chart') chart!: LitElement & {
    clearSelection?: () => void;
    selected?: any;
    selectedValues?: string[];
  };

  get defaultValue() {
    // TODO: check this
    return missingKey;
  }

  // get missingValue() {
  //   // TODO: check this
  //   return this.field?.missingValue || missingKey;
  // }

  get analyticsConfig() {
    return getAnalyticsConfig(this.field)
  }

  getConfig(type: CharTypeT, name: string, dataType: string) {
    const config = this.view.config
    const chartConfig = (config.chart[type as keyof typeof config.chart]) || {}
    const dataTypeConfig = config.dataType[dataType as keyof typeof config.dataType] || {};
    return ({ ...{}, ...config.generic, ...chartConfig, ...dataTypeConfig } as any)[name];
  }


  get dataType() {
    return getDataType(this.field);
  }

  get isTime() {
    return this.dataType === 'date';
  }

  constructor() {
    super();
    this._groupKeys = [];
    this.addEventListener('multi-select', this._onMultiSelect);
  }

  override willUpdate(props: PropertyValues<this>) {
    super.willUpdate(props);
    if (props.has('_groupKeys') || props.has('field')) {
      this.computeLabels(this._groupKeys, this.field);
    }
  }

  private computeLabels(groupKeys: string[], field: QuestionFieldT) {
    // Compute labels based on scale and field
    if (!groupKeys || !field || !hasLookup(field)) return
    const options = getItemsOfType<OptionT>(field, 'option');
    const domainKeys = groupKeys;

    // add option to the domainKeys if not already present
    options.forEach(option => {
      if (!domainKeys.includes(option.$id)) {
        domainKeys.push(option.$id);
      }
    });

    this.options = options

    // reset the domain of the scale as it might have changed
    this.scale?.domain(domainKeys);
    this.labels = domainKeys.map((key: string) => {
      if (key === missingKey) {
        return 'blank';
      }
      const option = options.find(opt => opt.$id === key);
      if (!option) return 'old (deleted) key';
      return ellipsis(option?.locale.label || key);
    });

    // TODO: check if this is needed
    // this.dispatchEvent(new CustomEvent('multi-refresh', {detail: {}, bubbles: true, composed: true}));
  }

  override render() {
    if (!this.field) {
      return nothing;
    }
    const { chartType, dataType } = this;
    const groupValue = this.getConfig(chartType, 'groupValue', dataType) || 10;
    const groupBy = dataType === 'number' ?
      _groupBy(this.field.groupBy, groupValue, this.defaultValue) : dataType === 'boolean' ?
        _groupByBoolean(this.field.groupBy, this.defaultValue) : this.field.groupBy;

    return html`
     <multi-group 
       id="group"
       .groupBy=${groupBy}
       .isArray=${dataType === 'categories'}
       @keys-changed=${(e: CustomEvent) => this._groupKeys = e.detail.value}
       @data-changed=${(e: CustomEvent) => this.data = e.detail.value}
       .missingValue="${this.defaultValue || missingKey}" >
         <d3-scale scale-type="ordinal" 
           @scale-changed=${(e: CustomEvent) => this.scale = e.detail.value}
           .domain="${this._groupKeys}"></d3-scale>
          ${chartType === 'pie' ? this.renderPie() :
        chartType === 'map' ? this.renderMap() :
          chartType === 'bar' ? this.renderBar() :
            chartType === 'histogram' ? this.renderHistogram(groupValue) :
              chartType === 'timeseries' ? this.renderTimeseries() :
                html`<div>Chart type ${chartType} not yet implemented</div>`
      }
      </multi-group>
    `;
  }

  renderPie() {
    const type = this.dataType;
    const cfg = (name: string) => this.getConfig('pie', name, type);
    return html`
       <multi-verse-pie 
          id="chart"
          .data=${this.data}
          .colorScale=${this.scale && this.scale.range(cfg('colorRange'))}
          .selected="${this.selected}"
          .rightMargin="${cfg('rightMargin')}"
          .padAngle="${cfg('padAngle')}"
          .pieWidth="${cfg('pieWidth')}"
          .cornerRadius="${cfg('cornerRadius')}"
          y-axis-title="count" 
          track-hover>
          ${this.renderLegend()}
        </multi-verse-pie>`;
  }

  renderMap() {
    const type = this.dataType;
    const cfg = (name: string) => this.getConfig('map', name, type);
    return html`
      <pan-choropleth-map 
        id="chart"
        .field=${this.field}
        .data=${this.data}
        .selected="${this.selected}"
        .selectedValues="${this.selectedValues}"
        .colorRange=${cfg('colorRange')}
        ></pan-choropleth-map>
    `;
  }

  renderBar() {
    const type = this.dataType;
    const cfg = (name: string) => this.getConfig('bar', name, type);
    return html`
      <multi-verse-bar 
        .data=${this.data}
        .selected=${this.selected}
        id="chart"
        multi
        left-axis
        bottom-axis
        track-hover
        value-position="bottom"
        orientation="horizontal"
        .keyPosition="${'left'}"
        .sort=${this.sortAscending}
        .decorate=${this.decorateMissing}
        preserve-sort-order
        .colorScale=${scaleOrdinal().range(cfg('colorRange'))}  
        .leftPadding=${cfg('leftPadding')}
        .rightMargin=${cfg('rightMargin')}
        .leftMargin=${cfg('leftMargin')}
        .leftTickFormat=${(key: string) => key === missingKey ? 'blank' : getOptionLabel(this.options, key, 23) || key}
        .topMargin=${cfg('topMargin')}
        .bottomTicks=${cfg('bottomTicks')}
        .bottomText=${cfg('bottomText')}
        .leftDecorate=${cfg('wrapLegend') ? this.wrapAxis.bind(this) : null}>
      </multi-verse-bar>`;
  }

  renderTimeseries() {
    // TODO(cg): replace by pan-bar-time-seriew.
    return html`
      <multi-verse-bar
        id="chart"
        .data=${this.data}
        .adjustOrdinalDomain=${(domain: [Date, Date]) => {
        return [domain[0], time.timeDay.offset(domain[1], 3)];
      }}
        .ordinalScaleInterval="${time.timeDay}"
        select-type="brush"
        prevent-clear
        left-axis
        bottom-axis
        .leftTickArguments="${[3, '.0s']}"
        bottom-ticks="3"
        bottom-scale-type="time"
        value-path="+value.count"
        ></multi-verse-bar>`;
  }

  renderHistogram(groupValue: number) {
    const type = this.dataType;
    const cfg = (name: string) => this.getConfig('histogram', name, type);
    return html`
      <multi-verse-bar
        id="chart"
        .data=${this.data}
        .adjustOrdinalDomain=${(domain: [number, number]) => {
        const ext = extent(domain.filter(d => d !== Infinity).map(d => d * 1));
        return [ext[0]! - groupValue, ext[1]! + groupValue];
      }}
        .decorate="${this.decorateMissingHistogram}"
        select-type="brush"
        prevent-clear
        left-axis
        bottom-axis
        bottom-ticks="3"
        .leftTickArguments="${[3, '.0s']}"
        .bottomScaleType="${this.dataType === 'date' ? 'time' : 'linear'}"
        value-path="+value.count"
        ></multi-verse-bar>`;
  }

  renderLegend() {
    if (!this.labels) return nothing;
    return html`
     <multi-legend 
        legend
        .labels=${this.labels}
        .scale=${this.scale}
        label-wrap="170" 
        position="top-right"></multi-legend>
    
    `;
  }

  wrapAxis(axis: any, data: any[]) {
    if (this.options) {
      const options = this.options;
      const doWrap = (sel: any) => {
        sel.selectAll('.tick text')
          .text((d: string) => (d === missingKey ?
            'blank' :
            getOptionLabel(options, d)
          ))

          .call(wrap, 110, 0.5);
      };
      if (axis.end) {
        const sel = axis.selection();
        axis.on('end', function() {
          doWrap(sel);
        });
        return;
      }
      doWrap(axis);
    }
  }

  decorateMissing(chart: any, data: any) {
    return chart.filter(`[key=${missingKey}]`)
      .attr('fill', 'var(--color-secondary-text)');
  }

  decorateMissingHistogram(chart: any, data: any) {
    return chart.filter(`[key=Infinity]`)
      .attr('fill', 'var(--color-secondary-text)')
      .attr('x', 0)
      .attr('title', 'blank')
      .attr('width', 25);
  }

  sortAscending(a: { key: string, value: { count: number } }, b: { key: string, value: { count: number } }) {
    if (b.key === missingKey) {
      return 1;
    }
    return ascending(a.value.count, b.value.count);
  }



  clearFilter() {
    if (this.chart) {
      if (this.chart.clearSelection) {
        this.chart.clearSelection();
      } else {
        this.chart.selected = null;
        this.chart.selectedValues = [];
      }
    }
  }

  _onMultiSelect(e: CustomEvent) {
    const { isRange, isMulti, selection } = e.detail;
    const filter = this._getFilterText(selection, isMulti, isRange);

    this.dispatchEvent(new CustomEvent('filter-changed', { detail: Object.assign({ value: filter }, e.detail), bubbles: true, composed: true }));
  }

  _getFilterText(selection: any, isMulti: boolean, isRange: boolean) {
    const isEmtpySelection = !selection || ((isMulti || isRange) && selection && selection.length === 0);
    if (isEmtpySelection) {
      return null;
    }

    const sel = Array.isArray(selection) ? selection : [selection];
    if (isRange) {
      const f = this.isTime ? timeFormat.timeFormat('%b %d') : format.format('.0f');
      return `[${f(sel[0])}-${f(sel[1])}]`;
    }
    if (this.options) {
      const options = this.options;
      return sel.map(key => {
        return key === missingKey ? 'blank' : getOptionLabel(options, key) || key;
      }).join(', ');
    }
    return sel;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lapp-analytics-chart': lappAnalyticsChart;
  }
}

function getOptionLabel(options: ReadonlyArray<OptionT>, d: string, maxLength: number = 40) {
  return ellipsis(options.find(opt => opt.$id === d)?.locale.label || 'no label', maxLength)
}

