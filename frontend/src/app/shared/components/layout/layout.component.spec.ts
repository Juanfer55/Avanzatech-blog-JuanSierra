import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  flush,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../../../services/auth.service';
import { of, throwError } from 'rxjs';
import { LayoutComponent } from './layout.component';
import { UserProfileMock } from '../../../testing/mocks/user.mocks';
import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-subcomponent',
  template: '<div>sub component</div>',
})
export class ServerErrorStub {}

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let toast: jasmine.SpyObj<ToastrService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutComponent, RouterTestingModule],
      providers: [
        {
          provide: AuthService,
          useValue: jasmine.createSpyObj('AuthService', [
            'getProfile',
            'logout',
          ]),
        },
        {
          provide: ToastrService,
          useValue: jasmine.createSpyObj('ToastrService', ['error', 'success']),
        }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    component.isLoggedIn$ = of(false);
    component.userProfile$ = of(null);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit() tests', () => {
    it('the authService should be called when the component is initialized', () => {
      expect(authService.getProfile).toHaveBeenCalled();
    });
    it('sould set the user profile and the user logged in status', () => {
      expect(component.isLoggedIn$).toBeTruthy();
      expect(component.userProfile$).toBeTruthy();
    });
  });
  describe('logout() tests', () => {
    it('should call the authservice', fakeAsync(() => {
      spyOn(window.location, 'reload');
      authService.logout.and.returnValue(of());
      component.logout();
      tick();
      expect(authService.logout).toHaveBeenCalled();
    }));
    it('should reload the page if the logout was successfull', fakeAsync(() => {
      spyOn(window.location, 'reload');
      authService.logout.and.returnValue(of({}));
      component.logout();
      tick();
      expect(authService.logout).toHaveBeenCalled();
    }));
    describe('logout() tests', () => {
      it('should call the authservice', fakeAsync(() => {
        spyOn(window.location, 'reload');
        authService.logout.and.returnValue(of());
        component.logout();
        tick();
        expect(authService.logout).toHaveBeenCalled();
      }));

      it('should navigate to server-error page if the logout encountered a server error', fakeAsync(() => {
        const error = { status: 500 };
        authService.logout.and.returnValue(throwError(error));
        component.logout();
        expect(router.navigate).toHaveBeenCalledWith(['/server-error']);
      }));

      it('should reload the page if the logout encountered an unauthorized error', fakeAsync(() => {
        spyOn(window.location, 'reload');
        const error = { status: 401 };
        authService.logout.and.returnValue(throwError(error));
        component.logout();
        expect(authService.logout).toHaveBeenCalled();
      }));
      it('should reload the page if the logout encountered a network error', () => {
        spyOn(router, 'navigate')
        const error = { status: 0 };
        authService.logout.and.returnValue(throwError(error));
        component.logout();
        expect(authService.logout).toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalledWith(['/server-error']);
      });
    });
  });
  describe('render tests', () => {
    it('should render the header', () => {
      const header = fixture.debugElement.query(By.css('header'));
      expect(header).toBeTruthy();
    });
    it('should render the home button, the login button and the register button if the user is not logged in', () => {
      const homeButton = fixture.debugElement.query(
        By.css('[data-testid="home-button"]')
      );
      const loginButton = fixture.debugElement.query(
        By.css('[data-testid="login-button"]')
      );
      const registerButton = fixture.debugElement.query(
        By.css('[data-testid="register-button"]')
      );
      expect(homeButton).toBeTruthy();
      expect(loginButton).toBeTruthy();
      expect(registerButton).toBeTruthy();
    });
    it('should render the home button, the user username and the logout button if the user is logged in', fakeAsync(() => {
      component.isLoggedIn$ = of(true);
      component.userProfile$ = of(UserProfileMock());
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      const homeButton = fixture.debugElement.query(
        By.css('[data-testid="home-button"]')
      );
      const logoutButton = fixture.debugElement.query(
        By.css('[data-testid="logout-button"]')
      );
      const username = fixture.debugElement.query(
        By.css('[data-testid="user-username"]')
      );

      expect(homeButton).toBeTruthy();
      expect(logoutButton).toBeTruthy();
      expect(username).toBeTruthy();
    }));
    it('the log in button should have a routerlink to the login page', () => {
      const compiled = fixture.nativeElement;
      const links = compiled.querySelectorAll('[data-testid="login-button"]');

      expect(links.length).toBe(1);
      expect(links[0].getAttribute('routerlink')).toContain('/');
    });
    it('the register button should have a routerlink to the register page', () => {
      const compiled = fixture.nativeElement;
      const links = compiled.querySelectorAll(
        '[data-testid="register-button"]'
      );
      expect(links.length).toBe(1);
      expect(links[0].getAttribute('routerlink')).toContain('auth/register');
    });
    it('the home button should have a href to the home page', () => {
      const compiled = fixture.nativeElement;
      const links = compiled.querySelectorAll('[data-testid="home-button"]');
      expect(links.length).toBe(1);
      expect(links[0].getAttribute('href')).toContain('/');
    });
  });
});
