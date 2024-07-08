import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { BookingService } from './booking.service';
import { cold } from 'jasmine-marbles';
import { bookingTemplateMock } from '../types/booking-template.mock';
import { TranslateService } from '@ngx-translate/core';
import { CreateBooking } from '../types/booking.type';
import { throwError } from 'rxjs';

const mockTranslateService = {
  instant: (arg: string) => {
    if (arg === 'BOOKING.BOOKING_OTHER.MEETING_TYPES_NOT_DEFINED') {
      return 'Meeting types not defined in template';
    }
    return '';
  },
};

describe('BookingService', () => {
  let service: BookingService;
  let http: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BookingService,
        { provide: TranslateService, useValue: mockTranslateService },
        { provide: HttpClient, useValue: { get: jest.fn(), forkJoin: jest.fn(), post: jest.fn() } },
      ],
    });

    service = TestBed.inject(BookingService);
    http = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getBookingTemplate API and return results', () => {
    const bookingTemplateResponse = {
      data: bookingTemplateMock,
    };

    const response = cold('-a|', { a: bookingTemplateResponse });
    const expected = cold('-b|', { b: bookingTemplateResponse.data });
    http.get = jest.fn(() => response);

    expect(service.getBookingTemplate('some id')).toBeObservable(expected);
  });

  it('should call getBookingTemplate API - error response', done => {
    const mockErrorMessage = 'Meeting types not defined in template';

    jest.spyOn(service, 'getBookingTemplate').mockReturnValue(throwError(new Error(mockErrorMessage)));

    const result$ = service.getBookingTemplate('some id');

    result$.subscribe(
      () => fail('Expected an error, but got a value instead'),
      error => {
        expect(error.message).toBe(mockErrorMessage);
        done();
      },
    );
  });

  it('should call getBookingTemplate API - error response', () => {
    const error = { message: 'error' } as HttpErrorResponse;
    const response = cold('#', { a: error });

    http.get = jest.fn(() => throwError(() => error));

    expect(service.getBookingTemplate('some id')).toBeObservable(response);
  });

  it('should call getBookingTemplateByPurchaseId API and return results', () => {
    const bookingTemplateResponse = {
      data: bookingTemplateMock,
    };

    const response = cold('-a|', { a: bookingTemplateResponse });
    const expected = cold('-b|', { b: bookingTemplateResponse.data });
    http.get = jest.fn(() => response);

    expect(service.getBookingTemplateByPurchaseId('some id')).toBeObservable(expected);
  });

  it('should call getBookingTemplateByPurchaseId API - error response', () => {
    const error = { message: 'error' } as HttpErrorResponse;
    const response = cold('#', { a: error });

    http.get = jest.fn(() => throwError(() => error));

    expect(service.getBookingTemplateByPurchaseId('some id')).toBeObservable(response);
  });

  it('should call createBooking API - Success Response', () => {
    const createBookingArg: CreateBooking = {
      name: 'Test name',
      email: 'test@test.com',
      phoneNo: '123-123',
      note: 'test',
      timeZone: 'test',
      meetingType: 2,
      startTime: '10:00',
      date: '2023-12-31',
    };
    const createBookingResponse = {
      data: {
        zoomLink: '',
        phoneNumber: '',
      },
    };

    const response = cold('-a|', { a: createBookingResponse });
    const expected = cold('-b|', { b: createBookingResponse.data });
    http.post = jest.fn(() => response);

    expect(service.createBooking('123-123', createBookingArg)).toBeObservable(expected);
  });

  it('should call createBooking API - Error response', () => {
    const createBookingArg: CreateBooking = {
      name: 'Test name',
      email: 'test@test.com',
      phoneNo: '123-123',
      note: 'test',
      timeZone: 'test',
      meetingType: 2,
      startTime: '10:00',
      date: '2023-12-31',
    };

    const error = { message: 'error' } as HttpErrorResponse;

    const response = cold('#', { a: error });

    http.post = jest.fn(() => throwError(() => error));

    expect(service.createBooking('123-123', createBookingArg)).toBeObservable(response);
  });

  it('should call getTimeSlots API - Success Response', () => {
    const bookingTemplateResponse = {
      data: {
        availableTimeSlots: [
          {
            from: '09:00',
            to: '09:30',
          },
          {
            from: '09:30',
            to: '10:00',
          },
        ],
      },
    };
    const expectedResponse = [
      { startTime: '09:00', endTime: '09:30' },
      { startTime: '09:30', endTime: '10:00' },
    ];

    const response = cold('-a', { a: bookingTemplateResponse });
    const expected = cold('-b', { b: expectedResponse });
    http.get = jest.fn(() => response);

    expect(service.getTimeSlots('2024-02-24', 100, 'Asia/Karachi')).toBeObservable(expected);
  });

  it('should call getTimeSlots API - Error Response', () => {
    const error = { message: 'error' } as HttpErrorResponse;

    const response = cold('#', { a: error });

    http.get = jest.fn(() => throwError(() => error));

    expect(service.getTimeSlots('2024-02-24', 100, 'Asia/Karachi')).toBeObservable(response);
  });

  it('should call downloadClientICS API - Success Response', () => {
    const bookingTemplateResponse = new Blob(['testing']);
    const expectedResponse = new Blob(['testing']);
    const response = cold('-a', { a: bookingTemplateResponse });
    const expected = cold('-b', { b: expectedResponse });
    http.get = jest.fn(() => response);

    expect(service.downloadClientICS(123)).toBeObservable(expected);
  });

  it('should call downloadClientICS API - Error Response', () => {
    const error = { message: 'error' } as HttpErrorResponse;

    const response = cold('#', { a: error });

    http.get = jest.fn(() => throwError(() => error));

    expect(service.downloadClientICS(123)).toBeObservable(response);
  });
});
