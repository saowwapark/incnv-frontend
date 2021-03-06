import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';

import { AuthenService } from './authen.service';

@Injectable()
export class AuthenGuard implements CanActivate {
  constructor(private authService: AuthenService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.isAuthen$.pipe(
      take(1),
      tap((isAuthen: boolean) => {
        if (!isAuthen) {
          this.router.navigate(['signin']);
        }
      })
    );
  }
}
