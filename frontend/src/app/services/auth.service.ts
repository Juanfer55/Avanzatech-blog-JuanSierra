// angular
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
// interfaces
import { User } from '../models/user.model';
// environment
import { environment } from '../environments/environment.api';
// rxjs
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  private userProfileSubject: BehaviorSubject<User | null> =
    new BehaviorSubject<User | null>(null);
  userProfile$: Observable<User | null> =
    this.userProfileSubject.asObservable();

  private logStatusSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  logStatus$: Observable<boolean> = this.logStatusSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
    ) {}

  login(username: string, password: string) {
    return this.http
      .post(
        `${this.apiUrl}/auth/login/`,
        {
          username: username,
          password: password,
        },
        { withCredentials: true }
      );
  }

  register(username: string, password: string) {
    return this.http
      .post<User>(
        `${this.apiUrl}/auth/register/`,
        {
          username: username,
          password: password,
        },
        { withCredentials: true }
      );
  }

  getProfile() {
    return this.http
      .get<User>(`${this.apiUrl}/auth/user/`, {
        withCredentials: true,
      })
      .pipe(
        tap((profile: User) => {
          this.userProfileSubject.next(profile);
          this.logStatusSubject.next(true);
        }),
      );
  }

  logout() {
    return this.http.get(`${this.apiUrl}/auth/logout/`, {
      withCredentials: true,
    }).pipe(
      tap(() => {
        sessionStorage.removeItem('avanzablog');
        this.userProfileSubject.next(null);
        this.logStatusSubject.next(false);
      })
    )
  }

  validateEmail(email: string) {
    return this.http.post(
      `${this.apiUrl}/auth/validate-username/`,
      { username: email },
      { withCredentials: true }
    );
  }
}
