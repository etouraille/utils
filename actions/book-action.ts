import {createAction, props} from '@ngrx/store';

export const increase = createAction('[Increase book]');
export const decrease = createAction('[Decrease book]');
export const set = createAction('[Set Book]', props<{quantity: number}>())
