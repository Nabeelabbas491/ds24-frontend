import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { provideMockStore } from '@ngrx/store/testing';
import { Observable } from 'rxjs';
import * as actions from '../store/actions';
import { hot, cold } from 'jasmine-marbles';
import { provideMockActions } from '@ngrx/effects/testing';
import { TimeZoneApiEffects } from './timezone-api.effect';
import { TimezoneService } from '../services/timezone.service';
import { DsSnackbarService } from '@ds24/elements';

describe('TimeZoneApiEffects', () => {
  let effects: TimeZoneApiEffects;
  let actions$: Observable<any>;
  let timeZoneService: any;
  let snackbarService: DsSnackbarService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TimeZoneApiEffects,
        provideMockActions(() => actions$),
        provideMockStore(),
        {
          provide: TimezoneService,
          useValue: {
            getTimezones: jest.fn(),
          },
        },
        {
          provide: DsSnackbarService,
          useValue: { openSnackbar: jest.fn() },
        },
      ],
    });

    timeZoneService = TestBed.inject(TimezoneService);
    effects = TestBed.inject(TimeZoneApiEffects);
    actions$ = TestBed.inject(Actions);
    snackbarService = TestBed.inject(DsSnackbarService);
  });

  describe('laod Timez zone list', () => {
    it('should return a list of TimeZones on successfull api call', () => {
      const timeZones = [{ name: 'Asia', abbreviatedTimeZone: 'AS', offset: '+02:00' }];
      const action = actions.timeZoneAPI.getTimeZones();
      const completion = actions.timeZoneAPI.getTimeZonesSuccess({ timeZones });

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', { a: timeZones });
      const expected = cold('--b', { b: completion });
      timeZoneService.getTimezones = jest.fn(() => response);

      expect(effects.getTimezones$).toBeObservable(expected);
    });

    it('should return a error on api fail', () => {
      const error = 'Invalid form.';
      const action = actions.timeZoneAPI.getTimeZones();
      const completion = actions.timeZoneAPI.getTimeZonesFailure({ error: error });

      actions$ = hot('-a---', { a: action });
      const response = cold('-#', {}, error);
      const expected = cold('--b', { b: completion });
      timeZoneService.getTimezones = jest.fn(() => response);

      expect(effects.getTimezones$).toBeObservable(expected);
      expect(snackbarService.openSnackbar).toHaveBeenCalledWith({ title: error, type: 'error' });
    });
  });
});
