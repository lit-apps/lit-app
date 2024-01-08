
import { Validator } from '@material/web/labs/behaviors/validators/validator.js';

/**
 * Constraint validation properties for a slider input.
 */
export interface SliderState {
  readonly range: boolean;
  readonly value: number;
  readonly valueStart: number;
  readonly valueEnd: number;
  readonly min: number;
  readonly max: number;
  readonly required: boolean;

}

/**
 * A validator that provides constraint validation that emulates `<input type="range">`
 * validation.
 */
export class SliderValidator extends Validator<SliderState> {
  private sliderControl?: HTMLInputElement;

  protected override computeValidity(state: SliderState) {
    // console.info('computeValiditySlider', state)
    if (!this.sliderControl) {
      // Lazily create the platform select
      this.sliderControl = document.createElement('input');
    }

    let customError = ''
    
    if (state.range) {
      if (!(state.valueStart + '')) {
        customError = 'Start value is required';
      }
      if (!(state.valueEnd + '')) {
        customError = 'End value is required';
      }
      if (state.valueStart * 1 > state.valueEnd * 1) {
        customError = 'Start value must be less than end value';
      }
      if (state.valueStart * 1 < state.min * 1) {
        customError = 'Start value must be greater than min value';
      }
      if (state.valueEnd * 1 > state.max * 1) {
        customError = 'End value must be less than max value';
      }
    } else {
      if (state.value * 1 < state.min * 1) {
        customError = 'Value must be greater than min value';
      }
      if (state.value * 1 > state.max * 1) {
        customError = 'Value must be less than max value';
      }
    }
    if(customError) {
      // we force an error because validator [syncValidation] has a bug
      // with customError
      this.sliderControl.value = '';
      this.sliderControl.required = true;  
      this.sliderControl.setCustomValidity(customError);
    } else {
      this.sliderControl.value = state.range ? (state.valueStart + '') + (state.valueEnd + '') : state.value + '';
      this.sliderControl.required = state.required;
      
    }
    
    return {
      validity: this.sliderControl.validity,
      validationMessage: this.sliderControl.validationMessage,
    };
  }

  protected override equals(prev: SliderState, next: SliderState) {
    return prev.range === next.range && prev.required === next.required &&
      prev.min === next.min && prev.max === next.max && (
        next.range ? (
          prev.valueStart === next.valueStart && prev.valueEnd === next.valueEnd
        ) : (
          prev.value === next.value
        )
      )
  }

  protected override copy({ value, range, required, valueEnd, valueStart, min, max }: SliderState) {
    return { value, required, range, valueEnd, valueStart, min, max };
  }
}
