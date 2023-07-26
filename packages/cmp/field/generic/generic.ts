/** 
 * A generic field, that will be extended by other fields
 * It extends the material design text field
 * 
 * 
 */
import { TextField } from '../textfield/internal/text-field';
import { classMap } from 'lit/directives/class-map.js';
import { html, LitElement, TemplateResult } from 'lit';
import { html as staticHtml, StaticValue } from 'lit/static-html.js';
import { property, query } from 'lit/decorators.js';
import { CompatMixin } from '../compat/compat-mixin.js';


// @ts-ignore
export interface GenericI extends TextField {
  hasError: boolean
  focused: boolean
  fieldName: string

  input: HTMLInputElement | null | undefined

  renderField(): TemplateResult
  renderPrefix(): TemplateResult
  renderSuffix(): TemplateResult
  renderInput(): TemplateResult
  renderLeadingIcon(): TemplateResult
  renderTrailingIcon(): TemplateResult
  // renderSupportingText(): TemplateResult
  // renderCounter(): TemplateResult
  // getAriaDescribedBy(): string
  getInputValue(): string
  getErrorText(): string

  checkValidityAndDispatch(): { valid: boolean, canceled: boolean }
}

/**
 * Generic Abstract class for constructing input fields.
 * 
 * This class is meant to be overridden. Subclasses MUST implement the following:
 * - renderInput - the input element, which is the main element of the field and MUST have teh value for the field
 * - input query getting the input element
 */
// @ts-ignore
export abstract class Generic extends CompatMixin(TextField) implements GenericI {
  protected abstract override readonly fieldName: string

  @query('.input') protected override readonly input?: HTMLInputElement | null;

  protected override renderField() {
    const t = this as unknown as GenericI
    const prefix = t.renderPrefix();
    const suffix = t.renderSuffix();
    const input = t.renderInput();

    return staticHtml`<${this.fieldTag}
      class="field"
      ?disabled=${this.disabled}
      ?error=${t.hasError}
      ?focused=${t.focused}
      ?hasEnd=${this.hasTrailingIcon}
      ?hasStart=${this.hasLeadingIcon}
      .label=${this.label}
      ?populated=${this.getPopulated()}
      ?required=${this.required}
      .supportingText=${this.supportingText}
      .errorText=${this.getErrorText()}
    >
      ${t.renderLeadingIcon()}
      ${prefix}${input}${suffix}
      ${t.renderTrailingIcon()}
    </${this.fieldTag}>`;
  }

  override render() {
    const t = this as unknown as GenericI
    const classes = {
      'disabled': t.disabled,
      'error': !t.disabled && t.hasError,
      [`${t.fieldName}-field`]: true
    };

    return html`
       <span class=${classMap(classes)}>
         ${t.renderField()}
       </span>
     `;
  }


  protected getPopulated() {
    // when populated is true, the label will not float
    // to get the initial behavior back, return this.getInputValue
    return true
  }

  protected override renderInput(): TemplateResult {
    return html`
      <slot><input class="input"></input></slot>
      <div id="description" slot="aria-describedby"></div>
      `;
  }
}