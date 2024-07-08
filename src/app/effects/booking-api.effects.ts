import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as actions from './../store/actions';
import { selectors } from './../store';
import { Store } from '@ngrx/store';
import { Observable, catchError, map, mergeMap, of, switchMap, withLatestFrom } from 'rxjs';
import { BookingSaveSuccess, BookingTemplateDetail, CreateBooking } from '../types/booking.type';
import { BookingService } from '../services/booking.service';
import { DsSnackbarService } from '@ds24/elements';
import { DEFAULT_PRODUCT_IMAGAE, TEMP_VENDOR_NAME, downloadFile, isNoScheduleExist } from '../shared/common/util';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class BookingAPIEffects {
  getBookingTemplate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.bookingAPI.getBookingTemplate),
      switchMap(arg => {
        let getBookingTemplate$: Observable<BookingTemplateDetail> = this.bookingService.getBookingTemplate(
          arg.paramDetails.paramId,
        );

        if (arg.paramDetails.isClient) {
          getBookingTemplate$ = this.bookingService.getBookingTemplateByPurchaseId(arg.paramDetails.paramId);
        }

        return getBookingTemplate$.pipe(
          map(bookingTemplateDetail => actions.bookingAPI.getBookingTemplateSuccess({ bookingTemplateDetail })),
          catchError(error => {
            this.snackbarService.openSnackbar({ title: error, type: 'error' });
            return of(actions.bookingAPI.getBookingTemplateFailure({ error }));
          }),
        );
      }),
    ),
  );

  getBookingTemplateSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.bookingAPI.getBookingTemplateSuccess),
      mergeMap(arg => {
        if (isNoScheduleExist(arg.bookingTemplateDetail.availabilities)) {
          this.snackbarService.openSnackbar({
            title: this.translateService.instant('BOOKING.BOOKING_OTHER.NO_SCHEDULE_EXISTS'),
            type: 'error',
          });
        }
        return of(
          actions.booking.meetingType({ meetingType: arg.bookingTemplateDetail.bookingMeetingTypes[0] }),
          actions.calendar.resetCalendar(),
          actions.calendar.currentMonth(),
          actions.calendar.setMode({ mode: 'clientbooking' }),
          actions.booking.setBookingTemplateSummary({
            bookingTemplateSummary: {
              heading: arg.bookingTemplateDetail.bookingProduct.productName,
              duration: arg.bookingTemplateDetail.bookingTemplate.duration,
              userName: TEMP_VENDOR_NAME,
              imageUrl: arg.bookingTemplateDetail.bookingProduct.imageUrl || DEFAULT_PRODUCT_IMAGAE,
            },
          }),
        );
      }),
    ),
  );

  getBookingTimeSlots$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.bookingAPI.getBookingTimeSlots),
      withLatestFrom(
        this.store.select(selectors.bookingAPI.selectBookingProduct),
        this.store.select(selectors.booking.selectTimeZone),
      ),
      switchMap(([action, bookingProduct, timeZone]) => {
        return this.bookingService.getTimeSlots(action.date, bookingProduct!.id, timeZone).pipe(
          map(timeSlots => actions.bookingAPI.getBookingTimeSlotsSuccess({ timeSlots })),
          catchError(error => {
            this.snackbarService.openSnackbar({ title: error, type: 'error' });
            return of(actions.bookingAPI.getBookingTimeSlotsFailure({ error }));
          }),
        );
      }),
    ),
  );

  downloadClientICS$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.bookingAPI.downloadClientICS),
      switchMap(action => {
        return this.bookingService.downloadClientICS(action.appointmentId).pipe(
          map(icsContent => {
            downloadFile(icsContent, 'appointment.ics');
            return actions.bookingAPI.downloadClientICSSuccess();
          }),
          catchError(error => {
            this.snackbarService.openSnackbar({ title: error, type: 'error' });
            return of(actions.bookingAPI.downloadClientICSFailure({ error }));
          }),
        );
      }),
    ),
  );

  saveBooking$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.bookingAPI.saveBooking),
      withLatestFrom(
        this.store.select(selectors.booking.selectSelectedDay),
        this.store.select(selectors.booking.selectMeetingType),
        this.store.select(selectors.booking.selectTimeZone),
        this.store.select(selectors.booking.selectTimeSlot),
        this.store.select(selectors.bookingAPI.selectBookingProductId),
      ),
      map(([arg, day, meetingType, timeZone, timeSlot, productId]) => {
        const booking: CreateBooking = {
          name: arg.bookingDetail.name,
          email: arg.bookingDetail.email,
          phoneNo: arg.bookingDetail.phoneNo,
          note: arg.bookingDetail.note,
          date: day?.dayMonthYearTitle,
          meetingType: meetingType?.id,
          timeZone,
          startTime: timeSlot?.startTime,
        };
        return { productId, booking, timeSlot };
      }),
      switchMap(({ productId, booking, timeSlot }) =>
        this.bookingService.createBooking(productId!, booking).pipe(
          withLatestFrom(this.store.select(selectors.booking.selectMeetingType)),
          map(([createBookingResponse, meetingType]) => {
            const bookingSaveSuccess: BookingSaveSuccess = {
              appointmentId: createBookingResponse.appointmentId,
              zoomLink: createBookingResponse.zoomLink,
              vendorPhoneNumber: createBookingResponse.phoneNumber,
              name: booking.name,
              timeSlot,
              dayTitle: booking.date,
              meetingTypeDetail: meetingType,
            };
            return actions.bookingAPI.saveBookingSuccess({ bookingSaveSuccess });
          }),
          catchError(error => of(actions.bookingAPI.saveBookingFailure({ error }))),
        ),
      ),
    ),
  );

  saveBookingSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.bookingAPI.saveBookingSuccess),
      mergeMap(arg =>
        of(
          actions.booking.completeBooking({ bookingSaveSuccess: arg.bookingSaveSuccess }),
          actions.booking.selectStep({ step: 'summary' }),
        ),
      ),
    ),
  );

  constructor(
    private actions$: Actions,
    private store: Store,
    private translateService: TranslateService,
    private bookingService: BookingService,
    private snackbarService: DsSnackbarService,
  ) {}
}
