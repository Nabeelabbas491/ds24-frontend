import { Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';

import * as actions from '../store/actions';
import { tap } from 'rxjs';
import { DsSnackbarService, SnackbarRef } from '@ds24/elements';

@Injectable()
export class NotificationEffects {
  public _snackbarRef: SnackbarRef | null = null;

  loadSnackBar$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(actions.notification.callSnackBarPopup),
        tap(
          ({ snackBarMessage }) =>
            (this._snackbarRef = this._snackbarService.openSnackbar({
              title: snackBarMessage,
              type: 'info',
              dismissAfterMs: 800,
            })),
        ),
      ),
    { dispatch: false },
  );

  constructor(
    private actions$: Actions,
    private _snackbarService: DsSnackbarService,
  ) {}
}
