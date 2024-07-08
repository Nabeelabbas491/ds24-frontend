import { Component } from '@angular/core';
import { IconColor, IconName } from '@ds24/elements';
import { actions, selectors } from '../../../../store';
import { Store } from '@ngrx/store';
import { MeetingTypeId } from './../../../../types/booking.type';
import { Clipboard } from '@angular/cdk/clipboard';
import { TranslateService } from '@ngx-translate/core';
import { ReactiveLifecycles } from '@ds24/utilities';
import { GoogleIntegrationInfo } from './../../../../types/google-integration.type';
import { takeUntil } from 'rxjs';
import { saveBookingSnapshot } from './../../../../shared/common/util';

@Component({
  selector: 'ds-booking-confirmation',
  templateUrl: './booking-confirmation.component.html',
})
export class BookingConfirmationComponent extends ReactiveLifecycles {
  meetingTypeIds = MeetingTypeId;

  icons: typeof IconName = IconName;
  iconColors: typeof IconColor = IconColor;
  spinnerColor = IconColor.Primary300;

  bookingSuccess$ = this.store.select(selectors.booking.selectBookingSaveSuccess);
  downloadClientICSPending$ = this.store.select(selectors.bookingAPI.selectDownloadClientICSPending);
  bookingSnapshot$ = this.store.select(selectors.booking.selectBookingSnapshot);
  isBookingSynced$ = this.store.select(selectors.booking.selectIsBookingSynced);

  bookingProductId$ = this.store.select(selectors.bookingAPI.selectBookingProductId);
  bookingProductId: string | null | undefined;

  getAuthenticationUrlPending$ = this.store.select(selectors.googleIntegration.selectAuthenticationUrlPending);

  constructor(
    private store: Store,
    private clipboard: Clipboard,
    private _translate: TranslateService,
  ) {
    super();

    this.bookingProductId$.pipe(takeUntil(this.ngOnDestroy$)).subscribe(bookingProductId => {
      this.bookingProductId = bookingProductId;
    });
  }

  downloadICS(appointmentId: number) {
    this.store.dispatch(actions.bookingAPI.downloadClientICS({ appointmentId }));
  }
  saveToGoogleCalendar() {
    if (this.bookingProductId) {
      this.bookingSnapshot$.pipe(takeUntil(this.ngOnDestroy$)).subscribe(bookingSnapshot => {
        saveBookingSnapshot(bookingSnapshot);

        const integrationInfo: GoogleIntegrationInfo = {
          integrationMode: 'client-booking',
          bookingProductId: this.bookingProductId!,
        };

        this.store.dispatch(actions.googleIntegration.getAuthenticationUrl({ integrationInfo }));
      });
    }
  }

  copyPhone(phone: string) {
    this.clipboard.copy(phone);
    this.showSnackbarMessage('BOOKING.BOOKING_CONFIRMATION.VENDOR_PHONE_NUMBER_COPIED');
  }
  copyZoomLink(zoomLink: string) {
    this.clipboard.copy(zoomLink);
    this.showSnackbarMessage('BOOKING.BOOKING_CONFIRMATION.ZOOME_MEETING_LINK_COPIED');
  }

  showSnackbarMessage(message: string) {
    const snackBarMessage = this._translate.instant(message);
    this.store.dispatch(actions.notification.callSnackBarPopup({ snackBarMessage }));
  }
}
