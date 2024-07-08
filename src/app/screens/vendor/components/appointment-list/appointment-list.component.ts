import { AfterViewInit, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import * as actions from '../../../../store/actions';
import { ReactiveLifecycles } from '@ds24/utilities';
import { selectors } from '../../../../store';
import { IconColor, IconName } from '@ds24/elements';
import { takeUntil } from 'rxjs';
import {
  AppointmentDetails,
  VendorListingParamType,
  SortType,
  AppointmentStatus,
} from '../../../../types/vendor.types';
import { MeetingTypeId } from '../../../../types/booking.type';

@Component({
  selector: 'ds-appointment-list',
  templateUrl: './appointment-list.component.html',
})
export class AppointmentListComponent extends ReactiveLifecycles implements AfterViewInit {
  appointmentList: AppointmentDetails[] = [];
  arrowDown: IconName = IconName.ArrowDown;
  isSortAscending: boolean = true;
  videoBooking = MeetingTypeId.Zoom;
  inboundCall = MeetingTypeId.Inbound;
  outboundCall = MeetingTypeId.Outbound;
  spinnerColor = IconColor.Neutral500;
  greyColor = IconColor.Neutral200;
  cancelled = AppointmentStatus.CANCELLED;

  appointmentsPending$ = this._store.select(selectors.vendorAppointment.selectPending);
  listParams$ = this._store.select(selectors.vendorAppointment.selectListParams);

  constructor(private _store: Store) {
    super();
    this._store
      .select(selectors.vendorAppointment.selectAppointmentsData)
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe(appointmentList => {
        this.appointmentList = appointmentList.appointments;
      });
  }

  sortTableData() {
    this.isSortAscending = !this.isSortAscending;

    this._store.dispatch(
      actions.vendorAppointment.updateListParam({
        paramName: VendorListingParamType.SORTORDER,
        paramValue: this.isSortAscending ? SortType.ASCENDING : SortType.DESCENDING,
      }),
    );
    this._store.dispatch(
      actions.vendorAppointment.updateListParam({
        paramName: VendorListingParamType.PAGE,
        paramValue: 1,
      }),
    );
  }

  showDetailsPage(index: number | null) {
    if (index !== null) {
      this._store.dispatch(actions.vendorAppointment.redirectToVendorDetailPage({ detailsId: index }));
    }
  }
}
