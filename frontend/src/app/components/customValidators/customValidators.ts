import { FormControl, ValidationErrors } from "@angular/forms";

export class CustomValidators {
  static fieldIsNotEmpty(control: FormControl): ValidationErrors | null {
    const value = control.value;
    if (value === null || value === undefined || value.trim() === '') {
      return { fieldIsNotEmpty: 'Field cannot be empty' };
    }
    return null;
  }
}
