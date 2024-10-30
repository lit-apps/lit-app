
import { internals, mixinElementInternals } from '@material/web/labs/behaviors/element-internals.js';
import {
  getFormState,
  getFormValue,
  mixinFormAssociated,
} from '@material/web/labs/behaviors/form-associated.js';
import { css, html, isServer, LitElement } from "lit";
import { customElement, state } from 'lit/decorators.js';
import { FormFieldI } from './types.js';
import watch from '@lit-app/shared/decorator/watch.js';


/**
 * A virtual field is a field that is rendered withing a11y-form DOM, to represent form fields 
 * contained by the same form, but not in same shadow DOM.
 * 
 * This is meant to make deeply nested form fields work across shadow DOM boundaries.
 * 
 * Any form related mechanism, like validation, submission, etc, will be handed over to the bound field.
 */
@customElement('a11y-virtual-field')
export default class a11yVirtualField extends
  mixinFormAssociated(mixinElementInternals(LitElement)) {

  static override styles = css`
      :host {
        display: none;
        /* display: block;
        padding: 8px;
        background-color: #f5f5f5;  */
      }
    `;
  @state() field!: FormFieldI;
  @watch('field') _fieldChanged(field: FormFieldI, old: FormFieldI) {
    this.setAttribute('name', field.name);
  }

  constructor() {
    super();
    // it needs to be able to receive focus. Otherwise, the browser will complain.
    this.tabIndex = -1;
    // this is to prevent the browser from showing its own validation UI
    this.addEventListener('invalid', (e: Event) => {
      e.preventDefault()
      this.focus();
    });
  }

  get validity() {
    return this.field.validity;
  }

  get validationMessage() {
    return this.field.validationMessage;
  }

  override[getFormValue]() {
    if (!this.field) {
      return '';
    }
    return this.field[getFormValue]();
  }

  override[getFormState]() {
    if (!this.field) {
      return '';
    }
    return this.field[getFormState]();
  }
  // //TODO: remove this
  // get fieldInternals() {
  //   return this.field[internals];
  // }
  // //TODO: remove this
  // get internals() {
  //   return this[internals];
  // }

  checkValidity() {
    const validity = this.field.checkValidity();
    this.syncInternals();
    return validity;
  }

  reportValidity() {
    const validity = this.field.reportValidity();
    this.syncInternals();
    return validity;
  }

  setCustomValidity(error: string) {
    return this.field.setCustomValidity(error);
  }

  override focus(options?: FocusOptions): void {
    // console.log('focus', this.field);
    this.field?.focus(options);
  }

  private syncInternals() {
    if (isServer || !this.field) {
      return;
    }
    this[internals].setValidity(this.validity, this.validationMessage)
    this[internals].setFormValue(this[getFormValue](), this[getFormState]());
    console.log('validity', this[internals].validity.valid, this[internals].validity);
  }


  // override render() {
  //   return html`
  //     <div>
  //         value: ${this[getFormValue]()}
  //     </div>
  //   `;
  // }

}

declare global {
  interface HTMLElementTagNameMap {
    'a11y-virtual-field': a11yVirtualField;
  }
}
