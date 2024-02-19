import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { UserProfileMock } from '../testing/mocks/user.mocks';

fdescribe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Login Tests', () => {
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

      const req = httpMock.expectOne('http://127.0.0.1:8000/api/auth/login/');
      expect(req.request.method).toBe('POST');
      req.flush(responseMsg);

      const sesionStorageToken = sessionStorage.getItem('avanzablog');
      expect(sesionStorageToken).toEqual('true');
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

      const req = httpMock.expectOne('http://127.0.0.1:8000/api/auth/login/');
      expect(req.request.method).toBe('POST');
      req.flush(errormsg, error);
    });
  });

  describe('Register Tests', () => {
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

      const req = httpMock.expectOne(
        'http://127.0.0.1:8000/api/auth/register/'
      );
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
        'http://127.0.0.1:8000/api/auth/register/'
      );
      expect(req.request.method).toBe('POST');
      req.flush(errormsg, error);
    });
  });

  describe('Get Profile Tests', () => {
    it('should return an Observable when succesfully get profile', (doneFn) => {
      const responseMsg = UserProfileMock();

      service.getProfile().subscribe((response: any) => {
        expect(response).toEqual(responseMsg);
        doneFn();
      });

      const req = httpMock.expectOne('http://127.0.0.1:8000/api/auth/user/');
      expect(req.request.method).toBe('GET');
      req.flush(responseMsg);
    });

    it('should return an error if user is not log in', (doneFn) => {
      const errormsg = 'Authentication credentials were not provided';
      const error = {
        status: 400,
        statusText: errormsg,
      };

      service.getProfile().subscribe({
        error: (err) => {
          expect(err.status).toEqual(error.status);
          expect(err.statusText).toEqual(error.statusText);
          doneFn();
        },
      });

      const req = httpMock.expectOne('http://127.0.0.1:8000/api/auth/user/');
      expect(req.request.method).toBe('GET');
      req.flush(errormsg, error);
    });

    it('should save the user profile and update the login status if user is logged in', () => {
      const responseMsg = UserProfileMock();
      service.getProfile().subscribe();

      const req = httpMock.expectOne('http://127.0.0.1:8000/api/auth/user/');
      expect(req.request.method).toBe('GET');
      req.flush(responseMsg);

      const userProfile = service.getUserProfile();
      const logStatus = service.getLogStatus();

      expect(userProfile).toEqual(responseMsg);
      expect(logStatus).toBe(true);
    });
  });

  describe('Logout Tests', () => {
    it('should return an Observable when succesfully logout and reset observables', (doneFn) => {
      const responseMsg = {
        succes: 'Logged out successfully',
      };

      service.logout().subscribe((response: any) => {
        expect(response).toEqual(responseMsg);
        expect(response.succes).toEqual(responseMsg.succes);
        doneFn();
      });

      const req = httpMock.expectOne('http://127.0.0.1:8000/api/auth/logout/');
      expect(req.request.method).toBe('GET');
      req.flush(responseMsg);

      const userProfile = service.getUserProfile();
      const logStatus = service.getLogStatus();
      const sesionStorageToken = sessionStorage.getItem('avanzablog');

      expect(userProfile).toEqual(null);
      expect(logStatus).toBe(false);
      expect(sesionStorageToken).toBe(null);
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

      const req = httpMock.expectOne('http://127.0.0.1:8000/api/auth/logout/');
      expect(req.request.method).toBe('GET');
      req.flush(errormsg, error);
    });
  });

  describe('Validate email Tests', () => {
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
        'http://127.0.0.1:8000/api/auth/validate-username/'
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
        'http://127.0.0.1:8000/api/auth/validate-username/'
      );

      expect(req.request.method).toBe('POST');
      req.flush(responseMsg);
    });
  });
});
