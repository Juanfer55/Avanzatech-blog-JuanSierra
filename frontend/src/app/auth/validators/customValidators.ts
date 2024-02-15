// Angular
import { AbstractControl } from '@angular/forms';
// Services
import { AuthService } from '../../services/auth.service';
// rxjs
import { map } from 'rxjs';

export class CustomValidators {
  static validateEmailAsync(service: AuthService) {
    return (control: AbstractControl) => {
      const value = control.value;
      console.log(value);
      return service.validateEmail(value).pipe(
        map((res: any) => {
          console.log(res);
          const isAvailable = res.IsAvailable;
          console.log(isAvailable);
          if (isAvailable === false) {
            return { not_available: true };
          }
          return null;
        })
      );
    };
  }

  static validateNumericPassword(control: AbstractControl) {
    const password = control.value;
    if (password.match(/^\d+$/)) {
      return { numeric_password: true };
    }
    return null;

  }

  static validadePasswords(control: AbstractControl) {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('passwordConfirm')?.value;
    if (password!== confirmPassword) {
      return { not_match: true };
    }
    return null;
  }
}
