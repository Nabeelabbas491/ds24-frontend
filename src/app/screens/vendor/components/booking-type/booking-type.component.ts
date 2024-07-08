import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
@Component({
  selector: 'ds-booking-type',
  templateUrl: './booking-type.component.html',
})
export class BookingTypeComponent {
  @Input() form: FormGroup = new FormGroup({});

  // it will be implemented later
  connectZoom() {}
}
