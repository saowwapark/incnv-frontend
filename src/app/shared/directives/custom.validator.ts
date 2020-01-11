import {
  FormControl,
  ValidationErrors,
  ValidatorFn,
  FormGroup
} from '@angular/forms';

export const uIntThousandSeparatedValidator = (
  c: FormControl
): ValidationErrors | null => {
  const pattern = RegExp('^[0-9]{1,3}(,[0-9]{3})*$');
  return pattern.test(c.value)
    ? null
    : {
        validateNumberComma: {
          valid: false
        }
      };
};

export const minNumberValidator = (min: number): ValidatorFn => {
  return (c: FormControl) => {
    const num = +c.value;
    if (isNaN(num) || num < min) {
      return {
        minNumber: { valid: false }
      };
    }
    return null;
  };
};

export const maxNumberValidator = (max: number): ValidatorFn => {
  return (c: FormControl) => {
    const num = +c.value;
    if (isNaN(num) || num > max) {
      return {
        maxNumber: { valid: false }
      };
    }
    return null;
  };
};
