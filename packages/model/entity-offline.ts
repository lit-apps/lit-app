import print from "@lit-app/shared/styles/class/print.js";
import { customElement } from 'lit/decorators.js';
import { LappEntityHolder } from "./entity-holder.js";


/**
 * Entity holder for when we want an offline version 
 * 
 * It renders the fields in a printable format, but still assign 
 * the values to the fields.
 * 
 */
@customElement('lapp-entity-offline')
export default class lappEntityOffline  extends LappEntityHolder {

  static override styles = [
    ...LappEntityHolder.styles,
    print
  ]
  
  constructor() {
    super();
    this.consumingMode = 'offline';
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lapp-entity-offline': lappEntityOffline;
  }
}
