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

export const numberInRangeValidator = (
  min: number,
  max: number
): ValidatorFn => {
  return (c: FormControl) => {
    const num = +c.value;
    if (num > min) {
      return {
        numberInRange: { valid: false }
      };
    }
    if (num < max) {
      return {
        numberInRange: { valid: false }
      };
    }
  };
};

export const duplicationValidator = (items: any[]): ValidatorFn => {
  return (c: FormControl) => {
    for (const item of items) {
      if (c.value === item) {
        return {
          duplication: { valid: false }
        };
      }
    }
  };
};

export const duplicationKeyValidator = (): ValidatorFn => {
  return (c: FormControl) => {
    const deletionKeys = ['dup', 'duplication', 'gain'];
    if (!deletionKeys.includes(c.value)) {
      return {
        deletionKey: { valid: false }
      };
    }
  };
};

export const deletionKeyValidator = (): ValidatorFn => {
  return (c: FormControl) => {
    const deletionKeys = ['del', 'deletion', 'loss'];
    if (!deletionKeys.includes(c.value)) {
      return {
        deletionKey: { valid: false }
      };
    }
  };
};
