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
import { Field } from '@material/web/field/internal/field';
import { onReportValidity } from '@material/web/labs/behaviors/on-report-validity';
import { A11yFieldMixinInterface } from '../field/internal/a11y-field-mixin';


// @ts-ignore
export interface GenericI extends TextField {
  hasError: boolean
  focused: boolean
  fieldName: string
  field: Field & A11yFieldMixinInterface

  input: HTMLInputElement | null | undefined
  inputOrTextarea: HTMLInputElement | null | undefined

  // fieldTag: StaticValue

  renderField(): TemplateResult
  renderPrefix(): TemplateResult
  renderSuffix(): TemplateResult
  renderInputOrTextarea(): TemplateResult
  renderLeadingIcon(): TemplateResult
  renderTrailingIcon(): TemplateResult
  // renderSupportingText(): TemplateResult
  // renderCounter(): TemplateResult
  // getAriaDescribedBy(): string
  getInputValue(): string
  getErrorText(): string

  // syncValidity(): void
  getInputOrTextarea(): HTMLInputElement | null

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

  @query('.input') protected override readonly input!: HTMLInputElement | null;
  @query('.input') override readonly inputOrTextarea!: HTMLInputElement | null;
  
  protected override renderField() {
    const t = this as unknown as GenericI

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
      ${t.renderInputOrTextarea()}
      ${t.renderTrailingIcon()}
      <div id="description" slot="aria-describedby"></div>
    </${this.fieldTag}>`;
  }

  getTextLabel() {
    return this.field?.getTextLabel?.() || this.label
  }

  get supportingOrErrorText() {
    return this.error && this.errorText ? this.errorText : this.supportingText;
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

  protected override renderInputOrTextarea(): TemplateResult {
    return html`
      <slot><input id="input" class="input"></input></slot>
      `;
  }

  protected override getInputOrTextarea() {
		return this.input
	}

  // we override onREportValidity to prevent the default behavior
  // focusing on the element
  [onReportValidity](invalidEvent: Event | null) {
    if (invalidEvent?.defaultPrevented) {
      return;
    }

    if (invalidEvent) {
      // Prevent default pop-up behavior. This also prevents focusing, so we
      // manually focus.
      invalidEvent.preventDefault();
      // TODO: add a propety to allow user to choose to focus or not
      // this.focus();
    }

    const prevMessage = this.getErrorText();
    this.nativeError = !!invalidEvent;
    this.nativeErrorText = this.validationMessage;

    if (prevMessage === this.getErrorText()) {
      this.field?.reannounceError();
    }
  }

}