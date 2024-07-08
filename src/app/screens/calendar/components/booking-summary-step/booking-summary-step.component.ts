import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectors } from '../../../../store';

@Component({
  selector: 'ds-booking-summary-step',
  templateUrl: './booking-summary-step.component.html',
})
export class BookingSummaryStepComponent {
  bookingTemplateSummary$ = this.store.select(selectors.booking.selectBookingTemplateSummary);
  isMobileView$ = this.store.select(selectors.viewBreakPoint.selectIsMobileView);

  constructor(private store: Store) {}
}
