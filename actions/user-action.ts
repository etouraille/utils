import {createAction, props} from '@ngrx/store';

export const user = createAction('[User]', props<{user: any}>());
