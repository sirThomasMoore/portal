import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router, RouterStateSnapshot, ActivatedRouteSnapshot, CanActivate, UrlTree } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { map, catchError, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginGuardService implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const result = this.authService.getHasUsers();
      if (result && result.hasUsers && this.authService.isLoggedIn()) {
        this.router.navigate(['/dashboard']);
        return false;
      } else {
        return this.authService.usersRegistered().pipe(map(hasUsers => {
          if (this.authService.isLoggedIn()) {
            this.router.navigate(['/dashboard']);
            return false;
          }
          if (hasUsers) {
            return true;
          }
          this.router.navigate(['/register']);
          return false;
        }), catchError((error: Response) => {
          // handle the error by throwing statusText into the console
          return throwError(error.statusText);
        }), take(1));
      }
  }
}
