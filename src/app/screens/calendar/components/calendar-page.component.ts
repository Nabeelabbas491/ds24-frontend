import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import { selectors } from '../../../store';
import { IconColor, MessageType } from '@ds24/elements';

@Component({
  selector: 'ds-calendar-page',
  templateUrl: './calendar-page.component.html',
})
export class CalendarPageComponent {
  spinnerColor = IconColor.Primary300;
  messageTypeError = MessageType.error;

  selectBookingTemplatePending$ = this.store.select(selectors.bookingAPI.selectBookingTemplatePending);
  selectBookingTemplateError$ = this.store.select(selectors.bookingAPI.selectBookingTemplateError);

  currentStep$ = this.store.select(selectors.booking.selectCurrentStep);

  isMobileView$ = this.store.select(selectors.viewBreakPoint.selectIsMobileView);

  constructor(private store: Store) {}
}
