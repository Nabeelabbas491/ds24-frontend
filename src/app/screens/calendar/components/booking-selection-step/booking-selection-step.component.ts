import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { actions, selectors } from '../../../../store';
import { MeetingType } from 'src/app/types/misc.type';

@Component({
  selector: 'ds-booking-selection-step',
  templateUrl: './booking-selection-step.component.html',
})
export class BookingSelectionStepComponent {
  selectedDay$ = this.store.select(selectors.booking.selectSelectedDay);
  isBookingSelectionStepComplete$ = this.store.select(selectors.booking.isBookingSelectionStepComplete);
  meetingType$ = this.store.select(selectors.booking.selectMeetingType);
  bookingTemplateSummary$ = this.store.select(selectors.booking.selectBookingTemplateSummary);

  constructor(private store: Store) {}
  meetingTypeChange(meetingType: MeetingType) {
    this.store.dispatch(actions.booking.meetingType({ meetingType }));
  }

  nextStep() {
    this.store.dispatch(actions.booking.selectStep({ step: 'booking_form' }));
  }
}
