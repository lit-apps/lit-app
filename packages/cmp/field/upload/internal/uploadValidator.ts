
import { Validator } from '@material/web/labs/behaviors/validators/validator.js';

/**
 * Constraint validation properties for a upload input.
 */
export interface UploadState {
  readonly value: string;
  readonly required: boolean;

}

/**
 * A validator that provides constraint validation that emulates `<input type="range">`
 * validation.
 */
export class UploadValidator extends Validator<UploadState> {
  private uploadControl?: HTMLInputElement;

  protected override computeValidity(state: UploadState) {
    // console.info('computeValidityUpload', state)
    if (!this.uploadControl) {
      // Lazily create the platform select
      this.uploadControl = document.createElement('input');
    }

    let customError = ''
    
    if(customError) {
      // we force an error because validator [syncValidation] has a bug
      // with customError
      this.uploadControl.value = '';
      this.uploadControl.required = true;  
      this.uploadControl.setCustomValidity(customError);
    } else {
      this.uploadControl.value =  state.value + '';
      this.uploadControl.required = state.required;
      
    }
    
    return {
      validity: this.uploadControl.validity,
      validationMessage: this.uploadControl.validationMessage,
    };
  }

  protected override equals(prev: UploadState, next: UploadState) {
    return prev.value === next.value
    // return prev.range === next.range && prev.required === next.required &&
    //   prev.min === next.min && prev.max === next.max && (
    //     next.range ? (
    //       prev.valueStart === next.valueStart && prev.valueEnd === next.valueEnd
    //     ) : (
    //     )
    //   )
  }

  protected override copy({ value, required }: UploadState) {
    return {value, required}
  }
}
