import { ConstantsService } from '../constants.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, concat } from 'rxjs';

import { AuthenReq, AuthenRes } from './authen.model';
import { map, tap, finalize } from 'rxjs/operators';
import { error } from '@angular/compiler/src/util';

@Injectable({ providedIn: 'root' })
export class AuthenService {
  private baseRouteUrl: string;

  private token: string;
  private tokenTimer: any;
  private isAuthenSubject = new BehaviorSubject<boolean>(false);
  public isAuthen$ = this.isAuthenSubject.asObservable();

  constructor(
    private _http: HttpClient,
    private _router: Router,
    private _constant: ConstantsService
  ) {
    this.baseRouteUrl = `${this._constant.baseAppUrl}/api/users`;
  }

  getToken() {
    return this.token;
  }

  addUser(email: string, password: string) {
    const authData: AuthenReq = { email: email, password: password };
    return this._http.post(`${this.baseRouteUrl}/signup`, authData);
  }

  signUp(email: string, password: string) {
    return concat(this.addUser(email, password), this.login(email, password));
  }

  createAuthData(token, expiresInDuration) {
    if (token && expiresInDuration) {
      this.setAuthTimer(expiresInDuration);
      const now = new Date();
      const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
      return { token: token, expirationDate: expirationDate };
    }
  }

  login(email: string, password: string) {
    const authReq: AuthenReq = { email: email, password: password };
    return this._http.post<any>(`${this.baseRouteUrl}/login`, authReq).pipe(
      map(res => res['payload']),
      tap((authenRes: AuthenRes) => {
        console.log('authservice');
        console.log(authenRes);
        const token = authenRes.token;
        const expiresInDuration = authenRes.expiresIn;
        const authData = this.createAuthData(token, expiresInDuration);
        this.saveAuthData(authData.token, authData.expirationDate);
        this.token = token;
        this.isAuthenSubject.next(true);
      })
    );
  }
  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.setAuthTimer(expiresIn / 1000);
      this.isAuthenSubject.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenSubject.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this._router.navigate(['/']);
  }
  /**
   * Set authentication timer and logout when token expires
   *
   * @param duration - second unit (not millisecond)
   */
  private setAuthTimer(duration: number) {
    console.log('Setting timer: ' + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate)
    };
  }
}
