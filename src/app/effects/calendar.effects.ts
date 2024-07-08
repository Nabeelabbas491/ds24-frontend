import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { filter, map, withLatestFrom } from 'rxjs';
import * as actions from './../store/actions';
import * as selectors from './../store/selectors';
import { Day } from './../types/calendar-day.type';
import { Store } from '@ngrx/store';
import { parseISO, getDate, isThisMonth } from 'date-fns';
import {
  getDaysForCalendar,
  checkIfDaySelected,
  getDaysForOverrides,
  checkIfDayRangeIncludesSelectedDay,
} from '../shared/common/calendar-util';

@Injectable()
export class CalendarEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
  ) {}

  calendarEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        actions.calendar.currentMonth,
        actions.calendar.nextMonth,
        actions.calendar.prevMonth,
        actions.calendar.navigateToMonth,
      ),
      withLatestFrom(
        this.store.select(selectors.calendar.selectCalendarCurrentMonth),
        this.store.select(selectors.calendar.selectCalendarMode),
        this.store.select(selectors.calendar.selectCalendarSelectedDay),
        this.store.select(selectors.calendar.selectCalendarSelectedDays),
        this.store.select(selectors.bookingAPI.selectBookingTemplateSuccess),
      ),
      map(([, currentMonth, mode, selectedDay, selectedDays, bookingTemplateDetail]) => {
        let days: Day[] = [];

        if (mode === 'clientbooking' && bookingTemplateDetail) {
          days = [...days.concat(getDaysForCalendar(currentMonth, selectedDay, bookingTemplateDetail))];
        }

        if (mode === 'dateoverride') {
          days = [...days.concat(getDaysForOverrides(currentMonth, selectedDays))];
        }

        return actions.calendar.populateCalendar({ days });
      }),
    ),
  );

  selectTimeSlotsOnDaySelection$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.calendar.selectDay),
      filter(action => action.day !== null),
      map(action => {
        return actions.bookingAPI.getBookingTimeSlots({ date: action.day!.dayMonthYearTitle });
      }),
    ),
  );

  selectDayEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.calendar.selectDay, actions.calendar.selectDays),
      withLatestFrom(
        this.store.select(selectors.calendar.selectCalendarDays),
        this.store.select(selectors.calendar.selectCalendarMode),
        this.store.select(selectors.vendorSchedule.selectVendorSchedule),
      ),
      map(([action, calendarDays, calendarMode, weekData]) => {
        const newDays: Day[] = calendarDays.reduce((days: Day[], day: Day) => {
          return [...days, { ...day, isSelected: checkIfDaySelected(calendarMode, day, action.day) }];
        }, []);

        const daySelected = newDays.some(day => {
          return day.isSelected === true;
        });

        if (daySelected === false) {
          this.store.dispatch(actions.vendorSchedule.resetOpenedOverrideTimeSlots());
        } else {
          weekData.availabilities
            .filter(day => day.type === 'override')
            .forEach(day => {
              if (checkIfDayRangeIncludesSelectedDay(day, action.day)) {
                this.store.dispatch(actions.vendorSchedule.updateOpenedOverrideTimeslots({ slots: day.slot }));
              }
            });
        }
        return actions.calendar.updateCalendarDays({ days: newDays });
      }),
    ),
  );

  attemptDefaultDaySelectionForCurrentMonth$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.calendar.populateCalendar),
      withLatestFrom(
        this.store.select(selectors.calendar.selectCalendarCurrentMonth),
        this.store.select(selectors.calendar.selectCalendarSelectedDay),
        this.store.select(selectors.calendar.selectCalendarMode),
      ),
      filter(
        ([, currentMonth, selectedDay, selectedMode]) =>
          isThisMonth(parseISO(currentMonth)) && selectedDay === null && selectedMode === 'clientbooking',
      ),
      map(() => {
        return actions.calendar.selectDefaultDay();
      }),
    ),
  );

  selectDefaultDayEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.calendar.selectDefaultDay),
      withLatestFrom(this.store.select(selectors.calendar.selectCalendarDays)),
      map(
        ([, calendarDays]) =>
          calendarDays.find(
            x => getDate(parseISO(x.dayMonthYearTitle)) >= getDate(new Date()) && !x.isPast && x.isSelectable,
          ) ?? null,
      ),
      filter(selectedDay => selectedDay !== null),
      map(selectedDay => actions.calendar.selectDay({ day: selectedDay })),
    ),
  );

  setCalenderDataEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.calendar.populateCalendar),
      map((action: any) => {
        const colsIndexes = [0, 1, 2, 3, 4, 5, 6];
        const calenderData: any = [];
        for (const outerIndex of colsIndexes) {
          const calendarSingleRowDays = [];
          for (const number of colsIndexes) {
            const day = action.days[number + outerIndex * 7];
            day && calendarSingleRowDays.push(day);
          }
          calenderData.push(calendarSingleRowDays);
        }
        return actions.calendar.setCalenderData({ calenderData });
      }),
    ),
  );
}
