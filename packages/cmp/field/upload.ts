
import { customElement } from 'lit/decorators.js';

import { LappFilledUpload } from './upload/filled-upload';

declare global {
  interface HTMLElementTagNameMap {
    'lapp-upload': LappUpload;
  }
}

/**
 * # Slider 
 * 
 * @summary
 * slider is a component that display allow to register a slider and store it locally.
 
 * @final
 */
@customElement('lapp-upload')
export class LappUpload extends LappFilledUpload {
 
}

