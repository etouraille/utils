import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {catchError, map, Observable, of, tap} from 'rxjs';
import {HttpClient} from "@angular/common/http";
import {Store} from "@ngrx/store";
import {login, logout} from "../actions/login-action";
import { user as setUser} from "../actions/user-action"

@Injectable({
  providedIn: 'root'
})
export class LoggedGuard implements CanActivate {

  constructor(
    private http: HttpClient,
    private router: Router,
    private store: Store<{logged: boolean}>,
  ) {

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.http.get('api/ping').pipe(
      tap((user:any) => {
        if(!user.roles) {
          this.router.navigate(['login'])
        } else {
          this.store.dispatch(setUser({user}))
        }
      }),
      catchError((error: any) => {
        this.router.navigate(['login'])
        return of(false);
      }),
      map((user:any) => {
        let ret = !!user.roles;
        if(ret) {
          this.store.dispatch(login());
        } else {
          this.store.dispatch(logout());
        }
        return ret;
      })
    );
  }

}
