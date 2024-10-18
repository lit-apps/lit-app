import { customElement } from 'lit/decorators.js';
import { LappEntityHolder } from "./entity-holder.js";

import print from "@preignition/preignition-styles/print.js";

/**
 * Entity holder for when we want an offline version
 * 
 * It renders the fields in a printable format, with some fields 
 * rendered differently: 
 * - textarea are rendered as div
 * - markdown fields are rendered as formatted div
 * - checkboxes are rendered a comma separated list of values
 * - radio buttons are rendered as their value values,
 * ...
 */

@customElement('lapp-entity-print')
export default class lappEntityPrint  extends LappEntityHolder {

  static override styles = [
    ...LappEntityHolder.styles,
    print
  ]
  
  constructor() {
    super();
    this.consumingMode = 'print';
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lapp-entity-print': lappEntityPrint;
  }
}
