/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, render} from 'lit';

import {Validator} from '@material/web/labs/behaviors/validators/validator.js';

/**
 * Constraint validation properties for a select dropdown.
 */
export interface MultiState {
  /**
   * The current selected value.
   */
  readonly selected:  string;

  /**
   * Whether the select is required.
   */
  readonly required: boolean;
}

/**
 * A validator that provides constraint validation that emulates `<select>`
 * validation.
 */
export class SingleValidator extends Validator<MultiState> {
  private selectControl?: HTMLSelectElement;

  protected override computeValidity(state: MultiState) {
		if (!this.selectControl) {
      // Lazily create the platform select
      this.selectControl = document.createElement('select');
    }

    render(html`<option value=${state.selected}></option>`, this.selectControl);

    this.selectControl.value = state.selected;
    this.selectControl.required = state.required;
    return {
      validity: this.selectControl.validity,
      validationMessage: this.selectControl.validationMessage,
    };
  }

  protected override equals(prev: MultiState, next: MultiState) {
    return prev.selected === next.selected && prev.required === next.required;
  }

  protected override copy({selected, required}: MultiState) {
    return {selected, required};
  }
}
