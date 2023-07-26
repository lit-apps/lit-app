import { Select as S } from '@material/web/select/internal/select';
import { Variant } from '../../field/internal/a11y-field-mixin';
import { property, query } from 'lit/decorators.js';
import type { FilledField } from '../../field/internal/filled-field';
import type { OutlinedField } from '../../field/internal/outlined-field';
import { PropertyValues } from 'lit';

/**
 * @fires input Fired when a selection is made by the user via mouse or keyboard
 * interaction.
 * @fires change Fired when a selection is made by the user via mouse or
 * keyboard interaction.
 */
export abstract class Select extends S {
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
   * The field holding label
   */
  // @query('.field') override field!: FilledField | OutlinedField;


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

}
