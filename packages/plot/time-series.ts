import { html, css, LitElement, TemplateResult } from "lit";
import { customElement, property, state } from 'lit/decorators.js';
import * as Plot from '@observablehq/plot'
import Base from "./src/base";
import { OptionT } from "./types";
import { M } from "vite/dist/node/types.d-aGj9QkWt";
import myScheme from "./src/myScheme";




/**
 *  A Plot for displaying time series data
 * 
 * TODO: 
 * - filter data per option key
 * - set colors as css variables
 * - on rectY per option
 * - check legend
 */

@customElement('lapp-plot-time-series')
export default class lappPlotTimeSeries extends Base {

  override renderPlot(data: any[], width: number, options: any) {
    return html`${Plot.plot(plotOptions(data, width, options))}`;
  };
}

declare global {
  interface HTMLElementTagNameMap {
    'lapp-plot-time-series': lappPlotTimeSeries;
  }
}

type DataT = {
  date: string,
  value: string,
  count: string
}

/**
 * Generates plot options for a time series chart.
 * @param data - The data to be plotted.
 * @param width - The width of the chart.
 * @param options - Additional options for the chart.
 * @returns The plot options for the time series chart.
 */
export function plotOptions(data: DataT[], width: number, options: OptionT): Plot.PlotOptions {
  const map = new Map(options.items.map(d => [d.key, d.label]));
  const keys = Array.from(map.keys());
  const getIndex = (d: DataT) => keys.indexOf(d.value);
  const now = Date.now();
  const last30 = new Date(now - 31 * 24 * 60 * 60 * 1000);
  // const next2 = new Date(now + 3 * 24 * 60 * 60 * 1000);
  const _data = data
    .filter(d => keys.indexOf(d.value) > -1)
    .map(d => ({ ...d, date: new Date(d.date), count: +d.count }))

  console.log('data', keys, map.values(), _data)
  return {
    title: options.title,
    subtitle: options.subtitle,
    height: options.height,
    caption: options.caption,
    width,
    marginRight: 40,
    color: {
      legend: true,
      domain: Array.from(map.values()),
      range: myScheme
    },
    marks: [
      Plot.rectY(_data, {
        x: "date",
        y1: "count", // this is to avoid stacking (`y1` and not `y`)
        dx: -(width - 40) / 31 / 2, // this is to shift the bars to the left
        sort: 'count', // this is to sort the bars by count and make sure the highest is on top (with reverse)
        reverse: true,
        interval: 'day',
        insetLeft: 2,
        insetRight: 2,
        // fill: myScheme
        fill: (d) => `var(--plot-color-${getIndex(d) % 13})`
      }),
      Plot.text(_data,
        Plot.selectMaxY(
        {
          dy: -6, lineAnchor: "bottom", x: "date", y: "count",
          text: 'count',
        })),

      Plot.ruleY([0]),
    ],
    x: {
      label: 'Date',
      interval: 'day',
      // type: 'time',
      domain: [last30, now], // this is not needed as Plot will calculate it from the data
    },
    y: {
      label: 'Count',
      tickFormat: '.0f',
      ticks: 2,
      grid: true
    },
  }
}