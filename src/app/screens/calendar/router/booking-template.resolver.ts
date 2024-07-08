import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { Store } from '@ngrx/store';
import * as actions from './../../../store/actions';
import { getBookingSnapshot } from './../../../shared/common/util';
import { BookingSnapshot } from 'src/app/types/booking.type';

export const bookingTemplateResolver: ResolveFn<void> = (route: ActivatedRouteSnapshot) => {
  const store = inject(Store);
  const isSync = route.queryParamMap.get('isSync');
  if (isSync) {
    const bookingSnapshot: BookingSnapshot | null = getBookingSnapshot();
    if (bookingSnapshot) {
      store.dispatch(actions.booking.loadBookingSnapshot({ bookingSnapshot }));
      store.dispatch(actions.booking.isBookingSynced({ isBookingSynced: true }));
    }
  } else {
    store.dispatch(
      actions.bookingAPI.getBookingTemplate({
        paramDetails: { paramId: route.paramMap.get('pid') as string, isClient: true },
      }),
    );
    store.dispatch(actions.timeZoneAPI.getTimeZones());
  }
};
