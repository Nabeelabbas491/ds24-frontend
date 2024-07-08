import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectors, actions } from './../../../../store';

@Component({
  selector: 'ds-date-time-selection-step',
  templateUrl: './date-time-selection-step.component.html',
})
export class DateTimeSelectionStepComponent {
  selectedDay$ = this.store.select(selectors.booking.selectSelectedDay);
  bookingTemplateSummary$ = this.store.select(selectors.booking.selectBookingTemplateSummary);
  isDateTimeSelectionStepComplete$ = this.store.select(selectors.booking.isDateTimeSelectionStepComplete);

  constructor(private store: Store) {}

  nextStep() {
    this.store.dispatch(actions.booking.selectStep({ step: 'booking_type' }));
  }
}
