import { Component } from '@angular/core';
import { IconColor, IconName } from '@ds24/elements';
import { Day } from './../../../../types/calendar-day.type';
import { Store } from '@ngrx/store';

import * as selectors from '../../../../store/selectors';
import * as actions from '../../../../store/actions';
import { takeUntil } from 'rxjs';
import { ReactiveLifecycles } from '@ds24/utilities';

@Component({
  selector: 'ds-calendar',
  templateUrl: './calendar.component.html',
})
export class CalendarComponent extends ReactiveLifecycles {
  icons: typeof IconName = IconName;
  iconColors: typeof IconColor = IconColor;

  currentMonth$ = this.store
    .select(selectors.calendar.selectCalendarCurrentMonthFormatted)
    .pipe(takeUntil(this.ngOnDestroy$));

  populateCalendarDays$ = this.store.select(selectors.calendar.selectCalenderData).pipe(takeUntil(this.ngOnDestroy$));

  calendarMode$ = this.store.select(selectors.calendar.selectCalendarMode).pipe(takeUntil(this.ngOnDestroy$));

  monthTitle: string | undefined;

  selectedDay: Day | undefined;

  WEEKDAYS = [
    'CALENDAR.DAYS_OF_WEEK_SHORT.MONDAY',
    'CALENDAR.DAYS_OF_WEEK_SHORT.TUESDAY',
    'CALENDAR.DAYS_OF_WEEK_SHORT.WEDNESDAY',
    'CALENDAR.DAYS_OF_WEEK_SHORT.THURSDAY',
    'CALENDAR.DAYS_OF_WEEK_SHORT.FRIDAY',
    'CALENDAR.DAYS_OF_WEEK_SHORT.SATURDAY',
    'CALENDAR.DAYS_OF_WEEK_SHORT.SUNDAY',
  ];

  calenderData: any = [];

  constructor(private store: Store) {
    super();
  }

  nextMonth() {
    this.store.dispatch(actions.calendar.nextMonth());
  }
  prevMonth() {
    this.store.dispatch(actions.calendar.prevMonth());
  }

  selectDay(arg: Day) {
    this.store.dispatch(actions.calendar.selectDay({ day: arg }));
  }
  selectDays(arg: Day) {
    this.store.dispatch(actions.calendar.selectDays({ day: arg }));
  }
}
