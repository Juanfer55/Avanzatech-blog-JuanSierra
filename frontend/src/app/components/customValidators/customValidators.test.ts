import { FormControl, ValidationErrors } from '@angular/forms';
import { CustomValidators } from './customValidators';

fdescribe('CustomValidators', () => {
  describe('fieldIsNotEmpty', () => {
    it('should return null if the field is not empty', () => {
      const control = new FormControl('Hello');
      const result = CustomValidators.fieldIsNotEmpty(control);
      expect(result).toBeNull();
    });

    it('should return an error object if the field is empty', () => {
      const control = new FormControl('');
      const result = CustomValidators.fieldIsNotEmpty(control);
      expect(result).toEqual({ fieldIsNotEmpty: 'Field cannot be empty' });
    });

    it('should return an error object if the field is null', () => {
      const control = new FormControl(null);
      const result = CustomValidators.fieldIsNotEmpty(control);
      expect(result).toEqual({ fieldIsNotEmpty: 'Field cannot be empty' });
    });

    it('should return an error object if the field is undefined', () => {
      const control = new FormControl(undefined);
      const result = CustomValidators.fieldIsNotEmpty(control);
      expect(result).toEqual({ fieldIsNotEmpty: 'Field cannot be empty' });
    });

    it('should return an error object if the field is whitespace', () => {
      const control = new FormControl('   ');
      const result = CustomValidators.fieldIsNotEmpty(control);
      expect(result).toEqual({ fieldIsNotEmpty: 'Field cannot be empty' });
    });
  });
});
