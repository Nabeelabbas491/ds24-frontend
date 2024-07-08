import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { provideMockStore } from '@ngrx/store/testing';
import { Observable, of, throwError } from 'rxjs';
import * as actions from '../store/actions';
import { VendorScheduleEffects } from './vendor-schedule.effects';
import { VendorService } from '../services/vendor.service';
import { hot, cold } from 'jasmine-marbles';
import {
  weekSchedule,
  unavailableWeekSchedule,
  sampleWeekResponse,
  formDayDetails,
  overrideTimeSlots,
} from '../types/vendor.types.mock';
import { provideMockActions } from '@ngrx/effects/testing';
import { DsSnackbarService } from '@ds24/elements';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { selectors } from '../store';
import { SELECTED_DAYS_MOCK } from '../types/calendar-day.type.mock';
import { DateOverrideListItem } from '../types/vendor-date-override.type';
import {
  buildDateOverridePayload,
  buildInitialDateOverrideList,
  constructTimeSlots,
} from '../shared/common/date-override-utils';
import { Availibility, WeekSchedule } from '../types/vendor.types';
import { HttpErrorResponse } from '@angular/common/http';
import { GenericResponse } from '../types/misc.type';

describe('VendorScheduleEffects', () => {
  let effects: VendorScheduleEffects;
  let actions$: Observable<any>;
  let vendorServiceSpy: jest.Mocked<VendorService>;
  let snackbarService: any;

  beforeEach(() => {
    vendorServiceSpy = {
      getVendorScheduleData: jest.fn(),
      saveVendorScheduleData: jest.fn(),
      createVendorScheduleData: jest.fn(),
      deleteVendorScheduleData: jest.fn(),
    } as any;

    TestBed.configureTestingModule({
      providers: [
        VendorScheduleEffects,
        {
          provide: DsSnackbarService,
          useValue: { openSnackbar: jest.fn() },
        },
        provideMockStore(),
        provideMockActions(() => actions$),
        { provide: VendorService, useValue: vendorServiceSpy },
        provideMockStore({
          selectors: [
            {
              selector: selectors.vendor.selectSelectedTimeZone,
              value: 'UTC',
            },
            {
              selector: selectors.vendorSchedule.selectScheduleStatus,
              value: true,
            },
            {
              selector: selectors.vendorSchedule.selectOverrideFormValue,
              value: overrideTimeSlots,
            },
            {
              selector: selectors.calendar.selectCalendarSelectedDays,
              value: SELECTED_DAYS_MOCK,
            },
            {
              selector: selectors.vendorSchedule.selectVendorSchedule,
              value: weekSchedule,
            },
            {
              selector: selectors.vendorSchedule.selectUpdateOverrideIndex,
              value: null,
            },
            {
              selector: selectors.timeZoneAPI.selectTimeZones,
              value: [
                {
                  abbreviatedTimeZone: 'UTC',
                  name: 'UTC',
                  offset: '+00:00',
                },
              ],
            },
          ],
        }),
      ],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
    });

    effects = TestBed.inject(VendorScheduleEffects);
    actions$ = TestBed.inject(Actions);
    snackbarService = TestBed.inject(DsSnackbarService);
  });

  describe('loadVendorSchedule$', () => {
    it('should load vendor schedules successfully', () => {
      vendorServiceSpy.getVendorScheduleData.mockReturnValue(of(sampleWeekResponse));
      const action = actions.vendorSchedule.loadVendorSchedule();

      const completion = actions.vendorSchedule.loadVendorScheduleSuccess({
        weekSchedule: weekSchedule,
      });

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.loadVendorSchedule$).toBeObservable(expected);
    });

    it('should handle error when status is empty while loading vendor schedules', () => {
      const error = new HttpErrorResponse({
        error: {
          message: 'An error occurred',
        },
        status: 404,
        statusText: 'Not Found',
      });
      vendorServiceSpy.getVendorScheduleData.mockReturnValue(throwError(error));

      const expectedActions = [
        actions.vendorSchedule.saveScheduleStatus({ isScheduleEmpty: true }),
        actions.vendorSchedule.saveErrorMessage({ ErrorMessage: error.error.message }),
      ];

      const action = actions.vendorSchedule.loadVendorSchedule();

      actions$ = hot('-a-', { a: action });
      const expected = cold('-(ab)', { a: expectedActions[0], b: expectedActions[1] });

      expect(effects.loadVendorSchedule$).toBeObservable(expected);
    });

    it('should handle error when status is other than empty while loading vendor schedules', () => {
      const error = new HttpErrorResponse({
        error: {
          message: 'An error occurred',
        },
        status: 403,
        statusText: 'Not Found',
      });
      vendorServiceSpy.getVendorScheduleData.mockReturnValue(throwError(error));

      const expectedActions = [
        actions.vendorSchedule.saveScheduleStatus({ isScheduleEmpty: false }),
        actions.vendorSchedule.setErrorMessage({ ErrorMessage: error.error.message }),
      ];

      const action = actions.vendorSchedule.loadVendorSchedule();

      actions$ = hot('-a-', { a: action });
      const expected = cold('-(ab)', { a: expectedActions[0], b: expectedActions[1] });

      expect(effects.loadVendorSchedule$).toBeObservable(expected);
    });
  });

  describe('saveVendorSchedule$', () => {
    it('should save vendor schedules successfully', () => {
      const weekResponse: GenericResponse<WeekSchedule> = {
        status: 200,
        message: 'Success',
        data: weekSchedule,
      };
      vendorServiceSpy.saveVendorScheduleData.mockReturnValue(of(weekResponse));

      const action = actions.vendorSchedule.saveVendorSchedule({ weekSchedule });

      const completion = actions.vendorSchedule.handleScheduleSuccessResponse({
        weekData: weekResponse,
      });

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.saveVendorSchedule$).toBeObservable(expected);
    });

    it('should handle error when saving vendor schedules', () => {
      const ErrorMessage = 'An error occurred';
      vendorServiceSpy.saveVendorScheduleData.mockReturnValue(throwError(ErrorMessage));

      const action = actions.vendorSchedule.saveVendorSchedule({ weekSchedule });
      const completion = actions.vendorSchedule.setErrorMessage({ ErrorMessage });

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.saveVendorSchedule$).toBeObservable(expected);
    });
  });

  describe('createVendorSchedule$', () => {
    it('should create vendor schedules successfully', () => {
      const weekResponse: GenericResponse<WeekSchedule> = {
        status: 200,
        message: 'Success',
        data: weekSchedule,
      };
      vendorServiceSpy.createVendorScheduleData.mockReturnValue(of(weekResponse));

      const action = actions.vendorSchedule.createVendorSchedule({ weekSchedule });

      const completion = actions.vendorSchedule.handleScheduleSuccessResponse({
        weekData: weekResponse,
      });

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.createVendorSchedule$).toBeObservable(expected);
    });

    it('should handle error when creating vendor schedules', () => {
      const ErrorMessage = 'An error occurred';
      vendorServiceSpy.createVendorScheduleData.mockReturnValue(throwError(ErrorMessage));

      const action = actions.vendorSchedule.createVendorSchedule({ weekSchedule });
      const completion = actions.vendorSchedule.setErrorMessage({ ErrorMessage });

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.createVendorSchedule$).toBeObservable(expected);
    });
  });

  describe('saveVendorScheduleForm$', () => {
    it('should dispatch action if scheduleStatus is empty', () => {
      const mockAction = actions.vendorSchedule.saveVendorScheduleForm({ daysFormValue: formDayDetails });
      actions$ = hot('-a', { a: mockAction });
      const expected = cold('-b', { b: actions.vendorSchedule.createVendorSchedule({ weekSchedule: weekSchedule }) });
      expect(effects.saveVendorScheduleForm$).toBeObservable(expected);
    });
  });

  describe('deleteAddDateOverride$', () => {
    it('should dispatch action if schedule is deleted', () => {
      const mockAction = actions.vendorSchedule.removeSelectedOverride({ index: 1 });
      const successMessage = 'Deletion Successful';
      vendorServiceSpy.deleteVendorScheduleData.mockReturnValue(of(successMessage));

      actions$ = hot('-a', { a: mockAction });

      const expectedActions = [
        actions.vendorSchedule.setRemoveDateOveridePendingStatus({ isPending: false }),
        actions.vendorSchedule.loadVendorSchedule(),
        actions.vendorSchedule.setSuccessMessage({ SuccessMessage: successMessage }),
      ];

      const expected = cold('-(abc)', { a: expectedActions[0], b: expectedActions[1], c: expectedActions[2] });
      expect(effects.deleteAddDateOverride$).toBeObservable(expected);
    });

    it('should dispatch setErrorMessage action if schedule is deleted', () => {
      const mockAction = actions.vendorSchedule.removeSelectedOverride({ index: 1 });
      const ErrorMessage = 'Deletion Failed';
      vendorServiceSpy.deleteVendorScheduleData.mockReturnValue(throwError(ErrorMessage));

      actions$ = hot('-a', { a: mockAction });

      const expectedActions = [
        actions.vendorSchedule.setErrorMessage({ ErrorMessage }),
        actions.vendorSchedule.setRemoveDateOveridePendingStatus({ isPending: false }),
      ];
      const expected = cold('-(ab)', { a: expectedActions[0], b: expectedActions[1] });
      expect(effects.deleteAddDateOverride$).toBeObservable(expected);
    });
  });

  describe('saveDateOverride$', () => {
    it('should dispatch action if schedule is empty', () => {
      const mockAction = actions.vendorSchedule.saveDateOverride();
      actions$ = hot('-a', { a: mockAction });

      const dateOverrideList: DateOverrideListItem[] = buildInitialDateOverrideList(weekSchedule.availabilities, null);
      const timeSlots = constructTimeSlots(overrideTimeSlots);
      const modifiedDateOverrideDayList: Availibility[] = buildDateOverridePayload(
        dateOverrideList,
        SELECTED_DAYS_MOCK,
        timeSlots,
      );

      const defaultDays = weekSchedule.availabilities.filter(day => day.type === 'default');
      const allDaysAvailability = [...defaultDays, ...modifiedDateOverrideDayList];
      const finalWeekSchedule = {
        timeZone: weekSchedule.timeZone,
        availabilities: allDaysAvailability,
      };
      const expected = cold('-b', {
        b: actions.vendorSchedule.createVendorSchedule({ weekSchedule: finalWeekSchedule }),
      });
      expect(effects.saveDateOverride$).toBeObservable(expected);
    });
  });

  describe('showInvalidFormError$', () => {
    it('should call the errorMessage and the snackbar', () => {
      const formError = 'Sample Error';
      const action = actions.vendorSchedule.showInvalidFormError({ formError: formError });

      const completion = actions.vendorSchedule.setErrorMessage({ ErrorMessage: formError });

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.showInvalidFormError$).toBeObservable(expected);
    });
  });

  it('should dispatch setIfUnavailable action when loadVendorScheduleSuccess action is triggered', () => {
    const loadVendorScheduleSuccessAction = actions.vendorSchedule.loadVendorScheduleSuccess({
      weekSchedule: unavailableWeekSchedule,
    });
    actions$ = hot('-a', { a: loadVendorScheduleSuccessAction });

    const expectedAction = actions.vendorSchedule.setIfUnavailable({ isUnavailable: true });
    const expected = cold('-b', { b: expectedAction });
    expect(effects.loadUnavailableCount$).toBeObservable(expected);
  });

  it('createPlaceHolderForTimeZone', () => {
    const loadTimeZones = actions.timeZoneAPI.getTimeZonesSuccess({
      timeZones: [
        {
          abbreviatedTimeZone: 'UTC',
          name: 'UTC',
          offset: '+00:00',
        },
      ],
    });

    actions$ = hot('-a', { a: loadTimeZones });

    const expectedAction = actions.vendor.saveTimeZonePlaceholder({
      timeZonePlaceholder: { abbreviatedTimeZone: 'UTC', name: 'UTC', offset: '+00:00' },
    });
    const expected = cold('-b', { b: expectedAction });
    expect(effects.createPlaceHolderForTimeZone$).toBeObservable(expected);
  });

  describe('showErrorMessage$', () => {
    it('should open the snackbar with error message ', (done: any) => {
      const errorMessage = 'Sample Error';
      const action = actions.vendorSchedule.setErrorMessage({ ErrorMessage: errorMessage });

      actions$ = of(action);

      effects.showErrorMessage$.subscribe(() => {
        expect(snackbarService.openSnackbar).toHaveBeenCalledWith({ title: errorMessage, type: 'error' });
        done();
      });
    });
  });

  describe('showErrorMessage$', () => {
    it('should open the snackbar with error message ', (done: any) => {
      const errorMessage = 'Sample Error';
      const action = actions.vendorSchedule.setErrorMessage({ ErrorMessage: errorMessage });

      actions$ = of(action);

      effects.showErrorMessage$.subscribe(() => {
        expect(snackbarService.openSnackbar).toHaveBeenCalledWith({ title: errorMessage, type: 'error' });
        done();
      });
    });
  });

  describe('showSuccessMessage$', () => {
    it('should open the snackbar with success message ', (done: any) => {
      const successMessage = 'Sample Success Message';
      const action = actions.vendorSchedule.setSuccessMessage({ SuccessMessage: successMessage });

      actions$ = of(action);

      effects.showSuccessMessage$.subscribe(() => {
        expect(snackbarService.openSnackbar).toHaveBeenCalledWith({ title: successMessage, type: 'info' });
        done();
      });
    });
  });

  describe('onSuccessOfScheduleSave$', () => {
    it('should call the success actions when handling success response of Schedule', () => {
      const weekResponse: GenericResponse<WeekSchedule> = {
        status: 200,
        message: 'Success',
        data: weekSchedule,
      };
      const action = actions.vendorSchedule.handleScheduleSuccessResponse({ weekData: weekResponse });
      const completion = actions.calendar.resetSelectedDays();

      actions$ = hot('-a', { a: action });

      const expected = cold('-(a)', {
        a: completion,
      });

      expect(effects.onSuccessOfScheduleSave$).toBeObservable(expected);
    });
  });
});
