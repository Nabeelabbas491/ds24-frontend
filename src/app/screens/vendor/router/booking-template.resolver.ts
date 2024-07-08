import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Store } from '@ngrx/store';
import * as actions from './../../../store/actions';

export const bookingTemplateResolver: ResolveFn<void> = () => {
  const store = inject(Store);
  store.dispatch(actions.bookingAPI.resetBookingTemplate());
};
