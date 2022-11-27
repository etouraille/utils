import {Action, createReducer, on } from "@ngrx/store";
import * as loginAction from '../actions/login-action';
import * as userAction from '../actions/user-action';

export interface State {
  logged: boolean;
  user: any;
}

export const initialState: State = {
  logged: false, user: null,
}

export const loginReducer = createReducer(
  initialState,
  on(loginAction.login,state => ({ ...state, logged: true })),
  on(loginAction.logout,state => ({ ...state, logged: false, user: null })),
  on(userAction.user, (state, {user}) => ({ ...state, user: user, logged: !!user}))
)
