import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { cold, hot } from 'jasmine-marbles';
import { actions } from '../store';
import { provideMockStore } from '@ngrx/store/testing';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { GoogleIntegrationEffects } from './google-integration.effects';
import { GoogleIntegrationService } from '../services/google-integration.service';
import { GoogleAuthUrl, GoogleIntegrationInfo } from '../types/google-integration.type';
import { Store } from '@ngrx/store';
import { State } from '../store';

describe('GoogleIntegrationEffects', () => {
  let effects: GoogleIntegrationEffects;
  let googleIntegrationService: GoogleIntegrationService;
  let actions$: Observable<any>;
  let mockStore: Store<State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GoogleIntegrationEffects,
        GoogleIntegrationService,
        {
          provide: googleIntegrationService,
          useValue: {
            getAuthenticationUrl: jest.fn(),
            googleConnect: jest.fn(),
            googleDisconnect: jest.fn(),
          },
        },
        provideMockActions(() => actions$),
        provideMockStore({
          selectors: [],
        }),
      ],
      imports: [HttpClientModule, TranslateModule.forRoot()],
    });

    effects = TestBed.inject(GoogleIntegrationEffects);
    googleIntegrationService = TestBed.inject(GoogleIntegrationService);
    actions$ = TestBed.inject(Actions);
    mockStore = TestBed.inject(Store);
    jest.spyOn(mockStore, 'dispatch');
  });

  describe('getAuthenticationUrl$', () => {
    it('getAuthenticationUrl = success scenario', () => {
      const googleAuthUrl = {
        url: 'test',
      } as GoogleAuthUrl;

      const integrationInfo: GoogleIntegrationInfo = {
        integrationMode: 'client-booking',
        bookingProductId: 'zyx',
      };

      const action = actions.googleIntegration.getAuthenticationUrl({ integrationInfo });
      const completion = actions.googleIntegration.getAuthenticationUrlSuccess({
        url: googleAuthUrl.url,
        integrationInfo,
      });

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', { a: googleAuthUrl });
      const expected = cold('--b', { b: completion });
      googleIntegrationService.getAuthenticationUrl = jest.fn(() => response);

      expect(effects.getAuthenticationUrl$).toBeObservable(expected);
    });
    it('getAuthenticationUrl = error scenario', () => {
      const integrationInfo: GoogleIntegrationInfo = {
        integrationMode: 'client-booking',
        bookingProductId: 'zyx',
      };

      const action = actions.googleIntegration.getAuthenticationUrl({ integrationInfo });
      const error = { message: 'error' } as HttpErrorResponse;
      const completion = actions.googleIntegration.getAuthenticationUrlFailure({ error });

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      googleIntegrationService.getAuthenticationUrl = jest.fn(() => throwError(() => error));

      expect(effects.getAuthenticationUrl$).toBeObservable(expected);
    });
  });

  describe('googleConnect$', () => {
    it('googleConnect = success scenario', () => {
      const code: string = 'test';
      const googleConnectResponse = {};
      const action = actions.googleIntegration.googleConnect({ code });
      const completion = actions.googleIntegration.googleConnectSuccess();

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', { a: googleConnectResponse });
      const expected = cold('--b', { b: completion });
      googleIntegrationService.googleConnect = jest.fn(() => response);

      expect(effects.googleConnect$).toBeObservable(expected);
    });
    it('googleConnect = error scenario', () => {
      const code: string = 'test';
      const error = new HttpErrorResponse({
        error: {
          message: 'An error occurred',
        },
        status: 403,
        statusText: 'Not Found',
      });

      const action = actions.googleIntegration.googleConnect({ code });
      const completion = actions.googleIntegration.redirectToGoogleFinalPopup({
        message: error.error.message,
        isVendorConnectionFailed: true,
      });

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      googleIntegrationService.googleConnect = jest.fn(() => throwError(error));

      expect(effects.googleConnect$).toBeObservable(expected);
    });

    it('googleConnect = error scenario 422', () => {
      const code: string = 'test';
      const error = new HttpErrorResponse({
        error: {
          message: 'You are already Connected to Google Calendar.',
        },
        status: 422,
        statusText: 'You are already Connected to Google Calendar.',
      });

      const action = actions.googleIntegration.googleConnect({ code });
      const completion = actions.googleIntegration.googleConnectSuccess();

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      googleIntegrationService.googleConnect = jest.fn(() => throwError(error));

      expect(effects.googleConnect$).toBeObservable(expected);
    });
  });

  describe('syncVendorAppointment$', () => {
    it('syncVendorAppointment = success scenario', () => {
      const googleConnectResponse = 'Its added to google now';
      const action = actions.googleIntegration.googleConnectSuccess();
      const completion = actions.googleIntegration.redirectToGoogleFinalPopup({
        message: googleConnectResponse,
        isVendorConnectionFailed: false,
      });

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', { a: googleConnectResponse });
      const expected = cold('--b', { b: completion });
      googleIntegrationService.syncVendorAppointment = jest.fn(() => response);

      expect(effects.syncVendorAppointment$).toBeObservable(expected);
    });
    it('syncVendorAppointment = error scenario', () => {
      const error = 'error message';
      const action = actions.googleIntegration.googleConnectSuccess();
      const completion = actions.googleIntegration.redirectToGoogleFinalPopup({
        message: error,
        isVendorConnectionFailed: true,
      });

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      googleIntegrationService.syncVendorAppointment = jest.fn(() => throwError(error));

      expect(effects.syncVendorAppointment$).toBeObservable(expected);
    });
  });

  describe('googleDisconnect$', () => {
    it('googleDisconnect = success scenario', () => {
      const googleDisconnectResponse = {};

      const action = actions.googleIntegration.googleDisconnect();
      const completion = actions.googleIntegration.googleDisconnectSuccess();

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', { a: googleDisconnectResponse });
      const expected = cold('--b', { b: completion });
      googleIntegrationService.googleDisconnect = jest.fn(() => response);

      expect(effects.googleDisconnect$).toBeObservable(expected);
    });
    it('googleDisconnect = error scenario', () => {
      const action = actions.googleIntegration.googleDisconnect();
      const error = { message: 'error' } as HttpErrorResponse;
      const completion = actions.googleIntegration.googleDisconnectFailure({ error });

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      googleIntegrationService.googleDisconnect = jest.fn(() => throwError(() => error));

      expect(effects.googleDisconnect$).toBeObservable(expected);
    });
  });

  describe('googleDisconnect$', () => {
    it('googleDisconnect = success scenario', () => {
      const googleDisconnectResponse = {};

      const action = actions.googleIntegration.googleDisconnect();
      const completion = actions.googleIntegration.googleDisconnectSuccess();

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', { a: googleDisconnectResponse });
      const expected = cold('--b', { b: completion });
      googleIntegrationService.googleDisconnect = jest.fn(() => response);

      expect(effects.googleDisconnect$).toBeObservable(expected);
    });
    it('googleDisconnect = error scenario', () => {
      const action = actions.googleIntegration.googleDisconnect();
      const error = { message: 'error' } as HttpErrorResponse;
      const completion = actions.googleIntegration.googleDisconnectFailure({ error });

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      googleIntegrationService.googleDisconnect = jest.fn(() => throwError(() => error));

      expect(effects.googleDisconnect$).toBeObservable(expected);
    });
  });

  it('should handle getAuthenticationUrlSuccess action for client-booking integration mode', (done: any) => {
    const url = 'your-url';
    const integrationInfo = { integrationMode: 'client-booking' } as GoogleIntegrationInfo;
    const action = actions.googleIntegration.getAuthenticationUrlSuccess({ url, integrationInfo });
    actions$ = of(action);

    const mockWindowLocation = { href: '' };
    const originalLocation = window.location;

    Object.defineProperty(window, 'location', {
      writable: true,
      value: mockWindowLocation,
    });

    effects.getAuthenticationUrlSuccess$.subscribe(() => {
      expect(mockWindowLocation.href).toBe(url);
      done();
    });

    window.location = originalLocation;
  });

  it('should handle getAuthenticationUrlSuccess action for vendor-appointment integration mode', (done: any) => {
    const url = 'your-url';
    const integrationInfo = { integrationMode: 'vendor-appointment' } as GoogleIntegrationInfo;
    const action = actions.googleIntegration.getAuthenticationUrlSuccess({ url, integrationInfo });
    actions$ = of(action);

    effects.getAuthenticationUrlSuccess$.subscribe(() => {
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        actions.googleIntegration.openWindowPopup({ popupName: 'googleAuthPopup', popupUrl: url }),
      );
      done();
    });
  });

  it('should handle getAuthenticationUrlSuccess action for vendor-appointment integration mode', (done: any) => {
    const url = 'your-url';
    const action = actions.googleIntegration.openWindowPopup({ popupName: 'googleAuthPopup', popupUrl: url });
    actions$ = of(action);

    const mockWindowOpen = jest.fn();
    window.open = mockWindowOpen;

    Object.defineProperty(window, 'screen', {
      writable: true,
      configurable: true,
      value: { width: 2400, height: 1600 },
    });

    effects.openGooglePopup$.subscribe(() => {
      expect(mockWindowOpen).toHaveBeenCalled();
      expect(mockWindowOpen).toHaveBeenCalledWith(url, 'googleAuthPopup', `width=1200,height=800,left=600,top=400`);
      expect(mockStore.dispatch).toHaveBeenCalledWith(actions.googleIntegration.closeGooglePopup());
      done();
    });
  });
});
