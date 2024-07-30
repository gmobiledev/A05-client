import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, finalize, switchMap, take } from 'rxjs/operators';

import { AuthenticationService } from 'app/auth/service';
import { environment } from 'environments/environment';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  
  isRefreshingToken: boolean = false;
  tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  /**
   * @param {Router} _router
   * @param {AuthenticationService} _authenticationService
   */
  constructor(
    private _router: Router, 
    private _authenticationService: AuthenticationService,
    ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log("intercept--requ")
    console.log(request);
    // return next.handle(this.addToken(request, this._authenticationService?.currentUserValue?.token)).pipe(
      return next.handle(request).pipe(
      catchError(err => {   
        console.log("ERRRRRR");
        console.log(err);     
        const mUrl = new URL(request.url);
        if(['/api/admin/login'].indexOf(mUrl.pathname) == -1) {
          if ([401].indexOf(err.status) !== -1) {
            this.handle401Error(request, next);

          } else if (err.status == 403) {
            this._router.navigate(['/pages/miscellaneous/not-authorized']);
          }
        }        
        // throwError
        const error = err.error.message || err.statusText;
        return throwError(error);
      })
    );
  }

  handle401Error(req: HttpRequest<any>, next: HttpHandler) {
      if (!this.isRefreshingToken) {
          this.isRefreshingToken = true;

          // Reset here so that the following requests wait until the token
          // comes back from the refreshToken call.
          this.tokenSubject.next(null);

          return this._authenticationService.refreshToken()
              .pipe(
                finalize(() => this.isRefreshingToken = false),
              )
              .subscribe((res) => {
                
                  if (res && res.token) {
                      console.log("Ressssxsxs");
                      console.log(res);
                      this.tokenSubject.next(res.token);
                      console.log("next---req");
                      console.log(this.addToken(req, res.token));
                      // return next.handle(this.addToken(req, res.token));
                      return next.handle(req);
                  }

                  localStorage.removeItem("menu_services");
                  localStorage.removeItem("menu_others");
                  this._router.navigate(['/auth/login']);
              },
              
              error => {
                localStorage.removeItem("menu_services");
                localStorage.removeItem("menu_others");
                this._router.navigate(['/auth/login']);
              },              
            )
      } else {
          this.tokenSubject.pipe(filter(token => token != null)
          , take(1)
          , switchMap(token => {
              console.log("this.tokenSubject.getValue()");
            console.log(token);
              // return next.handle(this.addToken(req, token));
              return next.handle(req);
              })
          );    
      }
    }

    addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
      const currentUser = this._authenticationService.currentUserValue;
      const isLoggedIn = currentUser && currentUser.token;
      const isApiUrl = req.url.startsWith(environment.apiUrl);
      if (isLoggedIn && isApiUrl) {
        req = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
      }
      return req;
    }
}
