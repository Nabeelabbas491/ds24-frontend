import { Component } from '@angular/core';
import { IconColor, IconName, MessageType } from '@ds24/elements';
import { Store } from '@ngrx/store';
import { selectors } from '../../../../store';

@Component({
  selector: 'ds-google-popup-message',
  templateUrl: './google-popup-message.component.html',
})
export class GooglePopupMessageComponent {
  icons: typeof IconName = IconName;
  iconColors: typeof IconColor = IconColor;
  spinnerColor = IconColor.Primary300;
  messageType = MessageType;
  vendorAppointmentAdditionMessage$ = this.store.select(
    selectors.googleIntegration.selectVendorAppointmentAdditionMessage,
  );
  isVendorConnectFailed$ = this.store.select(selectors.googleIntegration.selectIsVendorConnectionFailed);

  constructor(private store: Store) {}
}
