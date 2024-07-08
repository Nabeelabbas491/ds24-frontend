import { Observable, of } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { actions } from '../store';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { VendorCalendarEffects } from './vendor.calendar.effects';
import { cold, hot } from 'jasmine-marbles';
import { VendorCalendarService } from '../services/vendor-calendar.service';
import { CalendarDayDetails } from '../types/vendor.types';

describe('VendorCalendarEffects', () => {
  let effects: VendorCalendarEffects;
  let actions$: Observable<any>;
  let vendorService: VendorCalendarService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        VendorCalendarEffects,
        provideMockActions(() => actions$),
        {
          provide: VendorCalendarService,
          useValue: { populateInitialCalendarDays: jest.fn() },
        },
      ],
    });

    effects = TestBed.inject(VendorCalendarEffects);
    actions$ = TestBed.inject(Actions);
    vendorService = TestBed.inject(VendorCalendarService);
  });

  describe('populateInitialCalendarDays$', () => {
    it('should return the correct actions on success', () => {
      const daysWithEventsData: CalendarDayDetails[] = [
        {
          date: new Date('22 November 2023'),
          eventsData: [],
        },
        {
          date: new Date('23 November 2023'),
          eventsData: [],
          isSameMonth: true,
        },
      ];
      const firstDayOfMonth = new Date('1 November 2023').toJSON();

      vendorService.populateInitialCalendarDays = jest.fn(() =>
        of({ days: daysWithEventsData, total: daysWithEventsData.length }),
      );
      vendorService.setFirstDayOfMonth = jest.fn(() => of(firstDayOfMonth));

      const expectedActions = [
        actions.vendorCalendar.setDaysWithEventsDataSuccess({ daysWithEventsData }),
        actions.vendorCalendar.setFirstDayOfMonthSuccess({ firstDayOfMonth }),
        actions.vendorAppointment.setTotalNumberOfAppointments({ appointmentTotal: 2 }),
      ];

      actions$ = hot('-a-', { a: actions.vendorCalendar.populateInitialCalendarDays() });
      const expected$ = cold('-(abc)', { a: expectedActions[0], b: expectedActions[1], c: expectedActions[2] });

      expect(effects.populateInitialCalendarDays$).toBeObservable(expected$);
    });

    it('should return the correct action on error', () => {
      const errorMessage = 'Some error message';
      const errorObs = cold('#', null, { message: errorMessage });
      vendorService.populateInitialCalendarDays = jest.fn(() => errorObs);

      const expectedAction = actions.vendorCalendar.setErrorMessage({ ErrorMessage: errorMessage });

      actions$ = hot('-a-', { a: actions.vendorCalendar.populateInitialCalendarDays() });
      const expected$ = cold('-b', { b: expectedAction });

      expect(effects.populateInitialCalendarDays$).toBeObservable(expected$);
    });
  });

  describe('getNextMonth$', () => {
    it('should return the correct actions on success', () => {
      const daysWithEventsData: CalendarDayDetails[] = [
        {
          date: new Date('22 November 2023'),
          eventsData: [],
        },
        {
          date: new Date('23 November 2023'),
          eventsData: [],
          isSameMonth: true,
        },
      ];
      const firstDayOfMonth = new Date('1 November 2023').toJSON();

      vendorService.getNextMonth = jest.fn(() => of({ days: daysWithEventsData, total: daysWithEventsData.length }));
      vendorService.setFirstDayOfMonth = jest.fn(() => of(firstDayOfMonth));

      const expectedActions = [
        actions.vendorCalendar.setDaysWithEventsDataSuccess({ daysWithEventsData }),
        actions.vendorCalendar.setFirstDayOfMonthSuccess({ firstDayOfMonth }),
        actions.vendorAppointment.setTotalNumberOfAppointments({ appointmentTotal: 2 }),
      ];

      actions$ = hot('-a-', { a: actions.vendorCalendar.getNextMonth() });
      const expected$ = cold('-(abc)', { a: expectedActions[0], b: expectedActions[1], c: expectedActions[2] });

      expect(effects.getNextMonth$).toBeObservable(expected$);
    });

    it('should return the correct action on error', () => {
      const errorMessage = 'Some error message';
      const errorObs = cold('#', null, { message: errorMessage });
      vendorService.getNextMonth = jest.fn(() => errorObs);

      const expectedAction = actions.vendorCalendar.setErrorMessage({ ErrorMessage: errorMessage });

      actions$ = hot('-a-', { a: actions.vendorCalendar.getNextMonth() });
      const expected$ = cold('-b', { b: expectedAction });

      expect(effects.getNextMonth$).toBeObservable(expected$);
    });
  });

  describe('getPrevMonth$', () => {
    it('should return the correct actions on success', () => {
      const daysWithEventsData: CalendarDayDetails[] = [
        {
          date: new Date('22 November 2023'),
          eventsData: [],
        },
        {
          date: new Date('23 November 2023'),
          eventsData: [],
          isSameMonth: true,
        },
      ];
      const firstDayOfMonth = new Date('1 November 2023').toJSON();

      vendorService.getPrevMonth = jest.fn(() => of({ days: daysWithEventsData, total: daysWithEventsData.length }));
      vendorService.setFirstDayOfMonth = jest.fn(() => of(firstDayOfMonth));

      const expectedActions = [
        actions.vendorCalendar.setDaysWithEventsDataSuccess({ daysWithEventsData }),
        actions.vendorCalendar.setFirstDayOfMonthSuccess({ firstDayOfMonth }),
        actions.vendorAppointment.setTotalNumberOfAppointments({ appointmentTotal: 2 }),
      ];

      actions$ = hot('-a-', { a: actions.vendorCalendar.getPrevMonth() });
      const expected$ = cold('-(abc)', { a: expectedActions[0], b: expectedActions[1], c: expectedActions[2] });

      expect(effects.getPrevMonth$).toBeObservable(expected$);
    });

    it('should return the correct action on error', () => {
      const errorMessage = 'Some error message';
      const errorObs = cold('#', null, { message: errorMessage });
      vendorService.getPrevMonth = jest.fn(() => errorObs);

      const expectedAction = actions.vendorCalendar.setErrorMessage({ ErrorMessage: errorMessage });

      actions$ = hot('-a-', { a: actions.vendorCalendar.getPrevMonth() });
      const expected$ = cold('-b', { b: expectedAction });

      expect(effects.getPrevMonth$).toBeObservable(expected$);
    });
  });
});
