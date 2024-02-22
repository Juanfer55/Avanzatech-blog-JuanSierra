// angular
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  flush,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
// services
import { AuthService } from '../../../services/auth.service';
// rxjs
import { of } from 'rxjs';

import { LayoutComponent } from './layout.component';
import { UserProfileMock } from '../../../testing/mocks/user.mocks';

fdescribe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;
  let authService: jasmine.SpyObj<AuthService>;

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
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    fixture.detectChanges();

    component.isLoggedIn$ = of(false);
    component.userProfile$ = of(null);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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
    })
    it('if the logout button has not been clicked, the logout pop-up window will not be displayed.', fakeAsync(() => {
      component.isLoggedIn$ = of(true);
      component.userProfile$ = of(UserProfileMock());
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      const compiled = fixture.nativeElement;
      const logoutPopup = compiled.querySelector('[data-testid="logout-popup"]');
      expect(logoutPopup).toBeFalsy();
    }));
    it('if the log out button is pressed, the logout popup should be shown',  fakeAsync(() => {
      component.isLoggedIn$ = of(true);
      component.userProfile$ = of(UserProfileMock());
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      const compiled = fixture.nativeElement;
      const logoutButton = compiled.querySelector('[data-testid="logout-button"]');
      logoutButton.click();
      fixture.detectChanges();
      const logoutPopup = compiled.querySelector('[data-testid="logout-popup"]');
      expect(logoutPopup).toBeTruthy();
    }));
  });
  describe('behaviour tests', () => {
    it('the showLogoutPopup should be false by default', () => {
      expect(component.showLogoutPopup).toBeFalsy();
    });

    it('the showLogoutPopup should be true when the logout button is pressed', () => {
      component.isLoggedIn$ = of(true);
      component.userProfile$ = of(UserProfileMock());
      fixture.detectChanges();
      const compiled = fixture.nativeElement;
      const logoutButton = compiled.querySelector(
        '[data-testid="logout-button"]'
      );
      logoutButton.click();
      fixture.detectChanges();
      expect(component.showLogoutPopup).toBeTruthy();
    });

    it('the showLogoutPopup should be false when the cancel button in the log out popup is pressed', () => {
      component.isLoggedIn$ = of(true);
      component.userProfile$ = of(UserProfileMock());
      fixture.detectChanges();
      const compiled = fixture.nativeElement;
      const logoutButton = compiled.querySelector(
        '[data-testid="logout-button"]'
      );
      logoutButton.click();
      fixture.detectChanges();
      const cancelButton = compiled.querySelector(
        '[data-testid="cancel-button"]'
      );
      cancelButton.click();
      fixture.detectChanges();
      expect(component.showLogoutPopup).toBeFalsy();
    });

    it('the authService should be called when the component is initialized', fakeAsync(() => {
      component.isLoggedIn$ = of(true);
      component.userProfile$ = of(UserProfileMock());
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      expect(authService.getProfile).toHaveBeenCalled();
    }));
  });
});
