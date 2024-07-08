import { createAction, createFeatureSelector, createReducer, createSelector, on, props } from '@ngrx/store';
import { BreakPoint } from 'src/app/types/misc.type';

export const featureKey = 'viewBreakPoint';

export interface State {
  breakPoint: BreakPoint;
}

export const actions = {
  setBreakPoint: createAction('[View Break Point] Set Break Point', props<{ breakPoint: BreakPoint }>()),
};

export const initialState: State = {
  breakPoint: 'undefined',
};

export const reducer = createReducer(
  initialState,
  on(actions.setBreakPoint, (state, { breakPoint }) => ({ ...state, breakPoint })),
);

// Selectors
const selectSlice = createFeatureSelector<State>(featureKey);

const selectIsXSmallView = createSelector(selectSlice, (state: State) => state.breakPoint === 'xsmall');
const selectIsSmallView = createSelector(selectSlice, (state: State) => state.breakPoint === 'small');
const selectIsMobileView = createSelector(
  selectSlice,
  (state: State) => state.breakPoint === 'small' || state.breakPoint === 'xsmall',
);
const selectIsMediumView = createSelector(selectSlice, (state: State) => state.breakPoint === 'medium');
const selectIsLargeView = createSelector(selectSlice, (state: State) => state.breakPoint === 'large');
const selectIsXLargeView = createSelector(selectSlice, (state: State) => state.breakPoint === 'xlarge');

export const selectors = {
  selectIsXSmallView,
  selectIsSmallView,
  selectIsMobileView,
  selectIsMediumView,
  selectIsLargeView,
  selectIsXLargeView,
};
