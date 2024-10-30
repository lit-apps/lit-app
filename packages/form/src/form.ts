import { html, css, LitElement } from "lit";
import { ifDefined } from 'lit/directives/if-defined.js';
import { customElement, property, query, state } from 'lit/decorators.js';
import { FormFieldI, MimeTypesT } from './types.js';
import './virtual-field.js';
import { FormContext } from "./context-form.js";
import { ContextProvider } from "@lit/context";


export const BIND_FIELD_EVENT = 'a11y-bind-field';
export const UNBIND_FIELD_EVENT = 'a11y-unbind-field';
export const SUBMIT_EVENT = 'a11y-submit';

interface BindFieldEventDetail {
  field: FormFieldI;
}

export class BindFieldEvent extends CustomEvent<BindFieldEventDetail> {
  constructor(field: FormFieldI) {
    super(BIND_FIELD_EVENT, { detail: { field }, bubbles: true, composed: true });
  }
}

export class UnbindFieldEvent extends CustomEvent<BindFieldEventDetail> {
  constructor(field: FormFieldI) {
    super(UNBIND_FIELD_EVENT, { detail: { field }, bubbles: true, composed: true });
  }
}

export class SubmitEvent extends CustomEvent<void> {
  constructor() {
    super(SUBMIT_EVENT, { bubbles: true, composed: true });
  }
}

/**
 * A11yForm is a custom element that represents a form element.
 * 
 * This element is meant to be used as a wrapper for form fields as form 
 * elements do not participate in forms if they are not in the same shadow DOM.
 * 
 * A11yForm will behave like a native form element. 
 * 
 */

@customElement('a11y-form')
export default class a11yForm extends LitElement {

  static override styles = css`
      :host {
        display: contents;
      }
    `;
  formProvider = new ContextProvider(this, { context: FormContext });

  /**
   * The URL to which the form data will be submitted.
   * This property is required and must be a valid URL string.
   */
  @property() action!: string;

  /**
   * The encoding type for the form data when it is submitted to the server.
   * This property specifies how the form data should be encoded when sent.
   * Common values include "application/x-www-form-urlencoded", "multipart/form-data", and "text/plain".
   */
  @property() enctype: MimeTypesT = 'application/x-www-form-urlencoded';

  /**
   * The HTTP method to submit the form with.
   * This property specifies the HTTP method that the browser uses to submit the form.
   * Possible values are "get" and "post".
   */
  @property() method: 'get' | 'post' = 'get';

  /**
   * A boolean property that indicates whether the form should not be validated when submitted.
   * 
   * When set to `true`, the form will not trigger HTML5 validation upon submission.
   * Defaults to `false`.
   */
  @property({ type: Boolean }) novalidate: boolean = false;

  /**
   * The submission mode of the form.
   * 
   * This property specifies how the form data should be submitted to the server.
   * Possible values are "default" and "fetch".
   * 
   * - "default": The form data is submitted using the browser's default form submission mechanism.
   * - "fetch": The form data is submitted using the Fetch API - the page does not reload.
   */
  @property() submissionMode: 'default' | 'fetch' = 'default';

  @state() boundFields: FormFieldI[] = [];

  @query('form') form!: HTMLFormElement;
  @query('button') submitButton!: HTMLButtonElement;

  constructor() {
    super();
    this.formProvider.setValue(this)
    this.addEventListener(BIND_FIELD_EVENT, (e: BindFieldEvent) => {
      this.bindField(e.detail.field);
    });
    this.addEventListener(UNBIND_FIELD_EVENT, (e: UnbindFieldEvent) => {
      this.unbindField(e.detail.field);
    });
    this.addEventListener(SUBMIT_EVENT, () => {
      this.submit();
    })
  }

  submit() {
    this.submitButton.click();
    this.form.dispatchEvent(new SubmitEvent());
  }

  private bindField(field: FormFieldI) {
    if (!this.boundFields.includes(field)) {
      // re reverse the order so that the first field is focused first
      this.boundFields.unshift(field);
      this.requestUpdate();
    }
  }
  private unbindField(field: FormFieldI) {
    this.boundFields = this.boundFields.filter(f => f !== field);
  }
  override render() {
    const onClick = (e: Event) => {
      if (this.submissionMode === 'fetch') {
        e.preventDefault();
        // TODO: implement fetch submission
      }
      this.reportValidity();
    }
    return html`
    <form
      action=${ifDefined(this.action)}
      .enctype=${this.enctype}
      .method=${this.method}
      .noValidate=${this.novalidate}
      @invalid=${(e: Event) => {
        console.log('FORM invalid', e);
      }}
    >
      <slot></slot> 
      ${this.renderVirtualFields()}
      <button @click=${onClick} type="submit">Submit</button>
    </form>
    `;
  }

  private reportValidity() {
    // sync virtual fields validity first, 
    // then check form validity
    // we reverse so that the first invalid field is focused
    let isValid = true
    Array.from(this.form.elements as unknown as FormFieldI[])
      .forEach((f) => {
        if (!f.reportValidity()) {
          isValid = false;
        }
      });
    // if (this.form.checkValidity()) {
    if (isValid) {
      console.log('Form is valid');
    } else {
      console.log('Form is invalid');
    }
  }

  private renderVirtualFields() {
    return this.boundFields.map(field => {
      return html`<a11y-virtual-field .field=${field} name="${field.name}"></a11y-virtual-field>`;
    });
  }
  override connectedCallback() {
    super.connectedCallback();

  }
  override disconnectedCallback() {
    super.disconnectedCallback();

  }
}

declare global {
  interface HTMLElementTagNameMap {
    'a11y-form': a11yForm;
  }
  interface HTMLElementEventMap {
    [BIND_FIELD_EVENT]: BindFieldEvent;
    [UNBIND_FIELD_EVENT]: UnbindFieldEvent;
    [SUBMIT_EVENT]: SubmitEvent;
  }
}
