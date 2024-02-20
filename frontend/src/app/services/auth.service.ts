// angular
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// interfaces
import { User, UserProfile } from '../models/user.model';
// environment
import { environment } from '../environments/environment.api';
// rxjs
import { BehaviorSubject, tap } from 'rxjs';
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
    return this.http.post(
        `${this.apiUrl}/auth/login/`,
        {
          username: username,
          password: password,
        },
        { withCredentials: true }
      )
      .pipe(
        tap(() => {
          const expirationDate = new Date();
          expirationDate.setDate(expirationDate.getDate() + 1)
          this.cookieService.set('avanzablog', 'true', {
            expires: expirationDate,
          });
        })
      );
  }

  register(username: string, password: string) {
    return this.http.post<User>(
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
          this.userProfileSubject.next(profile);
          this.logStatusSubject.next(true);
        })
      );
    }
    return
  }

  logout() {
    return this.http
      .get(`${this.apiUrl}/auth/logout/`, {
        withCredentials: true,
      })
      .pipe(
        tap(() => {
          this.cookieService.delete('avanzablog');
          this.userProfileSubject.next(null);
          this.logStatusSubject.next(false);
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

  getUserProfile(): UserProfile | null {
    return this.userProfileSubject.value;
  }

  getLogStatus(): boolean {
    return this.logStatusSubject.value;
  }
}
