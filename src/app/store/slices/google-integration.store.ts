import { createAction, createFeatureSelector, createReducer, createSelector, on, props } from '@ngrx/store';
import { GoogleIntegrationInfo } from './../../types/google-integration.type';

export const featureKey = 'google-integration';

export const actions = {
  getAuthenticationUrl: createAction(
    '[Google Integration] Get Google Authentication URL',
    props<{ integrationInfo: GoogleIntegrationInfo }>(),
  ),
  getAuthenticationUrlSuccess: createAction(
    '[Google Integration] Get Google Authentication URL Success',
    props<{ url: string; integrationInfo: GoogleIntegrationInfo }>(),
  ),
  getAuthenticationUrlFailure: createAction(
    '[Google Integration] Get Google Authentication URL Failure',
    props<{ error: any }>(),
  ),

  googleConnect: createAction('[Google Integration] Google Connect', props<{ code: string }>()),
  googleConnectSuccess: createAction('[Google Integration] Google Connect Success'),

  googleDisconnect: createAction('[Google Integration] Google Disconnect'),
  googleDisconnectSuccess: createAction('[Google Integration] Google Disconnect Success'),
  googleDisconnectFailure: createAction('[Google Integration] Google Disconnect Failure', props<{ error: any }>()),

  syncAppointmentClient: createAction(
    '[Google Integration] Sync Appointment with Google Calendar Client',
    props<{ bookingProductId: string; code: string }>(),
  ),
  syncAppointmentClientSuccess: createAction(
    '[Google Integration] Sync Appointment with Google Calendar Client Success',
    props<{ bookingProductId: string }>(),
  ),
  syncAppointmentClientFailure: createAction(
    '[Google Integration] Sync Appointment with Google Calendar Client Failure',
    props<{ error: any }>(),
  ),
  syncVendorAppointment: createAction('[Google Integration] Save vendor '),
  redirectToGoogleFinalPopup: createAction(
    '[Google Integration] Navigate to vendor message page',
    props<{ message: string; isVendorConnectionFailed: boolean }>(),
  ),
  openWindowPopup: createAction('[Notification] Open window popup', props<{ popupName: string; popupUrl: string }>()),
  closeGooglePopup: createAction('[Notification] Close google popup'),
};

export interface State {
  getAuthenticationUrlError: string | null;
  getAuthenticationUrlPending: boolean;

  isGoogleConnected: boolean;
  googleConnectError: string | null;
  googleConnectPending: boolean;

  googleDisconnectError: null;
  googleDisconnectPending: boolean;

  syncAppointmentClientError: null;
  syncAppointmentClientPending: boolean;

  isVendorConnectionFailed: boolean;
  vendorAppointmentAdditionMessage: string;
}

export const initialState: State = {
  getAuthenticationUrlError: null,
  getAuthenticationUrlPending: false,

  isGoogleConnected: false,
  googleConnectError: null,
  googleConnectPending: false,

  googleDisconnectError: null,
  googleDisconnectPending: false,

  syncAppointmentClientError: null,
  syncAppointmentClientPending: false,
  isVendorConnectionFailed: true,
  vendorAppointmentAdditionMessage: '',
};

export const reducer = createReducer(
  initialState,
  on(actions.getAuthenticationUrl, state => ({
    ...state,
    getAuthenticationUrlError: null,
    getAuthenticationUrlPending: true,
    getAuthenticationUrlSuccess: null,
  })),
  on(actions.getAuthenticationUrlSuccess, (state, { url }) => ({
    ...state,
    getAuthenticationUrlError: null,
    getAuthenticationUrlPending: false,
    getAuthenticationUrlSuccess: url,
  })),
  on(actions.getAuthenticationUrlFailure, (state, { error }) => ({
    ...state,
    getAuthenticationUrlError: error,
    getAuthenticationUrlPending: false,
    getAuthenticationUrlSuccess: null,
  })),

  on(actions.googleConnect, state => ({
    ...state,
    googleConnectError: null,
    googleConnectPending: true,
    isGoogleConnected: false,
  })),
  on(actions.googleConnectSuccess, state => ({
    ...state,
    googleConnectError: null,
    googleConnectPending: false,
    isGoogleConnected: true,
  })),
  on(actions.googleDisconnect, state => ({
    ...state,
    googleDisconnectError: null,
    googleDisconnectPending: true,
  })),
  on(actions.googleDisconnectSuccess, state => ({
    ...state,
    googleDisconnectError: null,
    googleDisconnectPending: false,
    isGoogleConnected: false,
  })),
  on(actions.googleDisconnectFailure, (state, { error }) => ({
    ...state,
    googleDisconnectError: error,
    googleDisconnectPending: false,
  })),

  on(actions.syncAppointmentClient, state => ({
    ...state,
    syncAppointmentClientError: null,
    syncAppointmentClientPending: true,
  })),
  on(actions.syncAppointmentClientSuccess, state => ({
    ...state,
    syncAppointmentClientError: null,
    syncAppointmentClientPending: false,
  })),
  on(actions.syncAppointmentClientFailure, (state, { error }) => ({
    ...state,
    syncAppointmentClientError: error,
    syncAppointmentClientPending: false,
  })),
  on(actions.redirectToGoogleFinalPopup, (state, { message, isVendorConnectionFailed }) => ({
    ...state,
    vendorAppointmentAdditionMessage: message,
    isVendorConnectionFailed,
  })),
);

// Selectors
export const selectSlice = createFeatureSelector<State>(featureKey);

export const selectors = {
  selectAuthenticationUrlError: createSelector(selectSlice, (state: State) => state.getAuthenticationUrlError),
  selectAuthenticationUrlPending: createSelector(selectSlice, (state: State) => state.getAuthenticationUrlPending),

  selectIsGoogleConnected: createSelector(selectSlice, (state: State) => state.isGoogleConnected),

  selectGoogleConnectError: createSelector(selectSlice, (state: State) => state.googleConnectError),
  selectGoogleConnectPending: createSelector(selectSlice, (state: State) => state.googleConnectPending),

  selectGoogleDisconnectError: createSelector(selectSlice, (state: State) => state.googleDisconnectError),
  selectGoogleDisconnectPending: createSelector(selectSlice, (state: State) => state.googleDisconnectPending),

  selectSyncAppointmentClientError: createSelector(selectSlice, (state: State) => state.syncAppointmentClientError),
  selectSyncAppointmentClientPending: createSelector(selectSlice, (state: State) => state.syncAppointmentClientPending),

  selectIsVendorConnectionFailed: createSelector(selectSlice, (state: State) => state.isVendorConnectionFailed),
  selectVendorAppointmentAdditionMessage: createSelector(
    selectSlice,
    (state: State) => state.vendorAppointmentAdditionMessage,
  ),
};
