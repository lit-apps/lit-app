import { customElement } from 'lit/decorators.js';
import Feedback from './src/feedback.js';

/**
 *  
 */

@customElement('lapp-feedback')
export default class lappFeedback extends Feedback {

}

declare global {
  interface HTMLElementTagNameMap {
    'lapp-feedback': lappFeedback;
  }
}
