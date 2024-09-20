import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * passwordsMatchValidator
 * @returns AbstractControl
 */
export function passwordsMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  };
};
