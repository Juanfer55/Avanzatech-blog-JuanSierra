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
  });
  describe('register test', () => {
    it('should call register method', () => {
      component.registerForm.setValue({
        username: 'test1@gmail.com',
        password: 'test123456',
        passwordConfirm: 'test123456',
      });
      const compiled = fixture.nativeElement;
      const registerButton = compiled.querySelector(
        '[data-testid="register-button"]'
      );
      authService.register.and.returnValue(of(UserProfileMock()));
      registerButton.click();
      expect(authService.register).toHaveBeenCalled();
    });
    it('should call register method with the username and password', () => {
      component.registerForm.setValue({
        username: 'test1@gmail.com',
        password: 'test123456',
        passwordConfirm: 'test123456',
      });
      authService.register.and.returnValue(of(UserProfileMock()));
      component.register();
      expect(authService.register).toHaveBeenCalled();
    });
  });
  describe('routing test', () => {
    it('should navigate to the login page', () => {
      component.registerForm.setValue({
        username: 'test1@gmail.com',
        password: 'test123456',
        passwordConfirm: 'test123456',
      });
      authService.register.and.returnValue(of(UserProfileMock()));
      component.register();
      expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
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
  });
});
