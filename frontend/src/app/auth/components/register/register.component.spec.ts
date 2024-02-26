import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { UserProfileMock } from '../../../testing/mocks/user.mocks';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let toast: jasmine.SpyObj<ToastrService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComponent, RouterTestingModule, ReactiveFormsModule],
      providers: [
        {
          provide: AuthService,
          useValue: jasmine.createSpyObj('AuthService', [
            'register',
            'validateEmail',
          ]),
        },
        {
          provide: ToastrService,
          useValue: {
            success: jasmine.createSpy(),
            error: jasmine.createSpy(),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    toast = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    authService.validateEmail.and.returnValue(of(false));
    spyOn(router, 'navigate');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('form test', () => {
    it('should create a form', () => {
      expect(component.registerForm).toBeTruthy();
    });
    it('should have a username input', () => {
      expect(component.registerForm.get('username')).toBeTruthy();
    });
    it('should have a password input', () => {
      expect(component.registerForm.get('password')).toBeTruthy();
    });
    it('should have a password confirm input', () => {
      expect(component.registerForm.get('passwordConfirm')).toBeTruthy();
    });
    it('should set title as valid', () => {
      component.registerForm.get('username')?.setValue('test@gmail.com');
      expect(component.registerForm.get('username')?.valid).toBeTruthy();
    });
    it('should set title as invalid if empty', () => {
      component.registerForm.get('username')?.setValue('');
      expect(component.registerForm.get('username')?.invalid).toBeTruthy();
      expect(
        component.registerForm.get('username')?.errors?.['required']
      ).toBeTruthy();
    });
    it('should set title as invalid if incorrect format', () => {
      component.registerForm.get('username')?.setValue('test');
      expect(component.registerForm.get('username')?.invalid).toBeTruthy();
      expect(
        component.registerForm.get('username')?.errors?.['email']
      ).toBeTruthy();
    });
    it('should set password as valid', () => {
      component.registerForm.get('password')?.setValue('test123456');
      expect(component.registerForm.get('password')?.valid).toBeTruthy();
    });
    it('should set password as invalid if empty', () => {
      component.registerForm.get('password')?.setValue('');
      expect(component.registerForm.get('password')?.invalid).toBeTruthy();
      expect(
        component.registerForm.get('password')?.errors?.['required']
      ).toBeTruthy();
    });
    it('should set password as invalid if less than 8 characters', () => {
      component.registerForm.get('password')?.setValue('test');
      expect(component.registerForm.get('password')?.invalid).toBeTruthy();
      expect(
        component.registerForm.get('password')?.errors?.['minlength']
      ).toBeTruthy();
    });
    it('should set password as invalid if it is all numeric', () => {
      component.registerForm.get('password')?.setValue('12345678');
      expect(component.registerForm.get('password')?.invalid).toBeTruthy();
      expect(
        component.registerForm.get('password')?.errors?.['numeric_password']
      ).toBeTruthy();
    });
    it('should set password confirm as valid', () => {
      component.registerForm.get('passwordConfirm')?.setValue('test123456');
      expect(component.registerForm.get('passwordConfirm')?.valid).toBeTruthy();
    });
    it('should set password confirm as invalid if empty', () => {
      component.registerForm.get('passwordConfirm')?.setValue('');
      expect(
        component.registerForm.get('passwordConfirm')?.invalid
      ).toBeTruthy();
      expect(
        component.registerForm.get('passwordConfirm')?.errors?.['required']
      ).toBeTruthy();
    });
    it('should set the form as valid if all fields are valid and passwords match', () => {
      component.registerForm.setValue({
        username: 'test@gmail.com',
        password: 'test123456',
        passwordConfirm: 'test123456',
      });

      expect(component.registerForm.valid).toBeTruthy();
    });
    it('should set the form as invalid if the passwords do not match', () => {
      component.registerForm.setValue({
        username: 'test@gmail.com',
        password: 'test123456',
        passwordConfirm: 'test1234567',
      });

      expect(component.registerForm.invalid).toBeTruthy();
    });
  });
  describe('register() test', () => {
    it('should call authservice', () => {
      component.registerForm.setValue({
        username: 'test1@gmail.com',
        password: 'test123456',
        passwordConfirm: 'test123456',
      });
      authService.register.and.returnValue(of(UserProfileMock()));
      component.register();
      expect(authService.register).toHaveBeenCalled();
    });
    it('should navigate to the login page if success', () => {
      component.registerForm.setValue({
        username: 'test1@gmail.com',
        password: 'test123456',
        passwordConfirm: 'test123456',
      });
      authService.register.and.returnValue(of(UserProfileMock()));
      component.register();
      expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
    });
    it('should call toast success if success', () => {
      component.registerForm.setValue({
        username: 'test@gmail.com',
        password: 'test123456',
        passwordConfirm: 'test123456',
      });
      authService.register.and.returnValue(of(UserProfileMock()));
      component.register();
      expect(toast.success).toHaveBeenCalled();
    });
    it('should call toast error if error', () => {
      component.registerForm.setValue({
        username: 'test@gmail.com',
        password: 'test123456',
        passwordConfirm: 'test123456',
      });

      authService.register.and.returnValue(throwError(() => {
          const error = new Error('Server Error');
          (error as any).status = 500;
          return error;
        })
      );

      component.register();

      expect(toast.error).toHaveBeenCalled();
    });
    it('if the auth service throws an error, should navigate to the server error page', () => {
      component.registerForm.setValue({
        username: 'test1@gmail.com',
        password: 'test123456',
        passwordConfirm: 'test123456',
      });
      authService.register.and.returnValue(
        throwError(() => {
          const error = new Error('Server Error');
          (error as any).status = 500;
          return error;
        })
      );
      component.register();
      expect(router.navigate).toHaveBeenCalledWith(['/server-error']);
    });
    it('should mark all form fields as touched', () => {
      component.register();
      expect(component.registerForm.get('username')?.touched).toBeTrue();
      expect(component.registerForm.get('password')?.touched).toBeTrue();
      expect(component.registerForm.get('passwordConfirm')?.touched).toBeTrue();
    });
  });
  describe('render test', () => {
    it('should render a form', () => {
      const compiled = fixture.nativeElement;
      const form = compiled.querySelector('form');
      expect(form).toBeTruthy();
    });
    it('should render a form with a username input', () => {
      const compiled = fixture.nativeElement;
      const usernameInput = compiled.querySelector(
        '[data-testid="username-input"]'
      );
      expect(usernameInput).toBeTruthy();
    });
    it('should render a form with a password input', () => {
      const compiled = fixture.nativeElement;
      const passwordInput = compiled.querySelector(
        '[data-testid="password-input"]'
      );
      expect(passwordInput).toBeTruthy();
    });
    it('should render a form with a confirm password input', () => {
      const compiled = fixture.nativeElement;
      const confirmPasswordInput = compiled.querySelector(
        '[data-testid="confirm-password-input"]'
      );
      expect(confirmPasswordInput).toBeTruthy();
    });
    it('should render a form with a register button', () => {
      const compiled = fixture.nativeElement;
      const registerButton = compiled.querySelector(
        '[data-testid="register-button"]'
      );
      expect(registerButton).toBeTruthy();
    });
    it('should have a link to the home page', () => {
      const compiled = fixture.nativeElement;
      const homeLink = compiled.querySelector('a[data-testid="home-link"]');

      expect(homeLink).toBeTruthy();
      expect(homeLink.getAttribute('href')).toEqual('/');
    });
    it('should have a link to the login page', () => {
      const compiled = fixture.nativeElement;
      const loginLink = compiled.querySelector('a[data-testid="login-link"]');

      expect(loginLink).toBeTruthy();
      expect(loginLink.getAttribute('href')).toEqual('/auth/login');
    });
  });
});
