import { createReducer, on, createAction, props, createFeatureSelector, createSelector } from '@ngrx/store';
import { TimeZone } from '../../types/timezone.type';

export const featureKey = 'timezone-api';

export interface State {
  timeZones: TimeZone[];
  timeZonesError: any;
  timeZonesPending: boolean;
}

export const initialState: State = {
  timeZones: [],
  timeZonesError: null,
  timeZonesPending: false,
};

export const actions = {
  getTimeZones: createAction('[TimeZone] API/Get Time Zones'),
  getTimeZonesSuccess: createAction('[TimeZone] API/Save Time Zone Success', props<{ timeZones: TimeZone[] }>()),
  getTimeZonesFailure: createAction('[TimeZone] API/Save Time Zone Failure', props<{ error: any }>()),
};

export const reducer = createReducer(
  initialState,
  on(actions.getTimeZones, state => ({ ...state, timeZonesPending: true, timeZonesError: null })),
  on(actions.getTimeZonesSuccess, (state, { timeZones }) => ({
    ...state,
    timeZones: timeZones,
    timeZonesPending: false,
    timeZonesError: null,
  })),
  on(actions.getTimeZonesFailure, (state, { error }) => ({ ...state, timeZonesError: error, timeZonesPending: false })),
);

export const selectSlice = createFeatureSelector<State>(featureKey);

export const selectors = {
  selectTimeZones: createSelector(selectSlice, (state: State) => state.timeZones),
  selectTimeZonesPending: createSelector(selectSlice, (state: State) => state.timeZonesPending),
  selectTimeZonesError: createSelector(selectSlice, (state: State) => state.timeZonesError),
};
