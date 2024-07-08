import { Injectable } from '@angular/core';
import { catchError, map, mergeMap, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as actions from '../store/actions';
import { VendorService } from '../services/vendor.service';
import { of } from 'rxjs';
import { DsSnackbarService } from '@ds24/elements';
import { Availibility, FormDayDetail, WeekSchedule } from '../types/vendor.types';
import { Store } from '@ngrx/store';
import { selectors } from '../store';
import { eachDayOfInterval, format, parse } from 'date-fns';
import { GenericResponse, StatusCode } from '../types/misc.type';
import {
  buildDateOverridePayload,
  buildInitialDateOverrideList,
  constructTimeSlots,
} from '../shared/common/date-override-utils';
import { DateOverrideListItem } from '../types/vendor-date-override.type';
import { Slot, Day } from '../types/calendar-day.type';
import { dayFactory, guessDefaultTimezone } from '../shared/common/util';
import { HttpErrorResponse } from '@angular/common/http';
import { getErrorMessage } from '../shared/common/util';
import * as _ from 'lodash-es';
import { TimeZone } from '../types/timezone.type';

@Injectable()
export class VendorScheduleEffects {
  loadVendorSchedule$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.vendorSchedule.loadVendorSchedule),
      switchMap(() => {
        return this.vendorService.getVendorScheduleData().pipe(
          map((responseData: GenericResponse<WeekSchedule>) => {
            return actions.vendorSchedule.loadVendorScheduleSuccess({ weekSchedule: responseData.data });
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            const errorMessage = getErrorMessage(errorResponse);
            if (errorResponse.status === StatusCode.EMPTY) {
              return of(
                actions.vendorSchedule.saveScheduleStatus({ isScheduleEmpty: true }),
                actions.vendorSchedule.saveErrorMessage({ ErrorMessage: errorMessage }),
              );
            } else {
              return of(
                actions.vendorSchedule.saveScheduleStatus({ isScheduleEmpty: false }),
                actions.vendorSchedule.setErrorMessage({ ErrorMessage: errorMessage }),
              );
            }
          }),
        );
      }),
    ),
  );

  saveVendorScheduleForm$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.vendorSchedule.saveVendorScheduleForm),
      withLatestFrom(
        this.store.select(selectors.vendor.selectSelectedTimeZone),
        this.store.select(selectors.vendorSchedule.selectScheduleStatus),
        this.store.select(selectors.vendorSchedule.selectVendorSchedule),
      ),
      switchMap(([action, timezone, isScheduleEmpty, vendorSchedule]) => {
        const availabilities: Availibility[] = action.daysFormValue.map((day: FormDayDetail) => {
          const inputAbbreviation = day.dayOfWeek as string;
          const parsedDate = parse(inputAbbreviation, 'EEE', new Date());
          const fullWeekdayName = format(parsedDate, 'EEEE', { useAdditionalDayOfYearTokens: false }).toLowerCase();

          return {
            startDate: null,
            endDate: null,
            type: 'default',
            day: fullWeekdayName,
            slot: [...day.timeRange],
          };
        });

        const weekSchedule: WeekSchedule = {
          timeZone: timezone,
          availabilities: [
            ...availabilities,
            ...vendorSchedule.availabilities
              .filter(day => day.type === 'override')
              .map(day => ({ ...day, day: day.day ?? '' }) as Availibility),
          ],
        };

        if (isScheduleEmpty) {
          return of(actions.vendorSchedule.createVendorSchedule({ weekSchedule }));
        } else {
          return of(actions.vendorSchedule.saveVendorSchedule({ weekSchedule }));
        }
      }),
    ),
  );

  saveDateOverride$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.vendorSchedule.saveDateOverride),
      withLatestFrom(
        this.store.select(selectors.vendorSchedule.selectOverrideFormValue),
        this.store.select(selectors.calendar.selectCalendarSelectedDays),
        this.store.select(selectors.vendorSchedule.selectVendorSchedule),
        this.store.select(selectors.vendorSchedule.selectScheduleStatus),
        this.store.select(selectors.vendorSchedule.selectUpdateOverrideIndex),
        this.store.select(selectors.vendor.selectSelectedTimeZone),
      ),
      switchMap(([, overrideForm, selectedDays, vendorSchedule, isScheduleEmpty, vendorIndex, timezone]) => {
        const dateOverrideList: DateOverrideListItem[] = buildInitialDateOverrideList(
          vendorSchedule.availabilities,
          vendorIndex,
        );
        const timeSlots = constructTimeSlots(overrideForm);
        const sortedTimeSlots = _.sortBy(timeSlots, ['startTime']);
        const modifiedDateOverrideDayList: Availibility[] = buildDateOverridePayload(
          dateOverrideList,
          selectedDays,
          sortedTimeSlots,
        );

        const defaultDays = vendorSchedule.availabilities.filter(day => day.type === 'default');
        const allDaysAvailability = [...defaultDays, ...modifiedDateOverrideDayList];
        const weekSchedule = {
          timeZone: timezone,
          availabilities: allDaysAvailability,
        };

        if (isScheduleEmpty) {
          return of(actions.vendorSchedule.createVendorSchedule({ weekSchedule: weekSchedule }));
        } else {
          return of(actions.vendorSchedule.saveVendorSchedule({ weekSchedule: weekSchedule }));
        }
      }),
    ),
  );

  deleteAddDateOverride$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.vendorSchedule.removeSelectedOverride),
      switchMap(action => {
        return this.vendorService.deleteVendorScheduleData(action.index).pipe(
          mergeMap((successMessage: string) => {
            return of(
              actions.vendorSchedule.setRemoveDateOveridePendingStatus({ isPending: false }),
              actions.vendorSchedule.loadVendorSchedule(),
              actions.vendorSchedule.setSuccessMessage({ SuccessMessage: successMessage }),
            );
          }),
          catchError((ErrorMessage: string) => {
            return of(
              actions.vendorSchedule.setErrorMessage({ ErrorMessage }),
              actions.vendorSchedule.setRemoveDateOveridePendingStatus({ isPending: false }),
            );
          }),
        );
      }),
    ),
  );

  showInvalidFormError$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.vendorSchedule.showInvalidFormError),
      switchMap(action => {
        return of(actions.vendorSchedule.setErrorMessage({ ErrorMessage: action.formError }));
      }),
    ),
  );

  onSuccessOfScheduleSave$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.vendorSchedule.handleScheduleSuccessResponse),
      tap(action => {
        this.snackbarService.openSnackbar({
          title: action.weekData.message,
          type: 'info',
        });
      }),
      switchMap(() => {
        return of(actions.calendar.resetSelectedDays());
      }),
    ),
  );

  createVendorSchedule$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.vendorSchedule.createVendorSchedule),
      switchMap(action => {
        return this.vendorService.createVendorScheduleData(action.weekSchedule).pipe(
          map((weekResponse: GenericResponse<WeekSchedule>) => {
            return actions.vendorSchedule.handleScheduleSuccessResponse({ weekData: weekResponse });
          }),
          catchError((ErrorMessage: string) => {
            return of(actions.vendorSchedule.setErrorMessage({ ErrorMessage }));
          }),
        );
      }),
    ),
  );

  saveVendorSchedule$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.vendorSchedule.saveVendorSchedule),
      switchMap(action => {
        return this.vendorService.saveVendorScheduleData(action.weekSchedule).pipe(
          map((weekResponse: GenericResponse<WeekSchedule>) => {
            return actions.vendorSchedule.handleScheduleSuccessResponse({ weekData: weekResponse });
          }),
          catchError((ErrorMessage: string) => {
            return of(actions.vendorSchedule.setErrorMessage({ ErrorMessage }));
          }),
        );
      }),
    ),
  );

  showErrorMessage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(actions.vendorSchedule.setErrorMessage),
        tap(action => {
          this.snackbarService.openSnackbar({
            title: action.ErrorMessage,
            type: 'error',
          });
        }),
      ),
    { dispatch: false },
  );

  showSuccessMessage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(actions.vendorSchedule.setSuccessMessage),
        tap(action => {
          this.snackbarService.openSnackbar({
            title: action.SuccessMessage,
            type: 'info',
          });
        }),
      ),
    { dispatch: false },
  );

  loadUnavailableCount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        actions.vendorSchedule.loadVendorScheduleSuccess,
        actions.vendorSchedule.saveVendorSchedule,
        actions.vendorSchedule.createVendorSchedule,
      ),
      switchMap(action => {
        const weekDaysCount = 7;
        const isUnavailable =
          action.weekSchedule.availabilities.length === 0 ||
          action.weekSchedule.availabilities.filter(day => day.day && day.slot.length === 0).length === weekDaysCount;
        return of(actions.vendorSchedule.setIfUnavailable({ isUnavailable }));
      }),
    ),
  );

  createPlaceHolderForTimeZone$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.timeZoneAPI.getTimeZonesSuccess, actions.vendor.saveSelectedTimeZone),
      withLatestFrom(
        this.store.select(selectors.timeZoneAPI.selectTimeZones),
        this.store.select(selectors.vendor.selectSelectedTimeZone),
      ),
      switchMap(([, timeZones, selectedTimeZone]) => {
        const defaultTimeZone = {
          name: guessDefaultTimezone(),
          abbreviatedTimeZone: '',
          offset: '',
        } as TimeZone;

        return of(
          actions.vendor.saveTimeZonePlaceholder({
            timeZonePlaceholder: timeZones.find(tz => tz.name === selectedTimeZone) ?? defaultTimeZone,
          }),
        );
      }),
    ),
  );

  editSchedule$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(actions.vendorSchedule.editOverrideSchedule),
        map(action => {
          const startDateDate = new Date(action.editSheduleDetails.startDate as string);
          const endDateDate = new Date(action.editSheduleDetails.endDate as string);

          const dateArray = eachDayOfInterval({ start: startDateDate, end: endDateDate });
          const formattedDateArray = dateArray.map(date => format(date, 'yyyy-MM-dd'));
          const timeSlots = action.editSheduleDetails.slots.map(slot => {
            return {
              startTime: slot.from,
              endTime: slot.to,
            } as Slot;
          });
          formattedDateArray.forEach(date => {
            const day: Day = dayFactory([{ dayTitle: date, slotsArr: timeSlots }], date);
            this.store.dispatch(actions.calendar.selectDays({ day: day }));
          });

          this.store.dispatch(
            actions.vendorSchedule.updateOpenedOverrideTimeslots({ slots: action.editSheduleDetails.slots }),
          );
          this.store.dispatch(actions.vendor.setAddOverrideModalVisibilityStatus({ addOverrideModal: true }));

          // Navigate to the month of first date's month
          if (action.editSheduleDetails.updateIndex) {
            this.store.dispatch(
              actions.vendorSchedule.setUpdateOverrideDetails({
                updateOverrideIndex: action.editSheduleDetails.updateIndex,
              }),
            );
          }
          this.store.dispatch(actions.calendar.navigateToMonth({ currentMonth: formattedDateArray[0] }));
        }),
      ),
    { dispatch: false },
  );

  constructor(
    private actions$: Actions,
    private vendorService: VendorService,
    private snackbarService: DsSnackbarService,
    private store: Store,
  ) {}
}
