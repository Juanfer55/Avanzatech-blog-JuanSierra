import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { CookieService } from 'ngx-cookie-service';
import { UserProfileMock } from '../testing/mocks/user.mocks';
import { environment } from '../environments/environment.api';

fdescribe('AuthService', () => {
  let service: AuthService;
  let cookieService: CookieService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService, CookieService],
    });
    service = TestBed.inject(AuthService);
    cookieService = TestBed.inject(CookieService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    cookieService.deleteAll();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login() Tests', () => {
    it('should return an Observable when succesfully login', (doneFn) => {
      const username = 'test@test.com';
      const password = 'test123456';
      const responseMsg = {
        succes: 'Logged out successfully',
      };

      service.login(username, password).subscribe((response: any) => {
        expect(response).toEqual(responseMsg);
        expect(response.succes).toEqual(responseMsg.succes);
        doneFn();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login/`);
      expect(req.request.method).toBe('POST');
      req.flush(responseMsg);
    });

    it('It should set the authentication cookie if the login is successful', (doneFn) => {
      const username = 'test@test.com';
      const password = 'test123456';
      const responseMsg = {
        status: 200,
        success: 'Logged in successfully',
      };

      service.login(username, password).subscribe(() => {
        const sessionCookie = cookieService.get('avanzablog');
        expect(sessionCookie).toEqual('true');
        doneFn();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login/`);
      expect(req.request.method).toBe('POST');
      req.flush(responseMsg);
    });

    it('should return error on login failure', (doneFn) => {
      const username = 'test@test.com';
      const password = 'test123456';
      const errormsg = 'Invalid credentials';
      const error = {
        status: 400,
        statusText: errormsg,
      };

      service.login(username, password).subscribe({
        error: (err) => {
          expect(err.status).toEqual(error.status);
          expect(err.statusText).toEqual(error.statusText);
          doneFn();
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login/`);
      expect(req.request.method).toBe('POST');
      req.flush(errormsg, error);
    });

    it('It should not set the authentication cookie if login fails', (doneFn) => {
      const username = 'test@test.com';
      const password = 'test123456';
      const errormsg = 'Invalid credentials';
      const error = {
        status: 400,
        statusText: errormsg,
      };

      service.login(username, password).subscribe({
        error: () => {
          const sessionCookie = cookieService.get('avanzablog');
          expect(sessionCookie).toBeFalsy();
          doneFn();
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login/`);
      expect(req.request.method).toBe('POST');
      req.flush(errormsg, error);
    });

  });

  describe('register() Tests', () => {
    it('should return an Observable when succesfully register', (doneFn) => {
      const username = 'test@test.com';
      const password = 'test123456';
      const responseMsg = {
        succes: 'Registered successfully',
      };

      service.register(username, password).subscribe((response: any) => {
        expect(response).toEqual(responseMsg);
        expect(response.succes).toEqual(responseMsg.succes);
        doneFn();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/register/`);
      expect(req.request.method).toBe('POST');
      req.flush(responseMsg);
    });

    it('should return error on register failure', (doneFn) => {
      const username = 'test@test.com';
      const password = 'test123456';
      const errormsg = 'Invalid email';
      const error = {
        status: 400,
        statusText: errormsg,
      };

      service.register(username, password).subscribe({
        error: (err) => {
          expect(err.status).toEqual(error.status);
          expect(err.statusText).toEqual(error.statusText);
          doneFn();
        },
      });

      const req = httpMock.expectOne(
        `${environment.apiUrl}/auth/register/`
      );
      expect(req.request.method).toBe('POST');
      req.flush(errormsg, error);
    });
  });

  describe('getProfile() Tests', () => {
    it('should return an Observable when succesfully get profile and sesion cookie is set', (doneFn) => {
      service.setSesionCookie();
      const responseMsg = UserProfileMock();

      service.getProfile()?.subscribe((response: any) => {
        expect(response).toEqual(responseMsg);
        doneFn();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/user/`);
      expect(req.request.method).toBe('GET');
      req.flush(responseMsg);
    });

    it('should return an error if user is not log in', (doneFn) => {
      service.setSesionCookie();
      const errormsg = 'Authentication credentials were not provided';
      const error = {
        status: 400,
        statusText: errormsg,
      };

      service.getProfile()?.subscribe({
        error: (err) => {
          expect(err.status).toEqual(error.status);
          expect(err.statusText).toEqual(error.statusText);
          doneFn();
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/user/`);
      expect(req.request.method).toBe('GET');
      req.flush(errormsg, error);
    });

    it('should save the user profile and update the login status if user is logged in', () => {
      service.setSesionCookie();
      const responseMsg = UserProfileMock();
      service.getProfile()?.subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/user/`);
      expect(req.request.method).toBe('GET');
      req.flush(responseMsg);

      const userProfile = service.getUserProfile();
      const logStatus = service.getLogStatus();

      expect(userProfile).toEqual(responseMsg);
      expect(logStatus).toBe(true);
    });
  });

  describe('logout Tests', () => {
    it('should return an Observable when succesfully logout and reset observables', (doneFn) => {
      service.setSesionCookie();
      const responseMsg = {
        succes: 'Logged out successfully',
      };

      service.logout().subscribe((response: any) => {
        expect(response).toEqual(responseMsg);
        expect(response.succes).toEqual(responseMsg.succes);
        doneFn();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/logout/`);
      expect(req.request.method).toBe('GET');
      req.flush(responseMsg);

      const userProfile = service.getUserProfile();
      const logStatus = service.getLogStatus();
      const sesionCookie = cookieService.get('avanzablog');

      expect(userProfile).toEqual(null);
      expect(logStatus).toBe(false);
      expect(sesionCookie).toBeFalsy();
    });

    it('should return an error if user is not log in', (doneFn) => {
      const errormsg = 'Authentication credentials were not provided';
      const error = {
        status: 400,
        statusText: errormsg,
      };

      service.logout().subscribe({
        error: (err) => {
          expect(err.status).toEqual(error.status);
          expect(err.statusText).toEqual(error.statusText);
          doneFn();
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/logout/`);
      expect(req.request.method).toBe('GET');
      req.flush(errormsg, error);
    });
  });

  describe('validateemail() Tests', () => {
    it('should return an Observable when succesfully validate email', (doneFn) => {
      const email = 'test@test.com';
      const responseMsg = {
        IsAvailable: true,
      };

      service.validateEmail(email).subscribe((response: any) => {
        expect(response).toEqual(responseMsg);
        doneFn();
      });

      const req = httpMock.expectOne(
        `${environment.apiUrl}/auth/validate-username/`
      );
      expect(req.request.method).toBe('POST');
      req.flush(responseMsg);
    });

    it('should return an observable when unsuccesfully validate email', (doneFn) => {
      const email = 'test@test.com';
      const responseMsg = {
        IsAvailable: false,
      };

      service.validateEmail(email).subscribe((response: any) => {
        expect(response).toEqual(responseMsg);
        doneFn();
      });

      const req = httpMock.expectOne(
        `${environment.apiUrl}/auth/validate-username/`
      );

      expect(req.request.method).toBe('POST');
      req.flush(responseMsg);
    });
  });
});
