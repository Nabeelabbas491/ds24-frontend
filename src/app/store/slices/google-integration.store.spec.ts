import { GoogleIntegrationInfo } from 'src/app/types/google-integration.type';
import { State, actions, initialState, reducer, selectors } from './google-integration.store';

describe('Google Integration Reducer', () => {
  it('should handle getAuthenticationUrl action', () => {
    const state: State = {
      ...initialState,
      getAuthenticationUrlError: null,
      getAuthenticationUrlPending: false,
    };

    const integrationInfo: GoogleIntegrationInfo = {
      integrationMode: 'client-booking',
      bookingProductId: 'zyx',
    };

    const newState = reducer(state, actions.getAuthenticationUrl({ integrationInfo }));
    expect(newState.getAuthenticationUrlError).toEqual(null);
    expect(newState.getAuthenticationUrlPending).toEqual(true);
  });
  it('should handle getAuthenticationUrlSuccess action', () => {
    const state: State = {
      ...initialState,
      getAuthenticationUrlError: null,
      getAuthenticationUrlPending: false,
    };

    const integrationInfo: GoogleIntegrationInfo = {
      integrationMode: 'client-booking',
      bookingProductId: 'zyx',
    };

    const newState = reducer(state, actions.getAuthenticationUrlSuccess({ url: 'test', integrationInfo }));
    expect(newState.getAuthenticationUrlError).toEqual(null);
    expect(newState.getAuthenticationUrlPending).toEqual(false);
  });
  it('should handle getAuthenticationUrlFailure action', () => {
    const errorMessage = 'test error';
    const state: State = {
      ...initialState,
      getAuthenticationUrlError: null,
      getAuthenticationUrlPending: false,
    };
    const newState = reducer(state, actions.getAuthenticationUrlFailure({ error: errorMessage }));
    expect(newState.getAuthenticationUrlError).toEqual(errorMessage);
    expect(newState.getAuthenticationUrlPending).toEqual(false);
  });

  it('should handle googleConnect action', () => {
    const state: State = {
      ...initialState,
      isGoogleConnected: false,
      googleConnectError: null,
      googleConnectPending: false,
    };
    const newState = reducer(state, actions.googleConnect({ code: 'test' }));
    expect(newState.googleConnectError).toEqual(null);
    expect(newState.googleConnectPending).toEqual(true);
  });
  it('should handle googleConnectSuccess action', () => {
    const state: State = {
      ...initialState,
      isGoogleConnected: false,
      googleConnectError: null,
      googleConnectPending: false,
    };
    const newState = reducer(state, actions.googleConnectSuccess());
    expect(newState.isGoogleConnected).toEqual(true);
    expect(newState.googleConnectError).toEqual(null);
    expect(newState.googleConnectPending).toEqual(false);
  });

  it('should handle googleDisconnect action', () => {
    const state: State = {
      ...initialState,
      googleDisconnectError: null,
      googleDisconnectPending: false,
    };
    const newState = reducer(state, actions.googleDisconnect());
    expect(newState.googleDisconnectError).toEqual(null);
    expect(newState.googleDisconnectPending).toEqual(true);
  });
  it('should handle googleDisconnectSuccess action', () => {
    const state: State = {
      ...initialState,
      isGoogleConnected: true,
      googleDisconnectError: null,
      googleDisconnectPending: false,
    };
    const newState = reducer(state, actions.googleDisconnectSuccess());
    expect(newState.isGoogleConnected).toEqual(false);
    expect(newState.googleDisconnectError).toEqual(null);
    expect(newState.googleDisconnectPending).toEqual(false);
  });
  it('should handle googleDisconnectFailure action', () => {
    const errorMessage = 'test error';
    const state: State = {
      ...initialState,
      googleDisconnectError: null,
      googleDisconnectPending: false,
    };
    const newState = reducer(state, actions.googleDisconnectFailure({ error: errorMessage }));
    expect(newState.googleDisconnectError).toEqual(errorMessage);
    expect(newState.googleDisconnectPending).toEqual(false);
  });

  it('should handle syncAppointmentClient action', () => {
    const state: State = {
      ...initialState,
      syncAppointmentClientError: null,
      syncAppointmentClientPending: false,
    };
    const bookingProductId = '123-456';
    const code = 'abc-def';

    const newState = reducer(state, actions.syncAppointmentClient({ bookingProductId, code }));
    expect(newState.syncAppointmentClientError).toEqual(null);
    expect(newState.syncAppointmentClientPending).toEqual(true);
  });
  it('should handle syncAppointmentClientSuccess action', () => {
    const state: State = {
      ...initialState,
      syncAppointmentClientError: null,
      syncAppointmentClientPending: true,
    };

    const bookingProductId = '123-456-789';

    const newState = reducer(state, actions.syncAppointmentClientSuccess({ bookingProductId }));
    expect(newState.syncAppointmentClientError).toEqual(null);
    expect(newState.syncAppointmentClientPending).toEqual(false);
  });
  it('should handle syncAppointmentClientFailure action', () => {
    const errorMessage = 'test error';
    const state: State = {
      ...initialState,
      syncAppointmentClientError: null,
      syncAppointmentClientPending: true,
    };
    const newState = reducer(state, actions.syncAppointmentClientFailure({ error: errorMessage }));
    expect(newState.syncAppointmentClientError).toEqual(errorMessage);
    expect(newState.syncAppointmentClientPending).toEqual(false);
  });

  it('should handle redirectToGoogleFinalPopup action', () => {
    const message = 'test message';
    const state: State = {
      ...initialState,
      isVendorConnectionFailed: true,
      vendorAppointmentAdditionMessage: '',
    };
    const newState = reducer(state, actions.redirectToGoogleFinalPopup({ message, isVendorConnectionFailed: false }));
    expect(newState.isVendorConnectionFailed).toEqual(false);
    expect(newState.vendorAppointmentAdditionMessage).toEqual(message);
  });
});

describe('Google Integration Selectors', () => {
  const mockState: State = {
    getAuthenticationUrlError: null,
    getAuthenticationUrlPending: false,
    isGoogleConnected: false,
    googleConnectError: null,
    googleConnectPending: false,
    googleDisconnectError: null,
    googleDisconnectPending: false,
    syncAppointmentClientError: null,
    syncAppointmentClientPending: false,
    isVendorConnectionFailed: false,
    vendorAppointmentAdditionMessage: '',
  };

  it('should select AuthenticationUrlError', () => {
    const selectedValue = selectors.selectAuthenticationUrlError.projector(mockState);
    expect(selectedValue).toEqual(mockState.getAuthenticationUrlError);
  });
  it('should select AuthenticationUrlPending', () => {
    const selectedValue = selectors.selectAuthenticationUrlPending.projector(mockState);
    expect(selectedValue).toEqual(mockState.getAuthenticationUrlPending);
  });

  it('should select IsGoogleConnected', () => {
    const selectedValue = selectors.selectIsGoogleConnected.projector(mockState);
    expect(selectedValue).toEqual(mockState.isGoogleConnected);
  });

  it('should select GoogleConnectError', () => {
    const selectedValue = selectors.selectGoogleConnectError.projector(mockState);
    expect(selectedValue).toEqual(mockState.googleConnectError);
  });
  it('should select GoogleConnectPending', () => {
    const selectedValue = selectors.selectGoogleConnectPending.projector(mockState);
    expect(selectedValue).toEqual(mockState.googleConnectPending);
  });

  it('should select GoogleDisconnectError', () => {
    const selectedValue = selectors.selectGoogleDisconnectError.projector(mockState);
    expect(selectedValue).toEqual(mockState.googleDisconnectError);
  });
  it('should select GoogleDisconnectPending', () => {
    const selectedValue = selectors.selectGoogleDisconnectPending.projector(mockState);
    expect(selectedValue).toEqual(mockState.googleDisconnectPending);
  });

  it('should select SyncAppointmentClientError', () => {
    const selectedValue = selectors.selectSyncAppointmentClientError.projector(mockState);
    expect(selectedValue).toEqual(mockState.syncAppointmentClientError);
  });
  it('should select SyncAppointmentClientPending', () => {
    const selectedValue = selectors.selectSyncAppointmentClientPending.projector(mockState);
    expect(selectedValue).toEqual(mockState.syncAppointmentClientPending);
  });
  it('should select selectIsVendorConnectionFailed', () => {
    const selectedValue = selectors.selectIsVendorConnectionFailed.projector(mockState);
    expect(selectedValue).toEqual(mockState.isVendorConnectionFailed);
  });
  it('should select selectVendorAppointmentAdditionMessage', () => {
    const selectedValue = selectors.selectVendorAppointmentAdditionMessage.projector(mockState);
    expect(selectedValue).toEqual(mockState.vendorAppointmentAdditionMessage);
  });
});
