import { createReducer, on, createAction, createFeatureSelector, createSelector, props } from '@ngrx/store';

export const featureKey = 'notification';

export interface State {
  snackBarMessage: string;
}

export const actions = {
  callSnackBarPopup: createAction('[SnackBar] call', props<{ snackBarMessage: string }>()),
};

const initialState: State = {
  snackBarMessage: '',
};

export const reducer = createReducer(
  initialState,
  on(actions.callSnackBarPopup, (state, { snackBarMessage }) => ({ ...state, snackBarMessage })),
);

export const selectSlice = createFeatureSelector<State>(featureKey);

export const selectors = {
  selectSnackBarMessage: createSelector(selectSlice, (state: State) => state.snackBarMessage),
};
