import { createAction, createFeatureSelector, createReducer, createSelector, on, props } from '@ngrx/store';
import { CalendarDayDetails } from 'src/app/types/vendor.types';

export const featureKey = 'vendor-calendar';

export interface State {
  firstDayOfMonth: string;
  daysWithEventsData: CalendarDayDetails[];
  errorMessage: string;
  pending: boolean;
}

export const initialState: State = {
  firstDayOfMonth: '',
  daysWithEventsData: [],
  errorMessage: '',
  pending: false,
};

export const actions = {
  populateInitialCalendarDays: createAction('[Vendor Calendar] Populate Initial Calendar Days'),
  setDaysWithEventsDataSuccess: createAction(
    '[Vendor Calendar] Set Days With Events Data Success',
    props<{ daysWithEventsData: CalendarDayDetails[] }>(),
  ),
  getPrevMonth: createAction('[Vendor Calendar] Get Previous Month'),
  getNextMonth: createAction('[Vendor Calendar] Get Next Month'),
  setFirstDayOfMonth: createAction('[Vendor Calendar] Set First Day Of Month'),
  setFirstDayOfMonthSuccess: createAction(
    '[Vendor Calendar] Set First Day Of Month Success',
    props<{ firstDayOfMonth: string }>(),
  ),
  setErrorMessage: createAction('[Vendor] Set Calendar Error Messages', props<{ ErrorMessage: string }>()),
};

export const reducer = createReducer(
  initialState,
  on(actions.populateInitialCalendarDays, state => ({ ...state, pending: true })),
  on(actions.setDaysWithEventsDataSuccess, (state, { daysWithEventsData }) => ({
    ...state,
    daysWithEventsData,
    pending: false,
  })),
  on(actions.setFirstDayOfMonth, state => ({ ...state, pending: true })),
  on(actions.getPrevMonth, state => ({ ...state, pending: true })),
  on(actions.getNextMonth, state => ({ ...state, pending: true })),
  on(actions.setFirstDayOfMonthSuccess, (state, { firstDayOfMonth }) => ({
    ...state,
    firstDayOfMonth,
    pending: false,
  })),
  on(actions.setErrorMessage, (state, { ErrorMessage }) => ({
    ...state,
    errorMessage: ErrorMessage,
    pending: false,
  })),
);

export const selectSlice = createFeatureSelector<State>(featureKey);

export const selectors = {
  selectDaysWithEventsData: createSelector(selectSlice, (state: State) => state.daysWithEventsData),
  selectFirstDayOfMonth: createSelector(selectSlice, (state: State) => state.firstDayOfMonth),
  selectPending: createSelector(selectSlice, (state: State) => state.pending),
};
