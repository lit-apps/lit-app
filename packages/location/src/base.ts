import type { Variant } from "@lit-app/cmp/field/field/internal/a11y-field-mixin";
import '@lit-app/cmp/field/select';
import '@material/web/select/select-option'
import { LappSelect } from "@lit-app/cmp/field/select";
import type { DistributeFunctionParamT } from "@lit-app/shared/types";

import { css, html, LitElement, nothing, PropertyValues } from "lit";
import { property, query, state } from 'lit/decorators.js';

// export type FilterT = (item: string | string[]) =>  boolean;
// export type FilterT =( (item: string) =>  boolean )| ((item: string[]) =>  boolean);
export type FilterT = DistributeFunctionParamT<string | string[], boolean>;
/**
 * Base Class for continent and countries 
 */

export default class Base extends LitElement {
  // static readonly formAssociated = true;

  static override styles = css`
      :host {
        display: inline-flex;
      }
    `;

  @state() items!: (string[] | string)[];
  @property() label!: string;
  @property() supportingText!: string;
  @property({ type: Boolean }) required: boolean = false;
  @property({ type: Boolean }) disabled: boolean = false;
  @property({ type: Boolean, attribute: 'readonly' }) readOnly: boolean = false;
  @property() variant!: Variant;
  @property({ attribute: false }) filter!: FilterT;
  @query('lapp-select') select!: LappSelect;

  /**
  * Used for initializing select when the user sets the `value` directly.
  */
  private lastUserSetValue: string | undefined ;

  // not used this is linked to the problem encountered here: https://github.com/WICG/webcomponents/issues/1075
  // get form() {
  //   let parent = this.parentNode;
  //   while (parent) {
  //     if (parent instanceof HTMLFormElement) {
  //     return parent;
  //     }
  //     parent = (parent as ShadowRoot)?.host ?? parent.parentNode;
  //   }
  //   return null;
  // }

  get value() {
    return this.lastUserSetValue || this.select?.value;

  }
  set value(value: string) {
    if (this.select) {
      this.select.value = value;
    } else {
      this.lastUserSetValue = value;
      console.warn('no select');
    }

  }

  protected override firstUpdated(_changedProperties: PropertyValues<this>): void {
    super.firstUpdated(_changedProperties);
    if (this.lastUserSetValue) {
      this.value = this.lastUserSetValue;
      // it is possible that options are not yet rendered - so we need to wait a bit
      setTimeout(() => {
        this.lastUserSetValue = undefined
      });
    }

  }

  get _items() {
    if (this.filter) {
      // @ts-expect-error - don't know how to fix this
      return (this.items).filter(this.filter);
    }
    return this.items;
  }

  constructor() {
    super();
    // this.internals = this.attachInternals();
  }

  override render() {
    return html`
    <lapp-select
      .label=${this.label}
      .value=${this.value}
      .supportingText=${this.supportingText}
      quick
      .disabled=${this.disabled}
      .readOnly=${this.readOnly}
      .required=${this.required}
      .variant=${this.variant}
      >
      ${this.required ? nothing : html`<md-select-option value=""></md-select-option>`}
      ${this.renderItems(this._items)}
    </lapp-select>
    `;
  }

  /**
   * renderItems - implement in subclass
   */
  protected renderItems(_items: (string | string[])[]) {
    return html``;
  }

}

