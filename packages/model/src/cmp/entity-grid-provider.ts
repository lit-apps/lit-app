import { wait } from "@lit-app/shared";
import { watch } from "@lit-app/shared/decorator/index.js";
import { Grid } from "@vaadin/grid";
import { css, TemplateResult } from "lit";
import { customElement, property, query } from 'lit/decorators.js';
import { entityI, RenderConfig } from "../types.js";
import AbstractEntityElement from "./abstract-entity-element.js";

/**
 * an element that display an entity grid and reloads data on demand
 * 
 *
 */
@customElement('lapp-entity-grid-provider')
export default class lappEntityGridProvider extends AbstractEntityElement {

  static override styles = css`
      :host {
        display: block;
      }
    `;
  @watch('contextData')
  @watch('data') async dataChanged(data: any) {
    if (!this.entity) {
      await wait(50);
    }
    this.items = await this.entity.getGridData(this.data, this.language);
    if (this.grid) {
      this.grid.items = this.items;
    }
  }
  private items: any[] = [];
  @property() language!: string;
  @property({ attribute: false }) config!: RenderConfig;

  @query('#grid') grid!: Grid;

  override renderEntity(entity: entityI, config: RenderConfig): TemplateResult {
    return this.entity.renderGrid.call(entity, this.items, config) as TemplateResult;
  }

}

declare global {
  interface HTMLElementTagNameMap {
    'lapp-entity-grid-provider': lappEntityGridProvider;
  }
}
