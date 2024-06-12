/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';

import {FilledField} from './internal/filled-field.js';
import {MdFilledField} from '@material/web/field/filled-field.js'
import { css } from 'lit';
import supportingText from './internal/supporting-text-styles';

const styles = css`
  :host([variant=a11y]) .middle {
    flex-direction: column;
    padding-top: inherit;
    
  }
  :host([variant=a11y]) .floating {
    font-size: inherit;
    position: inherit;
    padding-bottom: var(--_trailing-space, 8px);
  }
  
  :host([variant=a11y]) .label-wrapper {
    position: inherit;
    pointer-events: initial; /* this is to allow tooltips */
  }

  :host([variant=a11y]) .label {
    text-overflow: inherit;
    white-space: inherit;
  }
  /* this is to prevent floating label to appear in front of check boxes and radio 
     pointer-events is set back to initial to allow tooltips.
   */
  .label.hidden {
    pointer-events: none;
  }

  /* Allow to have flexed supporting-text e.g. for md-editor*/
  .supporting-text > span:first-child {
    display: flex;
    flex:1;
  }

`

declare global {
  interface HTMLElementTagNameMap {
    'lapp-filled-field': LappFilledField;
  }
}

/**
 * TODO(b/228525797): add docs
 * @final
 * @suppress {visibility}
 */
@customElement('lapp-filled-field')
export class LappFilledField extends FilledField {
  static override styles = [MdFilledField.styles, styles, supportingText];
}
