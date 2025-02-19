import { css, html, LitElement, TemplateResult } from "lit";
import { property } from 'lit/decorators.js';
import { OptionT } from "../types";
import { ConsumeDataMixin } from "./context-data-mixin";
/**
 * Base abstract class for Plots 
 */

export default abstract class Base extends ConsumeDataMixin(LitElement) {

  abstract renderPlot(data: any[], width: number, options: OptionT): TemplateResult;

  static override styles = css`
  /* Define color variables from theme and https://observablehq.com/plot/features/scales#color-scales */
    :host {
      --plot-color-0: var(--color-secondary, #01BAA3);
      --plot-color-1: var(--color-primary, #1226AA);
      --plot-color-2: var(--color-tertiary, #bc004b);
      --plot-color-3: #4269d0;
      --plot-color-4: #efb118;
      --plot-color-5: #ff725c;
      --plot-color-6: #6cc5b0;
      --plot-color-7: #3ca951;
      --plot-color-8: #ff8ab7;
      --plot-color-9: #a463f2;
      --plot-color-10: #97bbf5;
      --plot-color-11: #9c6b4e;
      --plot-color-12: #9498a0;
    }

    h2, h3 {
      font-weight: var(--font-weight-bold, 700);
      margin: 0;
    }
    /** Plot title */
    h2 {
      
    }
    /** Plot subtitle */
    h3 {

    }

    :host > svg, figure {
      margin: 0;
    }

    figcaption {
      font-size: var(--font-size-small, 0.875rem);
      font-style: italic;
    }
  `;

  /**
   * Width of the plot
   */
  @property({ type: Number }) width: number = 640;
  /**
   * Height of the plot - possibly undefined as Plot calculates height based on width and plot type
   */
  @property({ type: Number }) height!: number;

  /**
   * Options for the plot
   */
  @property({ attribute: false }) options!: OptionT;

  /**
   * What to render when no data is available
   */
  renderNoData() {
    return html`<slot name="no-data"><div>No data</div></slot>`
  }
  /**
  * What to render when no data is available
  */
  renderLoadingData() {
    return html`<slot name="loading-data"><div>Loading data ...</div></slot>`
  }


  override render() {
    if (!this.data) return this.renderLoadingData();
    if (this.data.length === 0) return this.renderNoData();
    return html`${this.renderPlot(this.data, this.width, this.options)}`;
  }
}

