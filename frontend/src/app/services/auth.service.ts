// angular
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// interfaces
import { User, UserProfile } from '../models/user.model';
// environment
import { environment } from '../environments/environment.api';
// rxjs
import { BehaviorSubject, of, tap } from 'rxjs';
// cookie service
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  protected userProfileSubject: BehaviorSubject<UserProfile | null> =
    new BehaviorSubject<UserProfile | null>(null);
  public userProfile$ = this.userProfileSubject.asObservable();

  protected logStatusSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  public logStatus$ = this.logStatusSubject.asObservable();

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  login(username: string, password: string) {
    return this.http
      .post(
        `${this.apiUrl}/auth/login/`,
        {
          username: username,
          password: password,
        },
        { withCredentials: true }
      )
      .pipe(
        tap(() => {
          this.setSesionCookie();
        })
      );
  }

  register(username: string, password: string) {
    return this.http.post<UserProfile>(
      `${this.apiUrl}/auth/register/`,
      {
        username: username,
        password: password,
      },
      { withCredentials: true }
    );
  }

  getProfile() {
    const avanzatechCookie = this.cookieService.get('avanzablog');
    if (avanzatechCookie) {
      return this.http
        .get<UserProfile>(`${this.apiUrl}/auth/user/`, {
          withCredentials: true,
        })
        .pipe(
          tap((profile) => {
            this.setUserProfile(profile);
          })
        );
    }
    return null;
  }

  logout() {
    return this.http
      .get(`${this.apiUrl}/auth/logout/`, {
        withCredentials: true,
      })
      .pipe(
        tap(() => {
          this.deleteSesionCookie();
          this.deleteUserProfile();
        })
      );
  }

  validateEmail(email: string) {
    return this.http.post(
      `${this.apiUrl}/auth/validate-username/`,
      { username: email },
      { withCredentials: true }
    );
  }

  setSesionCookie() {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 1);
    this.cookieService.set('avanzablog', 'true', {
      expires: expirationDate,
    });
  }

  deleteSesionCookie() {
    this.cookieService.delete('avanzablog');
  }

  setUserProfile(profile: UserProfile) {
    this.userProfileSubject.next(profile);
    this.logStatusSubject.next(true);
  }

  deleteUserProfile() {
    this.userProfileSubject.next(null);
    this.logStatusSubject.next(false);
  }

  getUserProfile(): UserProfile | null {
    return this.userProfileSubject.value;
  }

  getLogStatus(): boolean {
    return this.logStatusSubject.value;
  }
}
