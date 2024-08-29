import type { Variant } from "@lit-app/cmp/field/field/internal/a11y-field-mixin";
import '@lit-app/cmp/field/select';
import '@material/web/select/select-option'
import { LappSelect } from "@lit-app/cmp/field/select";

import { css, html, LitElement, nothing } from "lit";
import { property, query, state } from 'lit/decorators.js';

/**
 * Base Class for continent and countries 
 */

export default class Base extends LitElement {

  static override styles = css`
      :host {
        display: inline-flex;
      }
    `;

  @state() items!: string[] | string[][];
  @property() label!: string;
  @property() supportingText!: string;
  @property({ type: Boolean }) required: boolean = false;
  @property({ type: Boolean }) disabled: boolean = false;
  @property({ type: Boolean, attribute: 'readonly' }) readOnly: boolean = false;
  @property() variant!: Variant;

  @query('lapp-select') select!: LappSelect;

  get value() {
    return this.select?.value;
    
  }
  set value(value: string) {  
    if(this.select) {
     this.select.value = value;
    }
  }

  override render() {
    return html`
    <lapp-select
      .label=${this.label}
      .value=${this.value}
      .supportingText=${this.supportingText}
      quick
      .disabled=${this.disabled }
      .readOnly=${this.readOnly}
      .required=${this.required}
      .variant=${this.variant}
      >
      ${this.required ? nothing : html`<md-select-option value=""></md-select-option>`}
      ${this.renderItems(this.items)}
    </lapp-select>
    `;
  }

  /**
   * renderItems - implement in subclass
   */
  protected renderItems(_items: string[] | string[][]) {
    return html``;
  }

}

