import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const currentUser = JSON.parse(localStorage.getItem('authPacket'));
    if (currentUser && currentUser.jwt) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${currentUser.jwt}`
        }
      });
    }

    return next.handle(request);
  }


}
