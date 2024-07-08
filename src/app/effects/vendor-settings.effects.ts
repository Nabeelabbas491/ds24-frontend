import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as actions from '../store/actions';
import { VendorSettingsService } from '../services/vendor-settings.service';
import { DsSnackbarService } from '@ds24/elements';
import { VendorService } from '../services/vendor.service';
@Injectable()
export class VendorSettingsEffects {
  getVendorSettingsCollection$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.vendorSettings.getVendorSettingCollection),
      switchMap(() =>
        this.vendorService.getVendorSettingCollection().pipe(
          map(vendorSettingsCollection =>
            actions.vendorSettings.getVendorSettingCollectionSuccess({ vendorSettingsCollection }),
          ),
          catchError(error => {
            this.snackbarService.openSnackbar({ title: error, type: 'error' });
            return of(actions.vendorBookingTemplate.getCollectionFailure({ error }));
          }),
        ),
      ),
    ),
  );

  saveVendorSetting$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.vendorSettings.saveVendorSetting),
      map(action => {
        return { pageState: action.pageState, saveVendorSetting: action.saveVendorSetting };
      }),
      switchMap(({ pageState, saveVendorSetting }) => {
        let saveVendorSetting$ = this.vendorSettingsService.createVendorSetting(saveVendorSetting);
        if (pageState === 'edit') {
          saveVendorSetting$ = this.vendorSettingsService.updateVendorSetting(saveVendorSetting);
        }
        return saveVendorSetting$.pipe(
          map(response => {
            this.snackbarService.openSnackbar({ title: response.message, type: 'info' });
            return actions.vendorSettings.saveVendorSettingSuccess({ success: response.message });
          }),
          catchError(error => {
            this.snackbarService.openSnackbar({ title: error, type: 'error' });
            return of(actions.vendorSettings.saveVendorSettingFailure({ error: error }));
          }),
        );
      }),
    ),
  );

  removeVendorLogo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.vendorSettings.removeVendorLogo),
      switchMap(() => {
        return this.vendorSettingsService.removeLogo().pipe(
          map(response => {
            this.snackbarService.openSnackbar({ title: response.message, type: 'info' });
            return actions.vendorSettings.removeVendorLogoSuccess({ success: response.message });
          }),
          catchError(error => {
            this.snackbarService.openSnackbar({ title: error, type: 'error' });
            return of(actions.vendorSettings.removeVendorLogoFailure({ error: error }));
          }),
        );
      }),
    ),
  );

  constructor(
    private actions$: Actions,
    private snackbarService: DsSnackbarService,
    private vendorService: VendorService,
    private vendorSettingsService: VendorSettingsService,
  ) {}
}
