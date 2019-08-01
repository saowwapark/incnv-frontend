import {
  FormControl,
  FormArray,
  ValidatorFn,
  ValidationErrors,
  AbstractControl,
  FormGroup
} from '@angular/forms';

import { addErrorToControl,
        removeErrorFromControl,
        getControls,
        formGroup2Controls,
        getControlsHasValue,
        returnErrorKey
} from '../common/formcontrol.utils';
import { isEqual } from '../common/logic.utils';
import { turnListToLowerCase } from '../common/map.utils';

export class CustomValidators {
  public static duplicatedFieldInFormArray = (
    field: string,
    caseSensitive: boolean = false
  ): ValidatorFn => {
    return (formArray: FormArray): { [key: string]: boolean } => {
      const controls: FormControl[] = getControls(formArray, field) as FormControl[];
      const errorKey = 'duplicated';
      let find = false;
      // clear all errorKey
      controls.forEach(control => {
        removeErrorFromControl(control, errorKey);
      });
      if (controls.length > 1) {
        for (let mainIndex = 0; mainIndex < controls.length - 1; mainIndex++) {
            const mainControl = controls[mainIndex] as FormControl;
            const val: string = mainControl.value;
            const mainValue: string = caseSensitive ? val : val.toLowerCase();
            for (let currentIndex = mainIndex + 1; currentIndex < controls.length; currentIndex++) {
                const currControl = controls[currentIndex];
                const tempVal: string = currControl.value;
                const currVal: string = caseSensitive
                  ? tempVal.toLowerCase()
                  : tempVal;
                  // duplicated -> add duplicated error
                if (mainValue === currVal) {
                  addErrorToControl(mainControl, errorKey);
                  addErrorToControl(currControl, errorKey);
                  find = true;
                }
            }
        }
      }
      // Set errors to whole formArray
      return returnErrorKey(find, errorKey);
    };
  }
  public static duplicatedInList = (
    list: string[],
    errorKey: string = 'duplicated',
    caseSensitive: boolean = false,
  ): ValidatorFn => {
    return (control: FormControl): { [key: string]: boolean } => {
      let find = false;
      list = caseSensitive ? list : turnListToLowerCase(list);
      const tempVal: string = control.value;
      if (tempVal) {
        const val: string = caseSensitive
        ? tempVal
        : tempVal.toLowerCase();

        if (list.includes(val)) {
          find = true;
          addErrorToControl(control, errorKey);
        }
      }
       // Set errors to whole formArray
       return returnErrorKey(find, errorKey);
    };
  }

  public static notHaveInList = (
    list: string[],
    errorKey: string = 'notHave',
    caseSensitive: boolean = false,
  ): ValidatorFn => {
    return (control: FormControl): { [key: string]: boolean } => {
      let find = false;
      list = caseSensitive ? list : turnListToLowerCase(list);
      const tempVal: string = control.value;
      if (tempVal) {
        const val: string = caseSensitive
        ? tempVal
        : tempVal.toLowerCase();

        if (!list.includes(val)) {
          find = true;
          addErrorToControl(control, errorKey);
        }
      }
       // Set errors to whole formArray
       return returnErrorKey(find, errorKey);
    };
  }

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
                removeErrorFromControl(currControl, 'duplicated');
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


