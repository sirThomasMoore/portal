import { Injectable } from '@angular/core';
import { Router, RouterStateSnapshot, ActivatedRouteSnapshot, CanActivate, UrlTree } from '@angular/router';
import { Observable, throwError } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { take, catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RegistrationGuardService implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const result = this.authService.getHasUsers();
      if (result && result.hasUsers) {
        this.router.navigate(['/login']);
        return false;
      } else {
        return this.authService.usersRegistered().pipe(map(hasUsers => {
          if (!hasUsers) {
            return true;
          }
          this.router.navigate(['/login']);
          return false;
        }), catchError((err: Response) => {
          // handle the error by throwing statusText into the console
          return throwError(err.statusText);
        }), take(1));
      }
  }
}
