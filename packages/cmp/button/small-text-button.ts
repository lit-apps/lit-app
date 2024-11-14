/**
 * a small outlined button
 */

import { css } from "lit";

const smallButtonStyles = css`
 :host {
	gap: 4px;
	--md-text-button-container-height: 20px;
	--md-text-button-label-text-weight: 400;
	--md-text-button-label-text-size: 12px;
	--md-text-button-leading-space: 14px;
	--md-text-button-trailing-space: 12px;
	--md-text-button-icon-size: 18px;
	--md-text-button-with-leading-icon-leading-space: 6px;
	--md-text-button-with-leading-icon-trailing-space: 6px;
	height: 20px;
	}
`;
import {customElement} from 'lit/decorators.js';

import {MdTextButton} from  '@material/web/button/text-button.js';

declare global {
  interface HTMLElementTagNameMap {
    'lapp-small-text-button': MdTextButton;
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
@customElement('lapp-small-text-button')
export class LappTextButton extends MdTextButton {
  static override styles = [...MdTextButton.styles, smallButtonStyles];
}