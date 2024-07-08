import { Component, Input } from '@angular/core';
import { IconColor, IconName } from '@ds24/elements';

@Component({
  selector: 'ds-booking-info',
  templateUrl: './booking-info.component.html',
})
export class BookingInfoComponent {
  icons: typeof IconName = IconName;
  iconColors: typeof IconColor = IconColor;

  @Input()
  caption: string = '';

  @Input()
  value: string | null = '';

  @Input()
  iconName: IconName | undefined;

  @Input()
  iconCaption: string = '';
}
