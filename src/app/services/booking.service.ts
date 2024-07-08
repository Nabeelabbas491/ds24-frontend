import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { BookingTemplateDetail, CreateBooking, CreateBookingResponse } from '../types/booking.type';
import { GenericResponse } from '../types/misc.type';
import { environment } from './../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { NO_AUTHORIZATION_HEADER, getErrorMessage } from '../shared/common/util';
import { TimeSlotAvailability } from '../types/availability';
import { Slot } from '../types/calendar-day.type';

@Injectable()
export class BookingService {
  private env = environment;
  constructor(
    private httpClient: HttpClient,
    private translate: TranslateService,
  ) {}
  createBooking(productId: string, booking: CreateBooking): Observable<CreateBookingResponse> {
    return this.httpClient
      .post<GenericResponse<CreateBookingResponse>>(
        `${this.env.apiUrl}/appointments/${productId}/book`,
        booking,
        NO_AUTHORIZATION_HEADER,
      )
      .pipe(
        map(x => {
          return x.data;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => getErrorMessage(error));
        }),
      );
  }
  getBookingTemplate(productId: string): Observable<BookingTemplateDetail> {
    return this.httpClient
      .get<GenericResponse<BookingTemplateDetail>>(`${this.env.apiUrl}/booking-templates/product/${productId}`)
      .pipe(
        map(x => {
          const bookingTemplateDetail = x.data;
          if (!bookingTemplateDetail.bookingMeetingTypes || bookingTemplateDetail.bookingMeetingTypes.length == 0) {
            throw new Error(this.translate.instant('BOOKING.BOOKING_OTHER.MEETING_TYPES_NOT_DEFINED'));
          }
          return bookingTemplateDetail;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => getErrorMessage(error));
        }),
      );
  }

  getBookingTemplateByPurchaseId(purchaseId: string): Observable<BookingTemplateDetail> {
    return this.httpClient
      .get<GenericResponse<BookingTemplateDetail>>(
        `${this.env.apiUrl}/booking-templates/purchase/${purchaseId}`,
        NO_AUTHORIZATION_HEADER,
      )
      .pipe(
        map(x => {
          const bookingTemplateDetail = x.data;
          if (!bookingTemplateDetail.bookingMeetingTypes || bookingTemplateDetail.bookingMeetingTypes.length == 0) {
            throw new Error(this.translate.instant('BOOKING.BOOKING_OTHER.MEETING_TYPES_NOT_DEFINED'));
          }
          return bookingTemplateDetail;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => getErrorMessage(error));
        }),
      );
  }
  getTimeSlots(date: string, bookingProductId: number, timeZone: string): Observable<Slot[]> {
    return this.httpClient
      .get<GenericResponse<TimeSlotAvailability>>(
        `${this.env.apiUrl}/schedule/timeslots?date=${date}&productId=${bookingProductId}&timeZone=${timeZone}`,
        NO_AUTHORIZATION_HEADER,
      )
      .pipe(
        map(x =>
          x.data.availableTimeSlots.map(timeSlot => {
            return { startTime: timeSlot.from, endTime: timeSlot.to } as Slot;
          }),
        ),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => getErrorMessage(error));
        }),
      );
  }
  downloadClientICS(appointmentId: number) {
    return this.httpClient
      .get(`${this.env.apiUrl}/appointments/${appointmentId}/ics-client`, { responseType: 'blob' })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => getErrorMessage(error));
        }),
      );
  }
}
