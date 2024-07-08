import { Component, Input } from '@angular/core';
import { BookingTemplateSummary } from './../../../../types/booking.type';

@Component({
  selector: 'ds-booking-user-profile',
  templateUrl: './booking-user-profile.component.html',
})
export class BookingUserProfileComponent {
  @Input()
  bookingTemplateSummary: BookingTemplateSummary | null = null;
}
