import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Store } from '@ngrx/store';
import * as actions from './../../../store/actions';

export const vendorSettingsResolver: ResolveFn<void> = () => {
  const store = inject(Store);

  store.dispatch(actions.vendorSettings.resetSettingCollection());
  store.dispatch(actions.vendorSettings.getVendorSettingCollection());
};
