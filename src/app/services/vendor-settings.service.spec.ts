import { TestBed } from '@angular/core/testing';

import { VendorSettingsService } from './vendor-settings.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SaveVendorSetting } from '../types/vendor-settings.type';
import { cold } from 'jasmine-marbles';
import { throwError } from 'rxjs';

describe('VendorSettingsService', () => {
  let service: VendorSettingsService;
  let http: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        VendorSettingsService,
        { provide: HttpClient, useValue: { get: jest.fn(), forkJoin: jest.fn(), post: jest.fn() } },
      ],
    });
    service = TestBed.inject(VendorSettingsService);
    http = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call createVendorSetting API - Success Response', () => {
    const saveVendorSettingArg: SaveVendorSetting = {
      logo: undefined,
      primaryColor: '#000000',
      secondaryColor: '#ff00ff',
      phoneNumber: '123-456',
      meetingTypes: [1, 2],
    };
    const createVendorSettingResponse = {
      data: {
        primaryColor: '#000000',
        secondaryColor: '#ff00ff',
        phoneNumber: '123-456',
      },
    };

    const response = cold('-a|', { a: createVendorSettingResponse });
    const expected = cold('-b|', { b: createVendorSettingResponse });
    http.post = jest.fn(() => response);

    expect(service.createVendorSetting(saveVendorSettingArg)).toBeObservable(expected);
  });

  it('should call createVendorSetting API - Error response', () => {
    const saveVendorSetting: SaveVendorSetting = {
      logo: undefined,
      primaryColor: '#000000',
      secondaryColor: '#ff00ff',
      phoneNumber: '123-456',
      meetingTypes: [1, 2],
    };

    const error = { message: 'error' } as HttpErrorResponse;

    const response = cold('#', { a: error });

    http.post = jest.fn(() => throwError(() => error));

    expect(service.createVendorSetting(saveVendorSetting)).toBeObservable(response);
  });

  it('should call updateVendorSetting API - Success Response', () => {
    const saveVendorSettingArg: SaveVendorSetting = {
      logo: undefined,
      primaryColor: '#000000',
      secondaryColor: '#ff00ff',
      phoneNumber: '123-456',
      meetingTypes: [1, 2],
    };
    const updateVendorSettingResponse = {
      data: {
        primaryColor: '#000000',
        secondaryColor: '#ff00ff',
        phoneNumber: '123-456',
      },
    };

    const response = cold('-a|', { a: updateVendorSettingResponse });
    const expected = cold('-b|', { b: updateVendorSettingResponse });
    http.post = jest.fn(() => response);

    expect(service.updateVendorSetting(saveVendorSettingArg)).toBeObservable(expected);
  });

  it('should call updateVendorSetting API - Error response', () => {
    const saveVendorSetting: SaveVendorSetting = {
      logo: undefined,
      primaryColor: '#000000',
      secondaryColor: '#ff00ff',
      phoneNumber: '123-456',
      meetingTypes: [1, 2],
    };

    const error = { message: 'error' } as HttpErrorResponse;

    const response = cold('#', { a: error });

    http.post = jest.fn(() => throwError(() => error));

    expect(service.updateVendorSetting(saveVendorSetting)).toBeObservable(response);
  });

  it('should call getVendorSettings API - Success Response', () => {
    const bookingTemplateResponse = {
      data: {
        id: 1,
        logo: '',
        primaryColor: '#000000',
        secondaryColor: '#ff00ff',
        phoneNumber: '123-456',
        meetingTypes: [
          { id: 1, name: 'Inbound Call' },
          { id: 2, name: 'Outbound Call' },
        ],
      },
    };

    const response = cold('-a', { a: bookingTemplateResponse });
    const expected = cold('-b', { b: bookingTemplateResponse.data });
    http.get = jest.fn(() => response);

    expect(service.getVendorSettings()).toBeObservable(expected);
  });

  it('should call getVendorSettings API - Error Response', () => {
    const error = { message: 'error' } as HttpErrorResponse;

    const response = cold('#', { a: error });

    http.get = jest.fn(() => throwError(() => error));

    expect(service.getVendorSettings()).toBeObservable(response);
  });

  it('should call removeLogo API - Success Response', () => {
    const removeLogoResponse = {
      message: 'Logo removed successfully',
    };

    const response = cold('-a|', { a: removeLogoResponse });
    const expected = cold('-b|', { b: removeLogoResponse });
    http.post = jest.fn(() => response);

    expect(service.removeLogo()).toBeObservable(expected);
  });

  it('should call removeLogo API - Error response', () => {
    const error = { message: 'error' } as HttpErrorResponse;

    const response = cold('#', { a: error });

    http.post = jest.fn(() => throwError(() => error));

    expect(service.removeLogo()).toBeObservable(response);
  });
});
