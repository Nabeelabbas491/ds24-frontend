import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BreadcrumbItem } from '@ds24/elements/lib/breadcrumb/breadcrumb-item';
import { Clipboard } from '@angular/cdk/clipboard';
import { IconColor, IconName, SnackbarRef } from '@ds24/elements';
import { Store } from '@ngrx/store';
import * as selectors from '../../../../store/selectors';
import * as actions from '../../../../store/actions';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs';
import { ReactiveLifecycles } from '@ds24/utilities';
import { AppointmentDetails } from '../../../../types/vendor.types';
import { GoogleIntegrationInfo } from 'src/app/types/google-integration.type';

@Component({
  selector: 'ds-appointment-details',
  templateUrl: './appointment-details.component.html',
  styleUrls: ['./appointment-details.component.scss'],
})
export class AppointmentDetailsComponent extends ReactiveLifecycles {
  public _snackbarRef: SnackbarRef | null = null;
  public deleteModalVisible: boolean = false;
  closeIcon: IconName = IconName.DialogClose;
  copyIcon: IconName = IconName.Copy;
  calendarIcon: IconName = IconName.Calendar;
  linkIcon: IconName = IconName.LinkHorizontal;
  iconColor = IconColor.Neutral400;
  copyIconColor = IconColor.Neutral500;
  spinnerColor = IconColor.Neutral500;
  whiteSpinnerColor = IconColor.white;
  appoinmentDetailsData$ = this.store.select(selectors.vendorAppointment.selectAppointmentsDetailData);
  isLoading$ = this.store.select(selectors.vendorAppointment.selectPending);
  isDownloadICSFilePending$ = this.store.select(selectors.vendorAppointment.selectDownloadVendorICSPending);
  appoinmentDetailsData: AppointmentDetails = {} as AppointmentDetails;
  public items: BreadcrumbItem[] = [
    { title: 'Appointment Dashboard', route: '/vendor' },
    { title: 'Appointments' },
    { title: '' },
  ];

  form = new FormGroup(
    {
      phone: new FormControl(),
      zoomLink: new FormControl(),
    },
    { updateOn: 'blur' },
  );
  isCancelPending: boolean = false;
  titleName: string = '';
  productTitle: string = '';

  constructor(
    private clipboard: Clipboard,
    private store: Store,
    private _translate: TranslateService,
  ) {
    super();
    this.appoinmentDetailsData$.pipe(takeUntil(this.ngOnDestroy$)).subscribe(appointmentData => {
      this.appoinmentDetailsData = appointmentData;
      this.titleName = appointmentData.name;
      this.productTitle = appointmentData.bookingProduct.productName;
      this.items[2].title = appointmentData.name.slice(0, 40) + '...';
      this.form.get('phone')?.patchValue(appointmentData?.phoneNumber);
      this.form.get('zoomLink')?.patchValue(appointmentData?.zoomLink);
    });
  }

  copyPhone() {
    const value = this.form.get('phone')?.value as string;
    this.clipboard.copy(value);
    this.toggleSnackBar();
  }

  copyLink() {
    const value = this.form.get('zoomLink')?.value as string;
    this.clipboard.copy(value);
    this.toggleSnackBar();
  }

  toggleModalVisibility(isVisible: boolean) {
    this.deleteModalVisible = isVisible;
  }

  cancelAppointment() {
    this.store.dispatch(
      actions.vendorAppointment.cancelAppointment({ appointmentId: this.appoinmentDetailsData.id as number }),
    );
    this.store
      .select(selectors.vendorAppointment.selectCancelPending)
      .pipe(takeUntil(this.ngOnChanges$))
      .subscribe(isCancelPending => {
        this.isCancelPending = isCancelPending;
        if (!isCancelPending) {
          this.deleteModalVisible = false;
        }
      });
  }

  toggleSnackBar = () => {
    const snackBarMessage = this._translate.instant('VENDOR.DETAILS.COPIED_SUCCESS_MESSAGE');
    this.store.dispatch(actions.notification.callSnackBarPopup({ snackBarMessage }));
  };

  downloadIcsFile() {
    this.store.dispatch(
      actions.vendorAppointment.downloadVendorICS({ appointmentId: this.appoinmentDetailsData.id as number }),
    );
  }

  initiateGoogleAuth() {
    const integrationInfo: GoogleIntegrationInfo = {
      integrationMode: 'vendor-appointment',
      appointmentId: this.appoinmentDetailsData.id?.toString(),
    };
    this.store.dispatch(actions.googleIntegration.getAuthenticationUrl({ integrationInfo }));
  }
}
