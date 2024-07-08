import { add, eachDayOfInterval, endOfMonth, endOfWeek, format, parse, startOfToday, startOfWeek } from 'date-fns';
import {
  AppointmentDetails,
  AppointmentList,
  AppointmentListParams,
  CalendarData,
  CalendarDayDetails,
} from '../types/vendor.types';
import { Observable, catchError, map, of, switchMap, throwError } from 'rxjs';
import { InitialEventsData } from '../types/vendor.types.mock';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { GenericResponse } from '../types/misc.type';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { getDaysInMonthsData, getErrorMessage } from '../shared/common/util';

@Injectable()
export class VendorCalendarService {
  today = startOfToday();
  currMonth: string = '';
  firstDayOfMonth: Date = new Date(this.today.getFullYear(), this.today.getMonth(), 1);
  daysInMonth: Date[] = [];
  initialDaysData: CalendarDayDetails[] = InitialEventsData;
  appointmentsData: AppointmentDetails[] = [];
  daysWithEventsData: CalendarDayDetails[] = [];
  selectedMonth: number = this.today.getMonth() + 1;
  selectedYear: number = this.today.getFullYear();
  constructor(private httpClient: HttpClient) {}

  populateInitialCalendarDays(): Observable<CalendarData> {
    this.currMonth = format(this.today, 'MMM-yyyy');
    const month = this.today.getMonth() + 1;
    const year = this.today.getFullYear();
    return this.getCalendarDays(month, year);
  }

  getCalendarDays(month: number, year: number): Observable<CalendarData> {
    return this.getAppointmentCalendarData(month, year).pipe(
      switchMap(days => {
        this.appointmentsData = days.appointments;
        const calendarDays: CalendarData = {
          days: this.setDaysWithEventsData(),
          total: days.total as number,
        };
        return of(calendarDays);
      }),
    );
  }

  getPrevMonth(): Observable<CalendarData> {
    const firstDayOfPrevMonth = add(parse(this.currMonth, 'MMM-yyyy', new Date()), { months: -1 });
    return this.setCurrMonth(format(firstDayOfPrevMonth, 'MMM-yyyy'));
  }

  getNextMonth(): Observable<CalendarData> {
    const firstDayOfNextMonth = add(parse(this.currMonth, 'MMM-yyyy', new Date()), { months: 1 });
    return this.setCurrMonth(format(firstDayOfNextMonth, 'MMM-yyyy'));
  }

  setCurrMonth(month: string): Observable<CalendarData> {
    this.currMonth = month;
    const parsedDate = parse(month, 'MMM-yyyy', new Date());
    this.selectedMonth = parsedDate.getMonth() + 1;
    this.selectedYear = parsedDate.getFullYear();
    return this.getCalendarDays(this.selectedMonth, this.selectedYear);
  }

  setDaysWithEventsData(): CalendarDayDetails[] {
    this.firstDayOfMonth = parse(this.currMonth, 'MMM-yyyy', new Date());
    const firstMondayOfMonth = startOfWeek(this.firstDayOfMonth, { weekStartsOn: 1 });
    const lastSundayOfMonth = endOfWeek(endOfMonth(this.firstDayOfMonth), { weekStartsOn: 1 });
    const allDaysInMonthOfAllWeeks = eachDayOfInterval({ start: firstMondayOfMonth, end: lastSundayOfMonth });

    this.daysWithEventsData = getDaysInMonthsData(
      allDaysInMonthOfAllWeeks,
      this.appointmentsData,
      this.firstDayOfMonth,
    );
    return this.daysWithEventsData;
  }

  setFirstDayOfMonth(): Observable<string> {
    return of(this.firstDayOfMonth.toJSON());
  }

  getAppointmentCalendarData(month: number, year: number): Observable<AppointmentList> {
    const listParams: AppointmentListParams = {
      month: month,
      year: year,
    };

    let params = new HttpParams();

    Object.keys(listParams).forEach(key => {
      if (listParams[key] !== undefined && listParams[key] !== null) {
        params = params.append(key, String(listParams[key]));
      }
    });

    const appointmentList = this.httpClient
      .get<GenericResponse<AppointmentList>>(`${environment.apiUrl}/appointments/list`, { params })
      .pipe(
        map(response => response.data),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => getErrorMessage(error));
        }),
      );

    return appointmentList;
  }
}
