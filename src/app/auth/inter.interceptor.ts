import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpParams
} from '@angular/common/http';
import { Observable, exhaustMap, of, take } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class InterInterceptor implements HttpInterceptor {

  constructor(private authSvc: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authSvc.user.pipe(
      take(1),
      exhaustMap(user => {
        if (!user || !user.token) {
          return next.handle(request);
        }

        const modifiedReq = request.clone({ params: new HttpParams().set('auth', user.token) });

        return next.handle(modifiedReq);
      })
    );
  }
}

