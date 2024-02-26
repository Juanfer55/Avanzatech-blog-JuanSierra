import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../services/auth.service';
import { of, throwError } from 'rxjs';
import { PostService } from '../../../services/postservice.service';

fdescribe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let postService: jasmine.SpyObj<PostService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent, RouterTestingModule, FontAwesomeModule],
      providers: [
        {
          provide: AuthService,
          useValue: jasmine.createSpyObj('AuthService', [
            'login',
          ]),
        },
        {
          provide: PostService,
          useValue: jasmine.createSpyObj('PostService', [
            'resetPostPage',
          ]),
        },
      ]

    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    postService = TestBed.inject(PostService) as jasmine.SpyObj<PostService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    spyOn(router, 'navigate');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('login() tests', () => {
    it('should call login method', () => {
      component.loginForm.setValue({
        username: 'test@gmail.com',
        password: 'test123456'
      })

      authService.login.and.returnValue(of({}));
      component.login();

      expect(authService.login).toHaveBeenCalled();
    });
    it('should navigate to home page if login was succesfull', () => {
      component.loginForm.setValue({
        username: 'test@gmail.com',
        password: 'test123456'
      })

      authService.login.and.returnValue(of({}));
      component.login();

      expect(router.navigate).toHaveBeenCalledWith(['/']);
    })
    it('sould set invalidCredentials to true if login failed', () => {
      component.loginForm.setValue({
        username: 'test@gmail.com',
        password: 'test123456'
      });

      authService.login.and.returnValue(throwError(() => {
        const error = new Error('Invalid credentials');
        (error as any).status = 400;
        return error;
      }));

      component.login();

      expect(component.invalidCredentials).toBeTrue();
    });
    it('should navigate to the server error page if server error', () => {
      component.loginForm.setValue({
        username: 'test@gmail.com',
        password: 'test123456'
      });

      authService.login.and.returnValue(throwError(() => {
        const error = new Error('Server Error');
        (error as any).status = 500;
        return error;
      }));
      component.login();

      expect(router.navigate).toHaveBeenCalledWith(['/server-error']);
    });
  });
  describe('render test', () => {
    it('should render a form', () => {
      const compiled = fixture.nativeElement;
      const form = compiled.querySelector('form');
      expect(form).toBeTruthy();
    });
    it('should render a email input', () => {
      const compiled = fixture.nativeElement;
      const emailInput = compiled.querySelector('input[type="email"]');
      expect(emailInput).toBeTruthy();
    });
    it('should render a password input', () => {
      const compiled = fixture.nativeElement;
      const passwordInput = compiled.querySelector('input[type="password"]');
      expect(passwordInput).toBeTruthy();
    });
    it('should render a submit button', () => {
      const compiled = fixture.nativeElement;
      const submitButton = compiled.querySelector('button[type="submit"]');
      expect(submitButton).toBeTruthy();
    });
    it('should render a register link', () => {
      const compiled = fixture.nativeElement;
      const registerLink = compiled.querySelector('[data-testid="register-link"]');
      expect(registerLink).toBeTruthy();
    });
    it('should render a home page link', () => {
      const compiled = fixture.nativeElement;
      const homeLink = compiled.querySelector('[data-testid="home-link"]');
      expect(homeLink).toBeTruthy();
    })
  });
});
