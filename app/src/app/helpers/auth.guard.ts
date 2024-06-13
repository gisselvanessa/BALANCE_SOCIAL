import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private routes: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (localStorage.getItem('userJakayBalance') != null) {
      // console.log(localStorage.getItem('userJakayBalance'));
      
      return true;
    } else {
      this.routes.navigate(['/authentication/side-login'], { queryParams: { returnUrl: state.url } });
      return false;
    }
  }
}
