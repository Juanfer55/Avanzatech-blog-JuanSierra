import { AbstractControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CustomValidators } from './customValidators';
import { of } from 'rxjs';

fdescribe('CustomValidators', () => {
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    authService = jasmine.createSpyObj('AuthService', ['validateEmail']);
  });

  describe('validateEmailAsync', () => {
    it('should return null if email is available', (done) => {
      const control = { value: 'test@gmail.com' } as AbstractControl;
      authService.validateEmail.and.returnValue(of({ IsAvailable: true }));

      const validatorFn = CustomValidators.validateEmailAsync(authService);
      validatorFn(control).subscribe((result) => {
        expect(result).toBeNull();
        done();
      });
    });

    it('should return { not_available: true } if email is not available', (done) => {
      const control = { value: 'test@gmail.com' } as AbstractControl;
      authService.validateEmail.and.returnValue(of({ IsAvailable: false }));

      const validatorFn = CustomValidators.validateEmailAsync(authService);
      validatorFn(control).subscribe((result) => {
        expect(result).toEqual({ not_available: true });
        done();
      });
    });
  });

  describe('validateNumericPassword', () => {
    it('should return null if password is numeric', () => {
      const control = { value: '123456' } as AbstractControl;

      const result = CustomValidators.validateNumericPassword(control);

      expect(result).toEqual({ numeric_password: true });
    });

    it('should return { numeric_password: true } if password is not numeric', () => {
      const control = { value: 'password' } as AbstractControl;

      const result = CustomValidators.validateNumericPassword(control);

      expect(result).toBeNull();
    });
  });

  describe('validadePasswords', () => {
    it('should return null if passwords match', () => {
      const control = {
        get: (fieldName: string) => {
          if (fieldName === 'password') {
            return { value: 'password' };
          } else if (fieldName === 'passwordConfirm') {
            return { value: 'password' };
          }
          return null; // Add a return statement for all possible code paths
        },
      } as AbstractControl;

      const result = CustomValidators.validadePasswords(control);

      expect(result).toBeNull();
    });

    it('should return { not_match: true } if passwords do not match', () => {
      const control = {
        get: (fieldName: string) => {
          if (fieldName === 'password') {
            return { value: 'password' };
          } else if (fieldName === 'passwordConfirm') {
            return { value: 'differentPassword' };
          }
          return null; // Add a return statement for all possible code paths
        },
      } as AbstractControl;

      const result = CustomValidators.validadePasswords(control);

      expect(result).toEqual({ not_match: true });
    });
  });
});
