import {Action, createReducer, on } from "@ngrx/store";
import * as loginAction from '../actions/login-action';
import * as userAction from '../actions/user-action';
import * as bookAction from '../actions/book-action';
import * as paymentAction from '../actions/payment-action'

export interface State {
  logged: boolean;
  user: any;
  book: number,
  payment: boolean|null
}

export const initialState: State = {
  logged: false,
  user: null,
  book: 0,
  payment: null
}

export const loginReducer = createReducer(
  initialState,
  on(loginAction.login,state => ({ ...state, logged: true })),
  on(loginAction.logout,state => ({ ...state, logged: false, user: null })),
  on(userAction.user, (state, {user}) => ({ ...state, user: user, logged: !!user})),
  on(bookAction.set, (state, {quantity}) => ({ ...state, book: quantity})),
  on(bookAction.increase, (state) => ({ ...state, book: state.book + 1})),
  on(bookAction.decrease, (state) => ({ ...state, book: state.book - 1 })),
  on(paymentAction.available, (state) => ({ ...state, payment: true })),
  on(paymentAction.unavailable, (state) => ({ ...state, payment: false })),
)
