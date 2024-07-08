import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, mergeMap, switchMap } from 'rxjs/operators';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as actions from '../store/actions';
import { VendorCalendarService } from '../services/vendor-calendar.service';
import { Action } from '@ngrx/store';

@Injectable()
export class VendorCalendarEffects {
  handleCalendarRequest$ = (requestObservable: Observable<any>): Observable<Action> =>
    requestObservable.pipe(
      mergeMap((calendarData: any) =>
        this.vendorCalendarService
          .setFirstDayOfMonth()
          .pipe(
            mergeMap((firstDayOfMonth: any) =>
              of(
                actions.vendorCalendar.setDaysWithEventsDataSuccess({ daysWithEventsData: calendarData.days }),
                actions.vendorCalendar.setFirstDayOfMonthSuccess({ firstDayOfMonth }),
                actions.vendorAppointment.setTotalNumberOfAppointments({ appointmentTotal: calendarData.total }),
              ),
            ),
          ),
      ),
      catchError((err: any) => of(actions.vendorCalendar.setErrorMessage({ ErrorMessage: err.message }))),
    );

  populateInitialCalendarDays$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.vendorCalendar.populateInitialCalendarDays),
      switchMap(() => this.handleCalendarRequest$(this.vendorCalendarService.populateInitialCalendarDays())),
    ),
  );

  getNextMonth$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.vendorCalendar.getNextMonth),
      switchMap(() => this.handleCalendarRequest$(this.vendorCalendarService.getNextMonth())),
    ),
  );

  getPrevMonth$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.vendorCalendar.getPrevMonth),
      switchMap(() => this.handleCalendarRequest$(this.vendorCalendarService.getPrevMonth())),
    ),
  );

  constructor(
    private actions$: Actions,
    private vendorCalendarService: VendorCalendarService,
  ) {}
}
