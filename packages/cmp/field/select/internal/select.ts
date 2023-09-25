import { Select as S } from '@material/web/select/internal/select';
import { Variant } from '../../field/internal/a11y-field-mixin';
import { property, query } from 'lit/decorators.js';
import { PropertyValues } from 'lit';
import { getInnerText } from '@preignition/preignition-util';
import locale  from '../../choice/readaloud-locale.mjs';
import translate  from '@preignition/preignition-util/translate-mixin.js';


/**
 * @fires input Fired when a selection is made by the user via mouse or keyboard
 * interaction.
 * @fires change Fired when a selection is made by the user via mouse or
 * keyboard interaction.
 */
export abstract class Select extends translate(S, locale, 'readaloud') {
  /**
   * The variant to use for rendering the field
   */
  @property() variant!: Variant

  /**
   * Whether the label should be displayed above the field
   * and removes animation on focus
   */
  @property() labelAbove: boolean = false

  /**
   * Indicates whether or not a user should be able to edit the text field's
   * value.
   *
   * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#readonly
   */
  @property({type: Boolean, reflect: true}) readOnly = false;

  /**
   * propagate variant and labelAbove to field as they are not part of the template
   * @param changedProperties 
   */
  private propagateToField(changedProperties: PropertyValues) {
    if (this.field) {
      if (changedProperties.has('variant')) {
        this.field.variant = this.variant;
      }
      if (changedProperties.has('labelAbove')) {
        this.field.labelAbove = this.labelAbove;
      }
    }
  }

  override async firstUpdated(changedProperties: PropertyValues<this>) {
    this.propagateToField(changedProperties);
    super.firstUpdated(changedProperties);
  }

  getReadAloud(readHelper) {
    return this.value ?
      `${this.displayText} ${this.getTranslate('isTheAnswerTo')} ${getInnerText(this.label)}` :
      (getInnerText(this.label) + (readHelper && this.supportingText ? ('. ' + this.getTranslate('hint') + ': ' + this.supportingText) + '.' : '') + this.getReadAloudOptions(readHelper));
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

}
