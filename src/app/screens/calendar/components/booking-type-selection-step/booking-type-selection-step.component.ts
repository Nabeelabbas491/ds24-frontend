import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectors, actions } from './../../../../store';
import { MeetingType } from './../../../../types/misc.type';

@Component({
  selector: 'ds-booking-type-selection-step',
  templateUrl: './booking-type-selection-step.component.html',
})
export class BookingTypeSelectionStepComponent {
  meetingType$ = this.store.select(selectors.booking.selectMeetingType);

  constructor(private store: Store) {}
  meetingTypeChange(meetingType: MeetingType) {
    this.store.dispatch(actions.booking.meetingType({ meetingType }));
  }

  prevStep() {
    this.store.dispatch(actions.booking.selectStep({ step: 'calendar' }));
  }

  nextStep() {
    this.store.dispatch(actions.booking.selectStep({ step: 'booking_form' }));
  }
}
