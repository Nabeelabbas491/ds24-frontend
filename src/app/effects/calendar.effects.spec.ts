import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { State, actions, selectors } from '../store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold, hot } from 'jasmine-marbles';
import { CalendarEffects } from './calendar.effects';
import {
  SELECTED_DAYS_MOCK,
  SELECTED_DAY_MOCK,
  calendarPopulatedDays,
  daysMock,
} from './../types/calendar-day.type.mock';
import { format, isToday, parseISO, isPast } from 'date-fns';
import { Day } from '../types/calendar-day.type';
import { BookingService } from '../services/booking.service';
import { HttpClientModule } from '@angular/common/http';
import { bookingTemplateMock } from '../types/booking-template.mock';
import { TranslateModule } from '@ngx-translate/core';
import { weekSchedule } from '../types/vendor.types.mock';

describe('BookingEffects', () => {
  let effects: CalendarEffects;
  let bookingService: BookingService;
  let actions$: Observable<any>;
  let mockStore: MockStore<State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CalendarEffects,
        BookingService,
        {
          provide: bookingService,
          useValue: { getCalendarEntries: jest.fn() },
        },
        provideMockActions(() => actions$),
        provideMockStore({
          selectors: [
            { selector: selectors.calendar.selectCalendarDays, value: daysMock },
            { selector: selectors.calendar.selectCalendarCurrentMonth, value: new Date('2023-12-01').toJSON() },
            { selector: selectors.calendar.selectCalendarMode, value: 'clientbooking' },
            { selector: selectors.calendar.selectCalendarSelectedDay, value: SELECTED_DAY_MOCK },
            { selector: selectors.calendar.selectCalendarSelectedDays, value: SELECTED_DAYS_MOCK },
            {
              selector: selectors.bookingAPI.selectBookingTemplateSuccess,
              value: bookingTemplateMock,
            },
            {
              selector: selectors.vendorSchedule.selectVendorSchedule,
              value: weekSchedule,
            },
          ],
        }),
      ],
      imports: [HttpClientModule, TranslateModule.forRoot()],
    });

    effects = TestBed.inject(CalendarEffects);
    bookingService = TestBed.inject(BookingService);
    actions$ = TestBed.inject(Actions);
    mockStore = TestBed.inject(MockStore);
    jest.spyOn(mockStore, 'dispatch');
  });

  describe('calendarEffect$', () => {
    it('calendarEffects$ should be created', () => {
      const action = actions.calendar.currentMonth();

      actions$ = hot('-a', { a: action });

      expect(effects.calendarEffect$).toBeTruthy();
    });
  });

  describe('calendarEffect$', () => {
    it('calendarEffects$ should return expected values', () => {
      const action = actions.calendar.currentMonth();

      const completion = actions.calendar.populateCalendar({
        days: calendarPopulatedDays.map(x => {
          x.isPast = !isToday(parseISO(x.dayMonthYearTitle)) && isPast(parseISO(x.dayMonthYearTitle));
          x.isToday = isToday(parseISO(x.dayMonthYearTitle));
          x.isSelected = x.dayMonthYearTitle === SELECTED_DAY_MOCK.dayMonthYearTitle;
          return x;
        }),
      });
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.calendarEffect$).toBeObservable(expected);
    });
  });

  describe('selectDayEffect$', () => {
    it('isSelected property of selectedDay is set to true', () => {
      const day: Day = {
        number: 26,
        isToday: true,
        isSelected: true,
        isOtherMonth: false,
        isSelectable: true,
        isPast: false,
        dayMonthYearTitle: '2023-12-26',
        slotsArr: [
          { startTime: '09:00', endTime: '09:30' },
          { startTime: '10:00', endTime: '10:30' },
          { startTime: '11:00', endTime: '11:30' },
          { startTime: '12:00', endTime: '12:30' },
        ],
      };

      const days: Day[] = [...daysMock].map(x => {
        return { ...x, isSelected: x.dayMonthYearTitle === day.dayMonthYearTitle };
      });

      const action = actions.calendar.selectDay({ day });
      const completion = actions.calendar.updateCalendarDays({ days });

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.selectDayEffect$).toBeObservable(expected);
    });
  });

  describe('attemptDefaultDaySelectionForCurrentMonth$', () => {
    it('should dispatch default day action if calendar is populated for current month', () => {
      mockStore.overrideSelector(selectors.calendar.selectCalendarCurrentMonth, format(new Date(), 'yyyy-MM-01'));
      mockStore.overrideSelector(selectors.calendar.selectCalendarSelectedDay, null);

      const action = actions.calendar.populateCalendar({
        days: calendarPopulatedDays.map(x => {
          x.isPast = !isToday(parseISO(x.dayMonthYearTitle)) && isPast(parseISO(x.dayMonthYearTitle));
          x.isToday = isToday(parseISO(x.dayMonthYearTitle));
          return x;
        }),
      });
      const completion = actions.calendar.selectDefaultDay();

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.attemptDefaultDaySelectionForCurrentMonth$).toBeObservable(expected);
    });
  });

  describe('selectDefaultDayEffect$', () => {
    it('should not dispatch default day if criteria for selectDefaultDay is not met', () => {
      mockStore.overrideSelector(
        selectors.calendar.selectCalendarDays,
        daysMock.map(x => {
          return { ...x, isSelectable: false };
        }),
      );

      const action = actions.calendar.selectDefaultDay();

      actions$ = hot('-a', { a: action });
      const expected = cold('');

      expect(effects.selectDefaultDayEffect$).toBeObservable(expected);
    });
  });

  describe('setCalenderDataEffect$', () => {
    it('should  dispatch setCalenderData action when populateCalendar action is dispatched', () => {
      const day1 = {
        dayMonthYearTitle: '2024-02-26',
        isOtherMonth: true,
        isPast: true,
        isSelectable: true,
        isSelected: false,
        isToday: false,
        number: 26,
        slotsArr: [],
      };

      const day2 = {
        dayMonthYearTitle: '2024-02-27',
        isOtherMonth: true,
        isPast: true,
        isSelectable: true,
        isSelected: false,
        isToday: false,
        number: 27,
        slotsArr: [],
      };

      const days = [day1, day2];

      const action = actions.calendar.populateCalendar({ days: days });

      const calenderData: any = [days, [], [], [], [], [], []];

      const completion = actions.calendar.setCalenderData({ calenderData });

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.setCalenderDataEffect$).toBeObservable(expected);
    });
  });
});
