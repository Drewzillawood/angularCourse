import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, tap} from 'rxjs/operators';
import {BehaviorSubject, throwError} from 'rxjs';
import {User} from './user.model';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({providedIn: 'root'})
export class AuthService {
  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient,
              private router: Router) {}

  signUpUrl: string = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`;
  loginUrl: string = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`;

  private static handleError(errorRes: HttpErrorResponse) {

    let errorMessage = 'An unknown error occurred!';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }

    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email exists already.';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email does not exist.';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'This password is not correct.';
    }

    return throwError(errorMessage);
  }

  signup(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      this.signUpUrl,
      {
        email,
        password,
        returnSecureToken: true
      }
    ).pipe(catchError(AuthService.handleError),
      tap(resData => {
          this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
        }
      ));
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      this.loginUrl,
      {
        email,
        password,
        returnSecureToken: true
      }
    ).pipe(catchError(AuthService.handleError),
      tap(resData => {
          this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
        }
      ));
  }

  autoLogin() {
    const userData: User = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }

    if (!userData.token) {
      this.user.next(userData);
      this.autoLogout(new Date(userData.tokenExpirationDate).getTime() - new Date().getTime());
    }
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, expirationDate, token);
    this.user.next(user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }
}
