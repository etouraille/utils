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
export class MemberGuard implements CanActivate {

  constructor(
    private http: HttpClient,
    private router: Router,
    private store: Store<{logged: boolean}>,
  ) {

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.store.select((data: any) => data.login.user)
      .pipe(
        map((user:any) => user?.roles?.includes('ROLE_MEMBER')
        )
      );
  }
}
