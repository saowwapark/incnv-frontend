import { FormControl, FormGroup, ValidationErrors, AbstractControl } from '@angular/forms';
import { isPresent, isEqual } from '../../utils/logic.utils';
import { addErrorToControl, removeErrorFromControl, formGroup2Controls, getControlsHasValue } from '../../utils/formcontrol.utils';

export class CustomValidators {
  public static duplicateInFormGroup(formGroup: FormGroup): ValidationErrors | null {
    const allControls: AbstractControl[] = formGroup2Controls(formGroup);
    const controls = getControlsHasValue(allControls);
    const errorKey = 'duplicated';
    let find = false;
    const dupIndexes: number[] = [];
    if (controls.length > 1) {
      for (let mainIndex = 0; mainIndex < controls.length - 1; mainIndex++) {
        const mainControl = controls[mainIndex];
        const mainValue = controls[mainIndex].value;
        if (!dupIndexes.includes(mainIndex)) {
          for (let currentIndex = mainIndex + 1; currentIndex < controls.length; currentIndex++) {
            if (!dupIndexes.includes(currentIndex)) {
              const currControl = controls[currentIndex];
              const currentValue = currControl.value;
              if (isEqual(mainValue, currentValue)) {
                addErrorToControl(mainControl, errorKey);
                addErrorToControl(currControl, errorKey);
                dupIndexes.push(currentIndex);
                find = true;
              } else {
                removeErrorFromControl(currControl, errorKey);
              }
            }
          }
        }
      }
    // console.log(formConrols);
      if (find) {
        // Set errors to whole formArray
        const dupError: ValidationErrors = { errorKey: true };
        return dupError;
      }
    }
    // Clean errors
    return null;
  }
}

