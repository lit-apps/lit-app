/**
 * a small outlined button
 */

import { css } from "lit";

const smallButtonStyles = css`
 :host {
	gap: 4px;
	--md-outlined-button-container-height: 20px;
	--md-outlined-button-label-text-weight: 400;
	--md-outlined-button-label-text-size: 12px;
	--md-outlined-button-leading-space: 14px;
	--md-outlined-button-trailing-space: 12px;
	--md-outlined-button-icon-size: 18px;
	--md-outlined-button-with-leading-icon-leading-space: 6px;
	--md-outlined-button-with-leading-icon-trailing-space: 6px;
	height: 20px;
	}
`;
import {customElement} from 'lit/decorators.js';

import {MdOutlinedButton} from  '@material/web/button/outlined-button.js';

declare global {
  interface HTMLElementTagNameMap {
    'lapp-small-outlined-button': MdOutlinedButton;
  }
}

/**
 * @summary Buttons help people take action, such as sending an email, sharing a
 * document, or liking a comment.
 *
 * @description
 * __Emphasis:__ Medium emphasis – For important actions that don’t distract
 * from other onscreen elements.
 *
 * __Rationale:__ Use an outlined button for actions that need attention but
 * aren’t the primary action, such as “See all” or “Add to cart.” This is also
 * the button to use for giving someone the opportunity to change their mind or
 * escape a flow.
 *
 * __Example usages:__
 * - Reply
 * - View all
 * - Add to cart
 * - Take out of trash
 *
 * @final
 * @suppress {visibility}
 */
@customElement('lapp-small-outlined-button')
export class LappOutlinedButton extends MdOutlinedButton {
  static override styles = [...MdOutlinedButton.styles, smallButtonStyles];
}