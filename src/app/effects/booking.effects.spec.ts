import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { actions, selectors } from '../store';
import { provideMockStore } from '@ngrx/store/testing';
import { BookingEffects } from './booking.effects';
import { cold, hot } from 'jasmine-marbles';
import { BookingService } from '../services/booking.service';
import { Day, Slot } from './../types/calendar-day.type';
import { SELECTED_DAY_MOCK } from '../types/calendar-day.type.mock';

describe('BookingEffects', () => {
  let effects: BookingEffects;

  let actions$: Observable<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BookingEffects,
        BookingService,
        provideMockActions(() => actions$),
        provideMockStore({
          selectors: [
            { selector: selectors.booking.selectPrevTimeSlot, value: { startTime: '10:00', endTime: '10:30' } },
            { selector: selectors.calendar.selectCalendarSelectedDay, value: SELECTED_DAY_MOCK },
          ],
        }),
      ],
    });

    effects = TestBed.inject(BookingEffects);
    actions$ = TestBed.inject(Actions);
  });

  describe('selectBookingDay$', () => {
    it('should call selectDay action of booking if selectDay of calendar is called.', () => {
      const day: Day = {
        number: 26,
        isToday: true,
        isSelected: false,
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

      const action = actions.calendar.selectDay({ day });
      const completion = actions.booking.selectDay({ day });

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.selectBookingDay$).toBeObservable(expected);
    });
  });

  describe('selectTimeSlotEffect$', () => {
    it('should return an empty timeslot if timeslot is same as previous timeslot', () => {
      const curTimeSlot: Slot = { startTime: '10:00', endTime: '10:30' };
      const emptyTimeSlot: Slot | null = null;

      const action = actions.booking.timeSlot({ timeSlot: curTimeSlot });
      const completion = actions.booking.timeSlot({ timeSlot: emptyTimeSlot });

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.selectTimeSlotEffect$).toBeObservable(expected);
    });
  });

  describe('selectTimeZoneEffect$', () => {
    it('should return an bookingAPI.saveBookingSuccess action, with booking information if save booking succeeds', () => {
      const timeZone: string = 'UTC';

      const action = actions.booking.timeZone({ timeZone });
      const completion = actions.bookingAPI.getBookingTimeSlots({ date: SELECTED_DAY_MOCK.dayMonthYearTitle });

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.selectTimezoneEffect$).toBeObservable(expected);
    });
  });

  describe('selectTimeSlotEffect$', () => {
    it('should set previous timeslot if current timeslot is different from previous timeslot', () => {
      const curTimeSlot: Slot = { startTime: '11:00', endTime: '11:30' };
      const prevTimeSlot: Slot = { startTime: '11:00', endTime: '11:30' };

      const action = actions.booking.timeSlot({ timeSlot: curTimeSlot });
      const completion = actions.booking.prevTimeSlot({ prevTimeSlot: prevTimeSlot });

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.selectTimeSlotEffect$).toBeObservable(expected);
    });
  });

  describe('editBookingEffect$', () => {
    it('edit booking action should raise slectStep action with selected step as "calendar" step', () => {
      const action = actions.booking.editBooking();
      const completion = actions.booking.selectStep({ step: 'calendar' });

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.editBookingEffect$).toBeObservable(expected);
    });
  });
});
