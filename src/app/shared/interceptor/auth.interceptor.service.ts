import { Injectable } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocalEnum } from './../common/local.enum';
import { NO_AUTHORIZATION_TOKEN } from '../common/util';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem(LocalEnum.authToken);

    if (!token) {
      return next.handle(req);
    }

    if (req.headers.get(NO_AUTHORIZATION_TOKEN)) {
      return next.handle(req.clone({ headers: req.headers.delete('Authorization') }));
    }
    const req1 = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });

    return next.handle(req1);
  }
}
export const authInterceptorProvider = [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }];
