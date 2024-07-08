import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as actions from './../store/actions';
import { filter, map, withLatestFrom } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectors } from '../store';

@Injectable()
export class BookingEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
  ) {}

  selectBookingDay$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.calendar.selectDay),
      map(arg => {
        return actions.booking.selectDay({ day: arg.day });
      }),
    ),
  );

  selectTimezoneEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.booking.timeZone),
      withLatestFrom(this.store.select(selectors.calendar.selectCalendarSelectedDay)),
      filter(([, selectedDay]) => selectedDay !== null),
      map(([, selectedDay]) => {
        return actions.bookingAPI.getBookingTimeSlots({ date: selectedDay!.dayMonthYearTitle });
      }),
    ),
  );

  selectTimeSlotEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.booking.timeSlot),
      withLatestFrom(this.store.select(selectors.booking.selectPrevTimeSlot)),
      map(([{ timeSlot }, previousTS]) => {
        if (previousTS?.startTime === timeSlot?.startTime) {
          return actions.booking.timeSlot({ timeSlot: null });
        }
        return actions.booking.prevTimeSlot({ prevTimeSlot: timeSlot });
      }),
    ),
  );

  editBookingEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.booking.editBooking),
      map(() => {
        return actions.booking.selectStep({ step: 'calendar' });
      }),
    ),
  );
}
