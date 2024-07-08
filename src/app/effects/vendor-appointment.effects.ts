import { Injectable } from '@angular/core';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as actions from '../store/actions';
import { VendorService } from '../services/vendor.service';
import { of } from 'rxjs';
import { DsSnackbarService } from '@ds24/elements';
import { Store } from '@ngrx/store';
import { selectors } from '../store';
import { downloadFile } from '../shared/common/util';

@Injectable()
export class VendorAppointmentEffects {
  loadAppointmentList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.vendorAppointment.loadAppointmentList),
      switchMap(action => {
        return this.vendorService.getAppointmentListData(action.listParams).pipe(
          map(appointmentListData => actions.vendorAppointment.loadAppointmentListSuccess({ appointmentListData })),
          catchError(ErrorMessage => {
            this.snackbarService.openSnackbar({ title: ErrorMessage, type: 'error' });
            return of(actions.vendorAppointment.setErrorMessage({ ErrorMessage }));
          }),
        );
      }),
    ),
  );

  changeDataOnTabViewChange$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.vendor.saveTabView),
      withLatestFrom(this.store.select(selectors.vendorAppointment.selectListParams)),
      map(([action, listParams]) => {
        if (action.tabView === true) {
          return actions.vendorAppointment.loadAppointmentList({ listParams });
        }
        return actions.vendorCalendar.populateInitialCalendarDays();
      }),
    ),
  );

  initAppointmentDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.vendorAppointment.loadAppointmentDetail),
      switchMap(action => {
        return this.vendorService.getAppointmentDetailsData(action.detailsId).pipe(
          map(appointmentDetailData => actions.vendorAppointment.setAppointmentDetail({ appointmentDetailData })),
          catchError(error => {
            this.snackbarService.openSnackbar({ title: error, type: 'error' });
            return of(actions.vendorAppointment.setErrorMessage({ ErrorMessage: error }));
          }),
        );
      }),
    ),
  );

  cancelAppointment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.vendorAppointment.cancelAppointment),
      switchMap(action => {
        return this.vendorService.cancelAppointment(action.appointmentId).pipe(
          map(cancellationMessage => {
            this.snackbarService.openSnackbar({ title: cancellationMessage, type: 'info' });
            return actions.vendorAppointment.loadAppointmentDetail({ detailsId: action.appointmentId });
          }),
          catchError(error => {
            this.snackbarService.openSnackbar({ title: error, type: 'error' });
            return of(actions.vendorAppointment.setErrorMessage({ ErrorMessage: error }));
          }),
        );
      }),
    ),
  );

  initAppointmentList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.vendorAppointment.updateListParam),
      withLatestFrom(this.store.select(selectors.vendorAppointment.selectListParams)),
      map(([, listParams]) => actions.vendorAppointment.loadAppointmentList({ listParams })),
    ),
  );

  downloadVendorICS$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.vendorAppointment.downloadVendorICS),
      switchMap(action => {
        return this.vendorService.downloadVendorICS(action.appointmentId).pipe(
          map(icsContent => {
            downloadFile(icsContent, 'appointment.ics');
            return actions.vendorAppointment.downloadVendorICSSuccess();
          }),
          catchError(error => {
            this.snackbarService.openSnackbar({ title: error, type: 'error' });
            this.store.dispatch(actions.vendorAppointment.setErrorMessage({ ErrorMessage: error }));
            return of(actions.vendorAppointment.downloadVendorICSFailure({ error }));
          }),
        );
      }),
    ),
  );

  constructor(
    private actions$: Actions,
    private vendorService: VendorService,
    private snackbarService: DsSnackbarService,
    private store: Store,
  ) {}
}
