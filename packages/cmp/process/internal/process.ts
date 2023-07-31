import {  LitElement, html } from "lit";
import { property} from 'lit/decorators.js';

/**
 * Process 
 *  
 * @fires count-changed - Indicates when the count changes
 * @slot - This element has a slot
 * @csspart button - The button
 */
 export class Process extends LitElement {
  
  /**
   * The name to say "Hello" to.
   */
   @property()
   name = 'World';
 
   /**
    * The number of times the button has been clicked.
    */
   @property({type: Number})
   count = 0;

  override render() {
    return html`
      <${this.fieldTag}>
      <h1>Hello, ${this.name}!</h1>
      <button @click=${this._onClick} part="button">
        Click Count: ${this.count}
      </button>
      
      <slot></slot>
      </${this.fieldTag}>
    `;
  }
  private _onClick() {
    this.count++;
    this.dispatchEvent(new CustomEvent('count-changed'));
  }
}

