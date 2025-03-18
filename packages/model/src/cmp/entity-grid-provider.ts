import { watch } from "@lit-app/shared/decorator/index.js";
import { Grid } from "@vaadin/grid";
import { css, html, LitElement } from "lit";
import { customElement, property, query } from 'lit/decorators.js';
import { entityI, RenderConfig } from "../types.js";

/**
 * an element that display an entity grid and reloads data on demand
 * 
 *
 */
@customElement('lapp-entity-grid-provider')
export default class lappEntityGridProvider extends LitElement {
  // ProvideEntityMixin( 
  //   ProvideDataMixin()(LitElement)) {

  static override styles = css`
      :host {
        display: block;
      }
    `;

  @property({ attribute: false }) entity!: entityI;
  @property({ attribute: false }) data!: any;
  @watch('data') dataChanged(data: any) {
    this.grid.items = data;
  }
  @property({ attribute: false }) config!: RenderConfig;

  @query('#grid') grid!: Grid;
  override render() {
    if (!this.entity) {
      return html`loading entity... `;
    }
    return this.entity.renderGrid.call(this.entity, this.data, this.config);
  }

}

declare global {
  interface HTMLElementTagNameMap {
    'lapp-entity-grid-provider': lappEntityGridProvider;
  }
}
