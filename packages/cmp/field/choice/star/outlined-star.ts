
import { customElement } from 'lit/decorators.js';

import { OutlinedStar } from './internal/outlined-star.js';
import outlinedStyles from './outlinedStyles';
import { MdOutlinedTextField } from '@material/web/textfield/outlined-text-field.js'
import genericStyles from '../../generic/styles';
import starStyles from './internal/starStyles';
import { CSSResult } from 'lit';

declare global {
  interface HTMLElementTagNameMap {
    'lapp-outlined-star': LappOutlinedStar;
  }
}

/**
 * @final
 * @suppress {visibility}
 */
@customElement('lapp-outlined-star')
export class LappOutlinedStar extends OutlinedStar {
  static override styles: CSSResult[] = [
    ...MdOutlinedTextField.styles, 
    ...starStyles,
    outlinedStyles,
  ];
}
