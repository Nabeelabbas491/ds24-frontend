import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { VendorService } from './vendor.service';
import { TestBed } from '@angular/core/testing';
import { cold } from 'jasmine-marbles';
import {
  appointmentDetailData,
  appointmentListData,
  sampleCreateBookingTemplate,
  weekSchedule,
} from '../types/vendor.types.mock';
import { of, throwError } from 'rxjs';
import { AppointmentDetails, AppointmentListParams, SaveBookingTemplate } from '../types/vendor.types';
import { GenericResponse } from '../types/misc.type';
import { environment } from './../../environments/environment';
import { VendorSettingsService } from './vendor-settings.service';

describe('VendorService', () => {
  let service: VendorService;
  let vendorSettingService: VendorSettingsService;
  let http: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [VendorService],
    });

    service = TestBed.inject(VendorService);
    vendorSettingService = TestBed.inject(VendorSettingsService);
    http = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getMeetingTypes API and return results', () => {
    const meetingTypes = {
      data: [
        { id: 1, name: 'Inbound Call' },
        { id: 2, name: 'Outbound Call' },
      ],
    };

    const response = cold('-a|', { a: meetingTypes });
    const expected = cold('-b|', { b: meetingTypes.data });
    http.get = jest.fn(() => response);

    expect(service.getMeetingTypes()).toBeObservable(expected);
  });

  it('should call getMeetingProducts API and return results', () => {
    const meetingProducts = {
      data: [
        {
          id: '100',
          product_group_id: '101',
          name: 'Test product 1',
          vendor_id: '102',
          product_group_name: 'Some group',
        },
        {
          id: '200',
          product_group_id: '101',
          name: 'Test product 2',
          vendor_id: '102',
          product_group_name: 'Some group',
        },
      ],
    };

    const response = cold('-a|', { a: meetingProducts });
    const expected = cold('-b|', { b: meetingProducts.data });
    http.get = jest.fn(() => response);

    expect(service.getMeetingProducts()).toBeObservable(expected);
  });

  it('should call getBookingTemplateDetails API - success response', () => {
    const bookingTemplateId: number = 100;

    const bookingTemplateDetailResponse = {
      data: {
        id: 100,
        name: 'Test booking template',
        description: 'Test booking template description',
        duration: 30,
        bookingMeetingTypes: [{ id: 1, name: 'Inbound Call' }],
        bookingProducts: [{ id: 1, name: 'Test product' }],
      },
    };

    const response = cold('-a|', { a: bookingTemplateDetailResponse });
    const expected = cold('-b|', { b: bookingTemplateDetailResponse.data });
    http.get = jest.fn(() => response);

    expect(service.getBookingTemplateDetails(bookingTemplateId)).toBeObservable(expected);
  });
  it('should call getBookingTemplateDetails API - error response', () => {
    const bookingTemplateId: number = 100;

    const error = { message: 'error' } as HttpErrorResponse;
    const response = cold('#', { a: error });

    http.get = jest.fn(() => throwError(() => error));

    expect(service.getBookingTemplateDetails(bookingTemplateId)).toBeObservable(response);
  });

  it('should call updateBookingTemplate API - success response', () => {
    const bookingTemplateId: number = 100;
    const saveBookingTemplate: SaveBookingTemplate = {
      name: 'Test booking template',
      description: 'Test booking template description',
      duration: 30,
      products: [1],
      phoneNumber: '123-456',
      meetingTypes: [1, 2, 3],
    };

    const updateBookingTemplateResponse = {
      data: {},
      message: 'Booking template updated successfully',
    };

    const response = cold('-a|', { a: updateBookingTemplateResponse });
    const expected = cold('-b|', { b: updateBookingTemplateResponse });
    http.put = jest.fn(() => response);

    expect(service.updateBookingTemplate(bookingTemplateId, saveBookingTemplate)).toBeObservable(expected);
  });
  it('should call updateBookingTemplate API - error response', () => {
    const bookingTemplateId: number = 100;
    const saveBookingTemplate: SaveBookingTemplate = {
      name: 'Test booking template',
      description: 'Test booking template description',
      duration: 30,
      products: [1],
      phoneNumber: '123-456',
      meetingTypes: [1, 2, 3],
    };

    const error = { message: 'error' } as HttpErrorResponse;
    const response = cold('#', { a: error });

    http.put = jest.fn(() => throwError(() => error));

    expect(service.updateBookingTemplate(bookingTemplateId, saveBookingTemplate)).toBeObservable(response);
  });

  it('should call getBookingTemplateCollection API and return results', () => {
    const meetingProducts = cold('-a|', { a: [] });
    const meetingTypes = cold('-a|', { a: [] });
    const vendorSettings = cold('-a|', { a: {} });

    const expected = cold('--(b|)', {
      b: {
        meetingProducts: [],
        bookingTemplateDetail: null,
        vendorSetting: {},
        modalState: 'create',
      },
    });

    service.getMeetingTypes = jest.fn(() => meetingTypes);
    service.getMeetingProducts = jest.fn(() => meetingProducts);
    vendorSettingService.getVendorSettings = jest.fn(() => vendorSettings);

    expect(service.getBookingTemplateCollection(undefined)).toBeObservable(expected);
  });

  it('should call the insertBookingTemplate data', () => {
    const apiUrl = `${environment.apiUrl}/booking-templates/create`;

    service.insertBookingTemplate(sampleCreateBookingTemplate).subscribe();

    const request = httpTestingController?.expectOne(apiUrl);

    expect(request).toBeDefined();
    expect(request.request.urlWithParams).toBe(apiUrl);
    expect(request.request.method).toBe('POST');
    request.flush(sampleCreateBookingTemplate);
  });

  it('should return error message on error response', () => {
    const errorMessage = 'error message';
    service.insertBookingTemplate(sampleCreateBookingTemplate).subscribe(
      () => {},
      (error: HttpErrorResponse) => {
        expect(error.error).toBe(errorMessage);
      },
    );

    const req = httpTestingController.expectOne(`${environment.apiUrl}/booking-templates/create`);
    expect(req.request.method).toBe('POST');

    req.error(new ErrorEvent(errorMessage));

    httpTestingController.verify();
  });

  it('should call the appointmentList data', () => {
    const appointmentLists = of(appointmentListData);

    const listParams: AppointmentListParams = {
      page: 1,
      limit: 10,
      sortOrder: 'desc',
    };

    const apiUrl = `${environment.apiUrl}/appointments/list?page=${listParams.page}&limit=${listParams.limit}&sortOrder=${listParams.sortOrder}`;

    service.getAppointmentListData(listParams).subscribe();

    const request = httpTestingController?.expectOne(apiUrl);

    expect(request).toBeDefined();
    expect(request.request.urlWithParams).toBe(apiUrl);
    expect(request.request.method).toBe('GET');
    request.flush(appointmentLists);
  });

  it('should return AppointmentDetails on successful response', (done: any) => {
    const appointmentId = 1;
    const mockAppointmentDetails: AppointmentDetails = appointmentDetailData;
    const mockResponse: GenericResponse<AppointmentDetails> = {
      status: 200,
      data: mockAppointmentDetails,
      message: '',
    };

    jest.spyOn(http, 'get').mockReturnValue(of(mockResponse));

    service.getAppointmentDetailsData(appointmentId).subscribe(appointmentDetails => {
      expect(appointmentDetails).toEqual(mockAppointmentDetails);
      done();
    });

    expect(http.get).toHaveBeenCalledWith(`${environment.apiUrl}/appointments/${appointmentId}`);
  });

  it('should call the appointmentList data', () => {
    const appointmentId = 1;

    const apiUrl = `${environment.apiUrl}/appointments/${appointmentId}/cancel`;

    service.cancelAppointment(appointmentId).subscribe();

    const request = httpTestingController?.expectOne(apiUrl);

    expect(request).toBeDefined();
    expect(request.request.url).toBe(apiUrl);
    expect(request.request.method).toBe('POST');
  });

  it('should return confirmationMessage on successful response', (done: any) => {
    const appointmentId = 1;
    const mockConfirmationMessage: string = 'Appointment deleted successfully';
    const mockResponse: GenericResponse<any> = { status: 200, data: [], message: mockConfirmationMessage };

    jest.spyOn(http, 'post').mockReturnValue(of(mockResponse));

    service.cancelAppointment(appointmentId).subscribe(confirmationMessage => {
      expect(confirmationMessage).toEqual(mockConfirmationMessage);
      done();
    });

    expect(http.post).toHaveBeenCalledWith(`${environment.apiUrl}/appointments/${appointmentId}/cancel`, {});
  });

  it('should return error message on error response', () => {
    const appointmentId = 1;
    const errorMessage = 'Error cancelling appointment';

    service.cancelAppointment(appointmentId).subscribe(
      () => {},
      (error: HttpErrorResponse) => {
        expect(error.error).toBe(errorMessage);
      },
    );

    const req = httpTestingController.expectOne(`${environment.apiUrl}/appointments/${appointmentId}/cancel`);
    expect(req.request.method).toBe('POST');

    req.error(new ErrorEvent(errorMessage));

    httpTestingController.verify();
  });

  it('should call the schedule url', () => {
    const apiUrl = `${environment.apiUrl}/schedule`;

    service.getVendorScheduleData().subscribe();

    const request = httpTestingController?.expectOne(apiUrl);

    expect(request).toBeDefined();
    expect(request.request.url).toBe(apiUrl);
    expect(request.request.method).toBe('GET');
  });

  it('should return error message on error response', () => {
    const errorMessage = 'Error getting schedule';

    service.getVendorScheduleData().subscribe(
      () => {},
      (error: HttpErrorResponse) => {
        expect(error.error).toBe(errorMessage);
      },
    );

    const req = httpTestingController.expectOne(`${environment.apiUrl}/schedule`);
    expect(req.request.method).toBe('GET');

    req.error(new ErrorEvent(errorMessage));

    httpTestingController.verify();
  });

  it('should call the schedule update url', () => {
    const apiUrl = `${environment.apiUrl}/schedule/update`;

    service.saveVendorScheduleData(weekSchedule).subscribe();

    const request = httpTestingController?.expectOne(apiUrl);

    expect(request).toBeDefined();
    expect(request.request.url).toBe(apiUrl);
    expect(request.request.method).toBe('PUT');
  });

  it('should call the schedule create url', () => {
    const apiUrl = `${environment.apiUrl}/schedule/create`;

    service.createVendorScheduleData(weekSchedule).subscribe();

    const request = httpTestingController?.expectOne(apiUrl);

    expect(request).toBeDefined();
    expect(request.request.url).toBe(apiUrl);
    expect(request.request.method).toBe('POST');
  });

  it('should call the schedule delete url', () => {
    const availibilityId = 1;

    const apiUrl = `${environment.apiUrl}/schedule-availability/${availibilityId}/delete`;
    service.deleteVendorScheduleData(availibilityId).subscribe();

    const request = httpTestingController?.expectOne(apiUrl);

    expect(request).toBeDefined();
    expect(request.request.url).toBe(apiUrl);
    expect(request.request.method).toBe('DELETE');
  });

  it('should return error message on error response', () => {
    const errorMessage = 'Error updating schedule';

    service.saveVendorScheduleData(weekSchedule).subscribe(
      () => {},
      (error: HttpErrorResponse) => {
        expect(error.error).toBe(errorMessage);
      },
    );

    const req = httpTestingController.expectOne(`${environment.apiUrl}/schedule/update`);
    expect(req.request.method).toBe('PUT');

    req.error(new ErrorEvent(errorMessage));

    httpTestingController.verify();
  });

  it('should call getVendorSettingCollection API and return results', () => {
    const meetingTypes = cold('-a|', { a: [] });
    const vendorSettings = cold('-a|', { a: {} });

    const expected = cold('--(b|)', {
      b: {
        meetingTypes: [],
        vendorSetting: {},
        pageState: 'edit',
      },
    });

    service.getMeetingTypes = jest.fn(() => meetingTypes);
    vendorSettingService.getVendorSettings = jest.fn(() => vendorSettings);

    expect(service.getVendorSettingCollection()).toBeObservable(expected);
  });

  it('should call downloadVendorICS API - Success Response', () => {
    const testFile = new Blob(['testing']);
    const expectedResponse = new Blob(['testing']);
    const response = cold('-a', { a: testFile });
    const expected = cold('-b', { b: expectedResponse });
    http.get = jest.fn(() => response);

    expect(service.downloadVendorICS(123)).toBeObservable(expected);
  });

  it('should call downloadVendorICS API - Error Response', () => {
    const error = { message: 'error' } as HttpErrorResponse;

    const response = cold('#', { a: error });

    http.get = jest.fn(() => throwError(() => error));

    expect(service.downloadVendorICS(123)).toBeObservable(response);
  });
});
