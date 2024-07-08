import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as actions from './../store/actions';
import { catchError, map, of, switchMap } from 'rxjs';
import { DsSnackbarService } from '@ds24/elements';
import { GoogleIntegrationService } from '../services/google-integration.service';
import {
  GOOGLE_CONNECTED_MESSAGE,
  getErrorMessage,
  getIntegrationInfo,
  saveIntegrationInfo,
} from '../shared/common/util';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { StatusCode } from '../types/misc.type';
import { HttpErrorResponse } from '@angular/common/http';
import { GoogleIntegrationInfo } from '../types/google-integration.type';

@Injectable()
export class GoogleIntegrationEffects {
  getAuthenticationUrl$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.googleIntegration.getAuthenticationUrl),
      switchMap(arg => {
        return this.googleIntegrationService.getAuthenticationUrl().pipe(
          map(googleAuthUrl =>
            actions.googleIntegration.getAuthenticationUrlSuccess({
              url: googleAuthUrl.url,
              integrationInfo: arg.integrationInfo,
            }),
          ),
          catchError(error => {
            this.snackbarService.openSnackbar({ title: error, type: 'error' });
            return of(actions.googleIntegration.getAuthenticationUrlFailure({ error }));
          }),
        );
      }),
    ),
  );

  googleConnect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.googleIntegration.googleConnect),
      switchMap(action => {
        return this.googleIntegrationService.googleConnect(action.code).pipe(
          map(() => actions.googleIntegration.googleConnectSuccess()),
          catchError((error: HttpErrorResponse) => {
            const errorMessage = getErrorMessage(error);
            if (error.status === StatusCode.INVALID && errorMessage === GOOGLE_CONNECTED_MESSAGE) {
              return of(actions.googleIntegration.googleConnectSuccess());
            } else {
              return of(
                actions.googleIntegration.redirectToGoogleFinalPopup({
                  message: errorMessage,
                  isVendorConnectionFailed: true,
                }),
              );
            }
          }),
        );
      }),
    ),
  );

  googleDisconnect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.googleIntegration.googleDisconnect),
      switchMap(() => {
        return this.googleIntegrationService.googleDisconnect().pipe(
          map(() => actions.googleIntegration.googleDisconnectSuccess()),
          catchError(error => {
            this.snackbarService.openSnackbar({ title: error, type: 'error' });
            return of(actions.googleIntegration.googleDisconnectFailure({ error }));
          }),
        );
      }),
    ),
  );

  getAuthenticationUrlSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(actions.googleIntegration.getAuthenticationUrlSuccess),
        map(arg => {
          saveIntegrationInfo(arg.integrationInfo);
          if (arg.url && arg.integrationInfo.integrationMode === 'client-booking') {
            window.location.href = arg.url;
            return;
          }
          if (arg.url && arg.integrationInfo.integrationMode === 'vendor-appointment') {
            this.store.dispatch(
              actions.googleIntegration.openWindowPopup({ popupName: 'googleAuthPopup', popupUrl: arg.url }),
            );
          }
        }),
      ),
    { dispatch: false },
  );

  openGooglePopup$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(actions.googleIntegration.openWindowPopup),
        map(action => {
          const offsetLeft = (window.screen.width - 1200) / 2;
          const offsetTop = (window.screen.height - 800) / 2;
          this.googleIntegrationService.popup = window.open(
            action.popupUrl,
            `${action.popupName}`,
            `width=1200,height=800,left=${offsetLeft},top=${offsetTop}`,
          );

          if (action.popupName === 'googleAuthPopup') {
            this.store.dispatch(actions.googleIntegration.closeGooglePopup());
          }
        }),
      ),
    { dispatch: false },
  );

  closeGooglePopup$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(actions.googleIntegration.closeGooglePopup),
        map(() => {
          if (this.googleIntegrationService.popup) {
            const popupCloseInterval = setInterval(() => {
              if (this.googleIntegrationService.popup?.closed) {
                clearInterval(popupCloseInterval);
                const googleIntegrationInfo: GoogleIntegrationInfo | null = getIntegrationInfo();

                this.store.dispatch(
                  actions.vendorAppointment.redirectToVendorDetailPage({
                    detailsId: parseInt(googleIntegrationInfo?.appointmentId as string),
                  }),
                );
              }
            }, 1000);
          }
        }),
      ),
    { dispatch: false },
  );

  syncAppointmentClient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.googleIntegration.syncAppointmentClient),
      switchMap(arg => {
        return this.googleIntegrationService.googleCalendarClient(arg.bookingProductId, arg.code).pipe(
          map(syncResponse => {
            this.snackbarService.openSnackbar({ title: syncResponse.message, type: 'info' });
            return actions.googleIntegration.syncAppointmentClientSuccess({ bookingProductId: arg.bookingProductId });
          }),
          catchError(error => {
            this.snackbarService.openSnackbar({ title: error, type: 'error' });
            return of(actions.googleIntegration.syncAppointmentClientFailure({ error }));
          }),
        );
      }),
    ),
  );

  syncAppointmentClientSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(actions.googleIntegration.syncAppointmentClientSuccess),
        map(arg => {
          this.router.navigate(['/calendar', arg.bookingProductId], { queryParams: { isSync: 'true' } });
        }),
      ),
    { dispatch: false },
  );

  syncVendorAppointment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.googleIntegration.googleConnectSuccess),
      switchMap(() => {
        return this.googleIntegrationService.syncVendorAppointment().pipe(
          map(message => {
            return actions.googleIntegration.redirectToGoogleFinalPopup({ message, isVendorConnectionFailed: false });
          }),
          catchError(error => {
            return of(
              actions.googleIntegration.redirectToGoogleFinalPopup({ message: error, isVendorConnectionFailed: true }),
            );
          }),
        );
      }),
    ),
  );

  constructor(
    private actions$: Actions,
    private googleIntegrationService: GoogleIntegrationService,
    private router: Router,
    private snackbarService: DsSnackbarService,
    private store: Store,
  ) {}
}
