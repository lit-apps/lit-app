import { css, html, LitElement } from "lit";
import { customElement, property, query } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { ProvideFormContextMixin } from './provide-form-context.js';
import { FormFieldI, MimeTypesT } from './types.js';

export const SUBMIT_EVENT = 'a11y-submit';
export { BIND_FIELD_EVENT, UNBIND_FIELD_EVENT } from './provide-form-context.js';
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
export default class a11yForm extends ProvideFormContextMixin(LitElement) {

  static override styles = css`
      :host {
        display: contents;
      }
    `;


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

  @query('form') form!: HTMLFormElement;
  @query('button') submitButton!: HTMLButtonElement;

  constructor() {
    super();
    this.addEventListener(SUBMIT_EVENT, () => {
      this.submit();
    })
  }

  submit() {
    this.submitButton.click();
    this.form.dispatchEvent(new SubmitEvent());
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
  renderVirtualFields() {
    return this.boundFields.map(field => {
      return html`<a11y-virtual-field .field=${field} name="${field.name}"></a11y-virtual-field>`;
    });
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
    [SUBMIT_EVENT]: SubmitEvent;
  }
}
