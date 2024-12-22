import { Select as S } from '@material/web/select/internal/select';
import { type Variant } from '../../field/internal/a11y-field-mixin';
import { property} from 'lit/decorators.js';
import { nothing, PropertyValues } from 'lit';
import { html } from 'lit';
import { StaticValue, html as staticHtml } from 'lit/static-html.js';
// @ts-expect-error - locale is not typed
import locale  from '../../choice/readaloud-locale.mjs';
import translate  from '@preignition/preignition-util/translate-mixin.js';
import NoAutoValidateMixin from '../../mixin/noAutoValidateMixin.js';

/**
 * We add real class to avoid TS error
 */
class RealClass extends S {
	protected readonly fieldTag!: StaticValue
}

/**
 * @fires input Fired when a selection is made by the user via mouse or keyboard
 * interaction.
 * @fires change Fired when a selection is made by the user via mouse or
 * keyboard interaction.
 */
export class Select extends 
  NoAutoValidateMixin(
    translate(RealClass, locale, 'readaloud')) {
  /**
   * The variant to use for rendering the field
   */
  @property({reflect: true}) variant!: Variant

  /**
   * Whether the label should be displayed above the field
   * and removes animation on focus
   */
  @property({type: Boolean}) labelAbove: boolean = false

  /**
   * Indicates whether or not a user should be able to edit the text field's
   * value.
   *
   * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#readonly
   */
  @property({type: Boolean, reflect: true}) readOnly = false;

  // make sure menu is always quick - see https://github.com/material-components/material-web/issues/5227
  // @property({type: Boolean}) override quick = true

  /**
   * propagate variant and labelAbove to field as they are not part of the template
   * @param changedProperties 
   */
  private propagateToField(changedProperties: PropertyValues<this>) {
    if (this.field) {
      if (changedProperties.has('labelAbove')) {
        // temp fix for setting label above.
        if (this.labelAbove ) {
          this.variant = this.variant || 'a11y';
        }
        this.field.labelAbove = this.labelAbove;
      }

      if (changedProperties.has('variant')) {
        this.field.variant = this.variant;
      }
    }
  }

  override firstUpdated(changedProperties: PropertyValues<this>) {
    this.propagateToField(changedProperties);
    this.addEventListener('input', this.reportValidity)
    return super.firstUpdated(changedProperties);
  }

  override willUpdate(changedProperties: PropertyValues<this>) {
		super.willUpdate(changedProperties);
		this.propagateToField(changedProperties);
	}

  /**
   * 
   * @returns as for text-field, we override renderField to add : 
   * - supportingText,
   * - errorText, and
   * - label to be non string
   */
  private override renderField() {
    return staticHtml`
      <${this.fieldTag}
          aria-haspopup="listbox"
          role="combobox"
          part="field"
          id="field"
          tabindex=${this.disabled ? '-1' : '0'}
          aria-label=${(this as ARIAMixinStrict).ariaLabel || this.label || nothing}
          aria-describedby="description"
          aria-expanded=${this.open ? 'true' : 'false'}
          aria-controls="listbox"
          class="field"
          .label=${this.label}
          ?no-asterisk=${this.noAsterisk}
          .focused=${this.focused || this.open}
          .populated=${!!this.displayText}
          .disabled=${this.disabled}
          .required=${this.required}
          aria-required=${this.required || nothing}
          .error=${this.hasError}
          ?has-start=${this.hasLeadingIcon}
          has-end
          .supportingText=${this.supportingText}
          .errorText=${this.getErrorText()}
          @keydown=${this.handleKeydown}
          @click=${this.handleClick}>
         ${this.renderFieldContent()}
         <div id="description" slot="aria-describedby"></div>
      </${this.fieldTag}>`;
  }

  
  // getTextLabel() {
  //   let label =  this.field?.getTextLabel?.() || this.label
  //   return label
  // }
  
  
  getReadAloud(readHelper) {
    let label = this.getTextLabel();
    if (label.endsWith('*')) {
      label = label.slice(0, -1);
      label += this.getTranslate('required');
    }
		
    return this.value ?
      `${this.displayText} ${this.getTranslate('isTheAnswerTo')} ${label}` :
      (label + (readHelper && this.supportingText ? ('. ' + this.getTranslate('hint') + ': ' + this.supportingText) + '.' : '') + this.getReadAloudOptions(readHelper));
  }

  getReadAloudOptions(readHelper) {
    const options = [...this.options].map((item, index) => `${this.getTranslate('option')} ${index + 1}: ${item.displayText}.`);
    return `${this.getTranslate('chooseOption')}: ${options}`;
  }

  private override handleKeydown(event: KeyboardEvent) {
    if (this.readOnly) {
      return;
    }
    return super.handleKeydown(event);
  }
  
  private override handleClick() {
    if (this.readOnly) {
      return;
    }
    return super.handleClick();
  }

  // we override renderMenuContent to make sure we update value when slot change
  // this is necessary for async items to work
  private override renderMenuContent() {
		const onSlotChange = (e: Event) => {
      if(this.value !== this.lastUserSetValue) {
        setTimeout(() => {
          this.value = this.lastUserSetValue;
          this.updateValueAndDisplayText()  
      }, 600)
      }
		}
    return html`<slot @slotchange=${onSlotChange}></slot>`;
  }
}
