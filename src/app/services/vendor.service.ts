import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, forkJoin, map, of, throwError } from 'rxjs';
import {
  BookingTemplateCollection,
  SaveBookingTemplate,
  MeetingProduct,
  DayDetail,
  AppointmentDetails,
  AppointmentListParams,
  AppointmentList,
  WeekSchedule,
} from '../types/vendor.types';
import { environment } from './../../environments/environment';
import { GenericResponse, MeetingType } from '../types/misc.type';
import { dayDetails } from '../types/vendor.types.mock';
import { getErrorMessage } from '../shared/common/util';
import { BookingTemplateList, BookingTemplateListItem } from '../types/vendor.booking-template.type';
import { VendorSettingsService } from './vendor-settings.service';
import { VendorSettingCollection } from '../types/vendor-settings.type';

@Injectable()
export class VendorService {
  private env = environment;
  constructor(
    private httpClient: HttpClient,
    private vendorSetting: VendorSettingsService,
  ) {}
  dayDetails: DayDetail[] = dayDetails;

  getBookingTemplateList(page: number): Observable<BookingTemplateList> {
    return this.httpClient
      .get<GenericResponse<BookingTemplateList>>(`${this.env.apiUrl}/booking-templates/list?page=${page}`)
      .pipe(
        map((x: any) => x.data),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => getErrorMessage(error));
        }),
      );
  }
  getBookingTemplateDetails(bookingTemplateId: number): Observable<BookingTemplateListItem> {
    return this.httpClient
      .get<GenericResponse<BookingTemplateListItem>>(`${this.env.apiUrl}/booking-templates/${bookingTemplateId}`)
      .pipe(
        map((x: any) => x.data),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => getErrorMessage(error));
        }),
      );
  }

  getInitialDayData(): Observable<DayDetail[]> {
    return of<DayDetail[]>(this.dayDetails);
  }

  getMeetingTypes(): Observable<MeetingType[]> {
    return this.httpClient
      .get<GenericResponse<MeetingType>>(`${this.env.apiUrl}/meeting-types`)
      .pipe(map((x: any) => x.data));
  }
  getMeetingProducts(): Observable<MeetingProduct[]> {
    return this.httpClient
      .get<GenericResponse<MeetingProduct>>(`${this.env.apiUrl}/products/list`)
      .pipe(map((x: any) => x.data));
  }

  getBookingTemplateCollection(bookingTemplateId: number | undefined): Observable<BookingTemplateCollection> {
    const meetingProducts$ = this.getMeetingProducts();
    const bookingTemplateDetail$ = bookingTemplateId ? this.getBookingTemplateDetails(bookingTemplateId) : of(null);
    const vendorSetting$ = this.vendorSetting.getVendorSettings();

    return forkJoin([meetingProducts$, bookingTemplateDetail$, vendorSetting$]).pipe(
      map(([meetingProducts, bookingTemplateDetail, vendorSetting]) => {
        const bookingTemplateCollection: BookingTemplateCollection = {
          meetingProducts: meetingProducts,
          bookingTemplateDetail: bookingTemplateDetail,
          vendorSetting,
          modalState: bookingTemplateId ? 'edit' : 'create',
        };
        return bookingTemplateCollection;
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error.statusText);
      }),
    );
  }

  insertBookingTemplate(bookingTemplate: SaveBookingTemplate): Observable<GenericResponse<any>> {
    return this.httpClient
      .post<GenericResponse<any>>(`${this.env.apiUrl}/booking-templates/create`, bookingTemplate)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => getErrorMessage(error));
        }),
      );
  }
  updateBookingTemplate(
    bookingTemplateId: number,
    bookingTemplate: SaveBookingTemplate,
  ): Observable<GenericResponse<any>> {
    return this.httpClient
      .put<GenericResponse<any>>(`${this.env.apiUrl}/booking-templates/${bookingTemplateId}/update`, bookingTemplate)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => getErrorMessage(error));
        }),
      );
  }

  getAppointmentListData(listParams: AppointmentListParams): Observable<AppointmentList> {
    let params = new HttpParams();

    Object.keys(listParams).forEach(key => {
      if (listParams[key] !== undefined && listParams[key] !== null) {
        params = params.append(key, String(listParams[key]));
      }
    });

    const appointmentList = this.httpClient
      .get<GenericResponse<AppointmentList>>(`${this.env.apiUrl}/appointments/list`, { params })
      .pipe(
        map(response => response.data),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => getErrorMessage(error));
        }),
      );

    return appointmentList;
  }

  getAppointmentDetailsData(appointmentId: number): Observable<AppointmentDetails> {
    const appointmentResponse = this.httpClient
      .get<GenericResponse<AppointmentDetails>>(`${this.env.apiUrl}/appointments/${appointmentId}`)
      .pipe(
        map(response => response.data),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => getErrorMessage(error));
        }),
      );
    return appointmentResponse;
  }

  cancelAppointment(appointmentId: number): Observable<string> {
    const cancellationMessage = this.httpClient
      .post<GenericResponse<any>>(`${this.env.apiUrl}/appointments/${appointmentId}/cancel`, {})
      .pipe(
        map(response => response.message),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => getErrorMessage(error));
        }),
      );
    return cancellationMessage;
  }

  getVendorScheduleData(): Observable<GenericResponse<WeekSchedule>> {
    return this.httpClient.get<GenericResponse<WeekSchedule>>(`${this.env.apiUrl}/schedule`).pipe(
      map(response => response),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      }),
    );
  }

  createVendorScheduleData(param: WeekSchedule): Observable<GenericResponse<WeekSchedule>> {
    return this.httpClient.post<GenericResponse<WeekSchedule>>(`${this.env.apiUrl}/schedule/create`, param).pipe(
      map(response => response),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => getErrorMessage(error));
      }),
    );
  }

  saveVendorScheduleData(param: WeekSchedule): Observable<GenericResponse<WeekSchedule>> {
    return this.httpClient.put<GenericResponse<WeekSchedule>>(`${this.env.apiUrl}/schedule/update`, param).pipe(
      map(response => response),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => getErrorMessage(error));
      }),
    );
  }

  deleteVendorScheduleData(index: number): Observable<string> {
    return this.httpClient
      .delete<GenericResponse<WeekSchedule>>(`${this.env.apiUrl}/schedule-availability/${index}/delete`)
      .pipe(
        map(response => response.message),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => getErrorMessage(error));
        }),
      );
  }

  getVendorSettingCollection(): Observable<VendorSettingCollection> {
    const meetingTypes$ = this.getMeetingTypes();
    const vendorSetting$ = this.vendorSetting.getVendorSettings();

    return forkJoin([meetingTypes$, vendorSetting$]).pipe(
      map(([meetingTypes, vendorSetting]) => {
        const vendorSettingCollection: VendorSettingCollection = {
          meetingTypes,
          vendorSetting,
          pageState: vendorSetting ? 'edit' : 'create',
        };
        return vendorSettingCollection;
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error.statusText);
      }),
    );
  }

  downloadVendorICS(appointmentId: number): Observable<Blob> {
    return this.httpClient
      .get(`${this.env.apiUrl}/appointments/${appointmentId}/ics-vendor`, {
        responseType: 'blob',
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => getErrorMessage(error));
        }),
      );
  }
}
