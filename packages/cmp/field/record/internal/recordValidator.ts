/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */


import { Validator } from '@material/web/labs/behaviors/validators/validator.js';

/**
 * Constraint validation properties for a recording input.
 */
export interface RecordState {
  /**
   * The current selected value. ('blob:http://localhost:5174/acb37816-516f-48fb-bd64-3dbae1b9b4f8')
   */
  readonly value: string;

  /**
   * maxDuration
   */
  readonly maxDuration: number;

  /**
   * Whether the select is required.
   */
  readonly required: boolean;

  /**
   * the current duration of the recording
   */
  readonly currentDuration: number;
}

/**
 * A validator that provides constraint validation that emulates `<select>`
 * validation.
 */
export class RecordValidator extends Validator<RecordState> {
  private selectControl?: HTMLInputElement;

  protected override computeValidity(state: RecordState) {
    if (!this.selectControl) {
      // Lazily create the platform select
      this.selectControl = document.createElement('input');
    }
    let customError = '';
    if (state.currentDuration > state.maxDuration) {
      customError = 'Recording is too long';
    }
    if (customError) {
      // we force an error because validator [syncValidation] has a bug
      // with customError
      this.selectControl.value = '';
      this.selectControl.required = true;
      this.selectControl.setCustomValidity(customError);
    } else {
      this.selectControl.value = state.value;
      this.selectControl.required = state.required;
    }
    return {
      validity: this.selectControl.validity,
      validationMessage: customError || this.selectControl.validationMessage,
      // validationMessage: this.selectControl.validationMessage,
    };
  }

  protected override equals(prev: RecordState, next: RecordState) {
    return prev.value === next.value &&
      prev.required === next.required &&
      prev.maxDuration === next.maxDuration &&
      prev.currentDuration === next.currentDuration;
  }

  protected override copy({ value, required, maxDuration, currentDuration }: RecordState) {
    return { value, required, maxDuration, currentDuration };
  }
}
