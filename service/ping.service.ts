import { Injectable } from '@angular/core';
import {user as setUser} from "../actions/user-action";
import {logout} from "../actions/login-action";
import {HttpClient} from "@angular/common/http";
import {Store} from "@ngrx/store";

@Injectable({
  providedIn: 'root'
})
export class PingService {

  constructor(
    private http: HttpClient,
    private store: Store<{login: any}>
  ) { }

  ping() {
    return this.http.get('api/ping').subscribe((user: any) => {
      if(user.roles) {
        this.store.dispatch(setUser({user}))
      } else {
        this.store.dispatch(logout());
      }
    })
  }
}
