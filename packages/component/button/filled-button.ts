/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';

// import {MdFilledButton} from '@material/web/button/filled-button'

import {MdFilledButton} from '@material/web/button/filled-button';

declare global {
  interface HTMLElementTagNameMap {
    'lap-filled-button': LapFilledButton;
  }
}

/**
 * @summary Buttons help people take action, such as sending an email, sharing a
 * document, or liking a comment.
 *
 * @description
 * __Emphasis:__ High emphasis – For the primary, most important, or most common
 * action on a screen
 *
 * __Rationale:__ The filled button’s contrasting surface color makes it the
 * most prominent button after the FAB. It’s used for final or unblocking
 * actions in a flow.
 *
 * __Example usages:__
 * - Save
 * - Confirm
 * - Done
 *
 * @final
 * @suppress {visibility}
 */
@customElement('lap-filled-button')
export class LapFilledButton extends MdFilledButton {
  // static override styles= [sharedStyles, sharedElevationStyles, filledStyles];
}
