/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';

import {FilledField} from './lib/filled-field.js';
import {MdFilledField} from '@material/web/field/filled-field.js'
import { css } from 'lit';

const styles = css`
  :host([variant=a11y]) .middle {
    flex-direction: column;
    padding-top: inherit;
    
  }
  :host([variant=a11y]) .floating {
    font-size: inherit;
    position: inherit;
    padding-bottom: var(--space-small, 8px);
  }
  
  :host([variant=a11y]) .label {
    text-overflow: inherit;
    white-space: inherit;
  }
  `

declare global {
  interface HTMLElementTagNameMap {
    'lap-filled-field': LapFilledField;
  }
}

/**
 * TODO(b/228525797): add docs
 * @final
 * @suppress {visibility}
 */
@customElement('lap-filled-field')
export class LapFilledField extends FilledField {
  static override styles = [MdFilledField.styles, styles];
}
