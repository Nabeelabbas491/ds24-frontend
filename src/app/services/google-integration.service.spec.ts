import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { cold } from 'jasmine-marbles';
import { GoogleIntegrationService } from './google-integration.service';
import { throwError } from 'rxjs';
import { saveIntegrationInfo } from '../shared/common/util';
import { GoogleIntegrationInfo } from '../types/google-integration.type';

describe('GoogleIntegrationService', () => {
  let service: GoogleIntegrationService;
  let http: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GoogleIntegrationService,
        { provide: HttpClient, useValue: { get: jest.fn(), forkJoin: jest.fn(), post: jest.fn() } },
      ],
    });

    service = TestBed.inject(GoogleIntegrationService);
    http = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getAuthenticationUrl API - success response', () => {
    const getAuthenticationUrlResponse = {
      data: {
        url: 'test',
      },
    };

    const response = cold('-a|', { a: getAuthenticationUrlResponse });
    const expected = cold('-b|', { b: getAuthenticationUrlResponse.data });
    http.get = jest.fn(() => response);

    expect(service.getAuthenticationUrl()).toBeObservable(expected);
  });
  it('getAuthenticationUrl API - error response', () => {
    const error = { message: 'error' } as HttpErrorResponse;
    const response = cold('#', { a: error });

    http.get = jest.fn(() => throwError(() => error));

    expect(service.getAuthenticationUrl()).toBeObservable(response);
  });

  it('googleConnect API - success response', () => {
    const code: string = 'test';
    const googleConnectResponse = {
      data: {},
    };

    const response = cold('-a|', { a: googleConnectResponse });
    const expected = cold('-b|', { b: googleConnectResponse.data });
    http.post = jest.fn(() => response);

    expect(service.googleConnect(code)).toBeObservable(expected);
  });
  it('googleConnect API - error response', () => {
    const code: string = 'test';
    const error = 'error';
    const response = cold('#', { a: error });

    http.post = jest.fn(() => throwError(() => error));

    expect(service.googleConnect(code)).toBeObservable(response);
  });

  it('googleDisconnect API - success response', () => {
    const googleDisconnectResponse = {
      data: {},
    };

    const response = cold('-a|', { a: googleDisconnectResponse });
    const expected = cold('-b|', { b: googleDisconnectResponse.data });
    http.post = jest.fn(() => response);

    expect(service.googleDisconnect()).toBeObservable(expected);
  });
  it('googleDisconnect API - error response', () => {
    const error = { message: 'error' } as HttpErrorResponse;
    const response = cold('#', { a: error });

    http.post = jest.fn(() => throwError(() => error));

    expect(service.googleDisconnect()).toBeObservable(response);
  });

  it('googleCalendarClient API - success response', () => {
    const code: string = 'test';
    const appointmentId: string = '123';
    const googleCalendarClientResponse = {
      message: 'appointment synced successfully',
      data: {},
    };

    const response = cold('-a|', { a: googleCalendarClientResponse });
    const expected = cold('-b|', { b: googleCalendarClientResponse });
    http.post = jest.fn(() => response);

    expect(service.googleCalendarClient(appointmentId, code)).toBeObservable(expected);
  });
  it('googleCalendarClient API - error response', () => {
    const code: string = 'test';
    const appointmentId: string = '';

    const error = { message: 'error' } as HttpErrorResponse;
    const response = cold('#', { a: error });

    http.post = jest.fn(() => throwError(() => error));

    expect(service.googleCalendarClient(appointmentId, code)).toBeObservable(response);
  });

  it('syncVendorAppointment API - success response', () => {
    const integrationInfo: GoogleIntegrationInfo = {
      integrationMode: 'vendor-appointment',
      appointmentId: '123',
    };

    saveIntegrationInfo(integrationInfo);

    const googleCalendarVendorResponse = {
      message: 'appointment synced successfully',
      data: {},
    };

    const response = cold('-a|', { a: googleCalendarVendorResponse });
    const expected = cold('-b|', { b: googleCalendarVendorResponse.message });
    http.post = jest.fn(() => response);

    expect(service.syncVendorAppointment()).toBeObservable(expected);
  });

  it('syncVendorAppointment API - error response', () => {
    const error = { message: 'error' } as HttpErrorResponse;
    const response = cold('#', { a: error });

    http.post = jest.fn(() => throwError(() => error));

    expect(service.syncVendorAppointment()).toBeObservable(response);
  });
});
