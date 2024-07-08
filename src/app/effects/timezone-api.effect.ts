import { Injectable } from '@angular/core';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as actions from '../store/actions';
import { of } from 'rxjs';
import { DsSnackbarService } from '@ds24/elements';
import { TimezoneService } from '../services/timezone.service';

@Injectable()
export class TimeZoneApiEffects {
  getTimezones$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.timeZoneAPI.getTimeZones),
      switchMap(() =>
        this.timezoneService.getTimezones().pipe(
          map(timeZones => {
            return actions.timeZoneAPI.getTimeZonesSuccess({ timeZones });
          }),
          catchError(error => {
            this.snackbarService.openSnackbar({ title: error, type: 'error' });
            return of(actions.timeZoneAPI.getTimeZonesFailure({ error }));
          }),
        ),
      ),
    ),
  );

  constructor(
    private actions$: Actions,
    private timezoneService: TimezoneService,
    private snackbarService: DsSnackbarService,
  ) {}
}
