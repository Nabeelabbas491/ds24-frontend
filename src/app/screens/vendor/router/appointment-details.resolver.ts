import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import * as actions from '../../../store/actions';
import * as selectors from '../../../store/selectors';
import { AppointmentDetails } from 'src/app/types/vendor.types';

export const appointmentDetailsResolver: ResolveFn<Observable<AppointmentDetails>> = (
  route: ActivatedRouteSnapshot,
) => {
  const store = inject(Store);
  const detailsId = parseInt(route.paramMap.get('id') as string);
  store.dispatch(actions.vendorAppointment.loadAppointmentDetail({ detailsId }));
  return store.select(selectors.vendorAppointment.selectAppointmentsDetailData).pipe(take(1));
};
