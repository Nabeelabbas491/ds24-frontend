import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, first, of, throwError } from 'rxjs';
import { BookingAPIEffects } from './booking-api.effects';
import { BookingService } from '../services/booking.service';
import { cold, hot } from 'jasmine-marbles';
import { BookingDetail, BookingSaveSuccess, BookingTemplateDetail } from '../types/booking.type';
import { actions, selectors } from '../store';
import { provideMockStore } from '@ngrx/store/testing';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { DEFAULT_PRODUCT_IMAGAE, TEMP_VENDOR_NAME } from '../shared/common/util';
import * as helper from '../shared/common/util';
import { DsSnackbarService } from '@ds24/elements';

describe('BookingAPIEffects', () => {
  let effects: BookingAPIEffects;
  let bookingService: BookingService;
  let snackbarService: DsSnackbarService;

  let actions$: Observable<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BookingAPIEffects,
        BookingService,
        {
          provide: DsSnackbarService,
          useValue: { openSnackbar: jest.fn() },
        },
        {
          provide: bookingService,
          useValue: {
            createBooking: jest.fn(),
            getBookingTemplate: jest.fn(),
            getCalendarEntries: jest.fn(),
            downloadClientICS: jest.fn(),
          },
        },
        provideMockActions(() => actions$),
        provideMockStore({
          selectors: [
            {
              selector: selectors.booking.selectSelectedDay,
              value: {
                number: 23,
                isToday: true,
                isSelected: true,
                isOtherMonth: false,
                isWeekend: false,
                isPast: false,
                dayMonthYearTitle: '2023-10-23',
              },
            },
            { selector: selectors.booking.selectMeetingType, value: { id: 2, name: 'Outbound Phone Call' } },
            { selector: selectors.booking.selectTimeZone, value: 'test' },
            { selector: selectors.booking.selectTimeSlot, value: { startTime: '10:00', endTime: '10:30' } },
            { selector: selectors.bookingAPI.selectBookingProductId, value: '123-xyz-123' },
          ],
        }),
      ],
      imports: [HttpClientModule, TranslateModule.forRoot()],
    });

    effects = TestBed.inject(BookingAPIEffects);
    bookingService = TestBed.inject(BookingService);
    actions$ = TestBed.inject(Actions);
    snackbarService = TestBed.inject(DsSnackbarService);
  });

  describe('saveBooking$', () => {
    it('should return an bookingAPI.saveBookingSuccess action, with booking information if save booking succeeds', () => {
      const bookingDetail: BookingDetail = {
        name: 'Test User',
        email: 'test@test.com',
        phoneNo: '123-456',
        note: 'test test',
      };
      const bookingSaveSuccess = {
        appointmentId: 1,
        zoomLink: '',
        name: 'Test User',
        dayTitle: '2023-10-23',
        meetingTypeDetail: { id: 2, name: 'Outbound Phone Call' },
        timeSlot: { startTime: '10:00', endTime: '10:30' },
      } as BookingSaveSuccess;

      const action = actions.bookingAPI.saveBooking({ bookingDetail });
      const completion = actions.bookingAPI.saveBookingSuccess({ bookingSaveSuccess });

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', { a: bookingSaveSuccess });
      const expected = cold('--b', { b: completion });
      bookingService.createBooking = jest.fn(() => response);

      expect(effects.saveBooking$).toBeObservable(expected);
    });
  });

  describe('saveBookingFailure$', () => {
    it('should return an bookingAPI.saveBookingFailure action, with booking information if save booking fails', () => {
      const bookingDetail: BookingDetail = {
        name: 'test',
        email: 'test@test.com',
        phoneNo: '123-456',
        note: 'test test',
      };

      const action = actions.bookingAPI.saveBooking({ bookingDetail });
      const error = { message: 'error' } as HttpErrorResponse;
      const completion = actions.bookingAPI.saveBookingFailure({ error: error.message });

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      bookingService.createBooking = jest.fn(() => throwError(() => error.message));

      expect(effects.saveBooking$).toBeObservable(expected);
    });
  });

  describe('saveBookingSuccess$', () => {
    it('should return completeBooking and selectStep action', () => {
      const bookingSaveSuccess = {
        appointmentId: 1,
        zoomLink: '',
        name: 'Test User',
        dayTitle: '2023-10-23',
        meetingTypeDetail: { id: 2, name: 'Outbound Phone Call' },
        timeSlot: { startTime: '10:00', endTime: '10:30' },
      } as BookingSaveSuccess;

      const action = actions.bookingAPI.saveBookingSuccess({ bookingSaveSuccess });
      const completionBookingAction = actions.booking.completeBooking({ bookingSaveSuccess });
      const selectStepAction = actions.booking.selectStep({ step: 'summary' });

      actions$ = hot('-a', { a: action });
      const expected = cold('-(bc)', { b: completionBookingAction, c: selectStepAction });

      expect(effects.saveBookingSuccess$).toBeObservable(expected);
    });
  });

  describe('getBookingTemplateSuccess$', () => {
    it('when getBookingTemplateSucceess action is raised, it should raise meetingType, resetCalendar, and setBookingTemplateSummary actions with desired parameters', () => {
      const bookingTemplateDetail: BookingTemplateDetail = {
        bookingTemplate: {
          id: 100,
          name: 'test',
          bufferTime: 30,
          description: 'test test test',
          duration: 30,
        },
        bookingProduct: {
          id: 100,
          url: 'test',
          imageUrl: '',
          productId: 101,
          productName: 'test',
          uuid: '123-xyz-123',
          zoomLink: 'test',
        },
        bookingMeetingTypes: [{ id: 1, name: 'Inbound Call' }],
        availabilities: [],
      };

      const action = actions.bookingAPI.getBookingTemplateSuccess({ bookingTemplateDetail });
      const completion = [
        actions.booking.meetingType({ meetingType: bookingTemplateDetail.bookingMeetingTypes[0] }),
        actions.calendar.resetCalendar(),
        actions.calendar.currentMonth(),
        actions.calendar.setMode({ mode: 'clientbooking' }),
        actions.booking.setBookingTemplateSummary({
          bookingTemplateSummary: {
            heading: bookingTemplateDetail.bookingProduct.productName,
            duration: bookingTemplateDetail.bookingTemplate.duration,
            userName: TEMP_VENDOR_NAME,
            imageUrl: DEFAULT_PRODUCT_IMAGAE,
          },
        }),
      ];

      actions$ = hot('-a', { a: action });

      const expected = cold('-(abcde)', {
        a: completion[0],
        b: completion[1],
        c: completion[2],
        d: completion[3],
        e: completion[4],
      });

      expect(effects.getBookingTemplateSuccess$).toBeObservable(expected);
    });
    it('when getBookingTemplateSucceess action is raised, and if there is no availability set, open snackbar message', (done: any) => {
      const bookingTemplateDetail: BookingTemplateDetail = {
        bookingTemplate: {
          id: 100,
          name: 'test',
          bufferTime: 30,
          description: 'test test test',
          duration: 30,
        },
        bookingProduct: {
          id: 100,
          url: 'test',
          imageUrl: '',
          productId: 101,
          productName: 'test',
          uuid: '123-xyz-123',
          zoomLink: 'test',
        },
        bookingMeetingTypes: [{ id: 1, name: 'Inbound Call' }],
        availabilities: [],
      };

      const action = actions.bookingAPI.getBookingTemplateSuccess({ bookingTemplateDetail });

      actions$ = of(action);

      const spy = jest.spyOn(helper, 'isNoScheduleExist');
      spy.mockReturnValue(true);

      effects.getBookingTemplateSuccess$.pipe(first()).subscribe(() => {
        expect(snackbarService.openSnackbar).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('downloadClientICS$', () => {
    it('when downloadClientICS action is raised, it should raise downloadClientICSSuccess event', () => {
      const appointmentId: number = 123;
      const icsFileContent = new Blob(['testing']);

      const action = actions.bookingAPI.downloadClientICS({ appointmentId });
      actions$ = hot('-a', { a: action });

      const completion = actions.bookingAPI.downloadClientICSSuccess();

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', { a: icsFileContent });
      const expected = cold('--b', { b: completion });

      bookingService.downloadClientICS = jest.fn(() => response);

      const spy = jest.spyOn(helper, 'downloadFile');
      spy.mockReturnValue();

      expect(effects.downloadClientICS$).toBeObservable(expected);
    });
    it('when downloadClientICS action is raised, it should raise downloadClientICSFailure event', () => {
      const appointmentId: number = 123;

      const action = actions.bookingAPI.downloadClientICS({ appointmentId });
      const error = { message: 'error' } as HttpErrorResponse;
      const completion = actions.bookingAPI.downloadClientICSFailure({ error: error.message });

      actions$ = hot('-a', { a: action });

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      bookingService.downloadClientICS = jest.fn(() => throwError(() => error.message));

      const spy = jest.spyOn(helper, 'downloadFile');
      spy.mockReturnValue();

      expect(effects.downloadClientICS$).toBeObservable(expected);
    });
  });

  describe('getBookingTemplate$', () => {
    it('should return an bookingAPI.getBookingTemplateSuccess action, when booking templates get is called successfully', () => {
      const action = actions.bookingAPI.getBookingTemplate({ paramDetails: { paramId: '1020', isClient: false } });
      const bookingTemplateDetail: BookingTemplateDetail = {
        bookingTemplate: {
          id: 100,
          name: 'test',
          bufferTime: 30,
          description: 'test test test',
          duration: 30,
        },
        bookingProduct: {
          id: 100,
          url: 'test',
          imageUrl: '',
          productId: 101,
          productName: 'test',
          uuid: '123-xyz-123',
          zoomLink: 'test',
        },
        bookingMeetingTypes: [{ id: 1, name: 'Inbound Call' }],
        availabilities: [],
      };
      const completion = actions.bookingAPI.getBookingTemplateSuccess({ bookingTemplateDetail });
      actions$ = hot('-a', { a: action });
      const response = cold('-a', { a: bookingTemplateDetail });
      const expected = cold('--b', { b: completion });
      bookingService.getBookingTemplate = jest.fn(() => response);

      expect(effects.getBookingTemplate$).toBeObservable(expected);
    });

    it('should return an bookingAPI.getBookingTemplateSuccess action, when booking templates get is called successfully', () => {
      const action = actions.bookingAPI.getBookingTemplate({ paramDetails: { paramId: '1020', isClient: true } });
      const bookingTemplateDetail: BookingTemplateDetail = {
        bookingTemplate: {
          id: 100,
          name: 'test',
          bufferTime: 30,
          description: 'test test test',
          duration: 30,
        },
        bookingProduct: {
          id: 100,
          url: 'test',
          imageUrl: '',
          productId: 101,
          productName: 'test',
          uuid: '123-xyz-123',
          zoomLink: 'test',
        },
        bookingMeetingTypes: [{ id: 1, name: 'Inbound Call' }],
        availabilities: [],
      };
      const completion = actions.bookingAPI.getBookingTemplateSuccess({ bookingTemplateDetail });
      actions$ = hot('-a', { a: action });
      const response = cold('-a', { a: bookingTemplateDetail });
      const expected = cold('--b', { b: completion });
      bookingService.getBookingTemplateByPurchaseId = jest.fn(() => response);

      expect(effects.getBookingTemplate$).toBeObservable(expected);
    });

    it('should return an bookingAPI.getBookingTemplateFailure action, when booking templates get is called unsuccessfully', () => {
      const action = actions.bookingAPI.getBookingTemplate({ paramDetails: { paramId: '1020', isClient: false } });
      const errorMessage = 'Error cancelling appointment';
      const completion = actions.bookingAPI.getBookingTemplateFailure({ error: errorMessage });
      actions$ = hot('-a', { a: action });
      const response = cold('-#|', {}, errorMessage);
      const expected = cold('--b', { b: completion });
      bookingService.getBookingTemplate = jest.fn(() => response);

      expect(effects.getBookingTemplate$).toBeObservable(expected);
    });
  });
});
