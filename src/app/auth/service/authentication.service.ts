import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'environments/environment';
import { User, Role } from 'app/auth/models';
import { ToastrService } from 'ngx-toastr';
import { ConfirmForgotPasswordDto, ForgotPasswordDto, LoginUserDto, OtpDto, SetPasswordDto, VerifyMobileDto } from './dto/authentication-dto';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  //public
  public currentUser: Observable<User>;

  //private
  private currentUserSubject: BehaviorSubject<User>;

  /**
   *
   * @param {HttpClient} _http
   * @param {ToastrService} _toastrService
   */
  constructor(private _http: HttpClient, private _toastrService: ToastrService) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  // getter: currentUserValue
  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  /**
   *  Confirms if user is admin
   */
  get isAdmin() {
    return this.currentUser && this.currentUserSubject.value.roles.includes(Role.Admin);
  }

  /**
   *  Confirms if user is client
   */
  get isClient() {
    return this.currentUser && this.currentUserSubject.value.roles.includes('C');
  }

  verifyMobile(dto: VerifyMobileDto) {
    return this._http.post<any>(`${environment.apiCoreUrl}/user/verify-mobile`, dto).toPromise();
  }

  sendOtp(dto: OtpDto) {
    return this._http.post<any>(`${environment.apiCoreUrl}/user/otp`, dto).toPromise();
  }

  verifyOtp(dto: VerifyMobileDto) {
    return this._http.post<any>(`${environment.apiCoreUrl}/user/verify-mobile-otp`, dto).toPromise();
  }

  login(dto: LoginUserDto) {
    const code = '111111';
    return this._http
      .post<any>(`${environment.apiCoreUrl}/user/login`, dto, { observe: 'response' })
      .pipe(
        map(res => {
          console.log(res);
          const user = res.body.data;
          // login successful if there's a jwt token in the response
          if (user && user.token) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(user));
            // notify
            this.currentUserSubject.next(user);
          }

          return user;
        }, (error: HttpErrorResponse) => {
          console.log(error);
          return error;
        })
      );
  }

  refreshToken() {
    const refreshToken = this.currentUserSubject.value.refreshToken;
    return this._http
      .post<any>(`${environment.apiCoreUrl}/user/refresh-token`, { refreshToken }, { observe: 'response' })
      .pipe(
        map(res => {
          // console.log(res);
          const user = res.body.data;
          // login successful if there's a jwt token in the response
          if (user && user.token) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(user));
            // notify
            this.currentUserSubject.next(user);
          }
          return user;
        }, (error: HttpErrorResponse) => {
          console.log(error);
          return error;
        })
      );
  }

  changePassword(data) {
    return this._http.post<any>(`${environment.apiUrl}/user/change-password`, data)
  }

  forgotPassword(data: ForgotPasswordDto) {
    return this._http.post<any>(`${environment.apiUrl}/user/forgot-password`, data).toPromise()
  }

  forgotPasswordConfirm(data: ConfirmForgotPasswordDto) {
    return this._http.post<any>(`${environment.apiUrl}/user/forgot-password-confirm`, data).toPromise()
  }

  setPassword(data: SetPasswordDto) {
    return this._http.post<any>(`${environment.apiUrl}/user/set-password`, data).toPromise();
  }

  saveRegId(data) {
    return this._http.post<any>(`${environment.apiUrl}/user/save-reg-id`, data)
  }

  /**
   * User logout
   *
   */
  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    // notify
    this.currentUserSubject.next(null);
  }
}
