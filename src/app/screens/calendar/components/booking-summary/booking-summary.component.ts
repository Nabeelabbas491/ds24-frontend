import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { actions, selectors } from '../../../../store';
import { IconName } from '@ds24/elements';

@Component({
  selector: 'ds-booking-summary',
  templateUrl: './booking-summary.component.html',
})
export class BookingSummaryComponent {
  icons: typeof IconName = IconName;

  selectedDay$ = this.store.select(selectors.booking.selectSelectedDay);
  selectedTimeSlot$ = this.store.select(selectors.booking.selectTimeSlot);

  selectCallType$ = this.store.select(selectors.booking.selectCallType);
  selectCallTypeIcon$ = this.store.select(selectors.booking.selectCallTypeIcon);
  selectCallTypeSummary$ = this.store.select(selectors.booking.selectcallTypeSummary);

  isMobileView$ = this.store.select(selectors.viewBreakPoint.selectIsMobileView);

  saveBookingPending$ = this.store.select(selectors.bookingAPI.selectBookingSavePending);

  constructor(private store: Store) {}

  editBooking(): void {
    this.store.dispatch(actions.booking.editBooking());
  }
}
