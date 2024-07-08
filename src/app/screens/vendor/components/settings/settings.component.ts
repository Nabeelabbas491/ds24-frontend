import { Component } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { BreadcrumbItem } from '@ds24/elements/lib/breadcrumb/breadcrumb-item';
import { Store } from '@ngrx/store';
import * as selectors from '../../../../store/selectors';
import * as actions from '../../../../store/actions';
import { takeUntil } from 'rxjs';
import { ReactiveLifecycles } from '@ds24/utilities';
import { DsSnackbarService, IconColor, MessageType } from '@ds24/elements';
import { SaveVendorSetting, VendorSetting, VendorSettingCollection } from './../../../../types/vendor-settings.type';
import { MeetingTypeId } from './../../../../types/booking.type';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'ds-settings',
  templateUrl: './settings.component.html',
})
export class SettingsComponent extends ReactiveLifecycles {
  spinnerColor = IconColor.Primary300;
  messageTypeError = MessageType.error;
  messageTypeSuccess = MessageType.success;

  inboundPhoneCallType = MeetingTypeId.Inbound;
  zoomCallType = MeetingTypeId.Zoom;

  showPrimaryColorPicker: boolean = false;
  showSecondaryColorPicker: boolean = false;
  tempPrimaryColor: string = '';
  tempSecondaryColor: string = '';

  vendorSettingCollection: VendorSettingCollection | undefined;

  logoFile: File | undefined;

  selectVendorSettingCollection$ = this.store.select(selectors.vendorSettings.selectVendorSettingsCollection);
  selectVendorSettingCollectionPending$ = this.store.select(
    selectors.vendorSettings.selectVendorSettingsCollectionPending,
  );

  selectSaveVendorSettingPending$ = this.store.select(selectors.vendorSettings.selectSaveVendorSettingPending);

  selectVendorSettingsPending$ = this.store.select(selectors.vendorSettings.selectPending);
  selectVendorSettingsSucess$ = this.store.select(selectors.vendorSettings.selectSuccess);

  form: FormGroup = this.fb.group({
    file: new FormControl('', { validators: [] }),
    primaryColor: new FormControl('', { validators: [] }),
    secondaryColor: new FormControl('', { validators: [] }),
    phoneNumber: new FormControl(''),
    meetingTypes: this.fb.array([]),
  });

  items: BreadcrumbItem[] = [{ title: 'Appointments Dashboard', url: '#/vendor' }, { title: 'Settings' }];

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private snackbarService: DsSnackbarService,
    private translateService: TranslateService,
  ) {
    super();
    this.store
      .select(selectors.vendorSettings.selectVendorSettingsForm)
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe(response => {
        this.form.patchValue(response);
      });

    this.selectVendorSettingCollection$.pipe(takeUntil(this.ngOnDestroy$)).subscribe(vendorSettingCollection => {
      if (vendorSettingCollection) {
        this.vendorSettingCollection = vendorSettingCollection;

        vendorSettingCollection.meetingTypes.forEach(() => {
          this.meetingTypesFormArray.push(this.fb.group({ meetingType: [false] }));
        });

        if (vendorSettingCollection.pageState === 'edit') {
          this.populateFormValues(vendorSettingCollection.vendorSetting);
        }
      }
    });

    this.meetingTypesFormArray.valueChanges.pipe(takeUntil(this.ngOnDestroy$)).subscribe(meetingTypes => {
      let isInboundSelected = false;

      this.vendorSettingCollection?.meetingTypes.forEach((value, index) => {
        isInboundSelected = value.id === MeetingTypeId.Inbound && meetingTypes[index].meetingType;
      });

      if (isInboundSelected) {
        this.formControls.phoneNumber.setValidators([Validators.required]);
      } else {
        this.formControls.phoneNumber.clearValidators();
      }
    });
  }

  populateFormValues(vendorSetting: VendorSetting | null) {
    if (vendorSetting) {
      this.formControls.primaryColor.setValue(vendorSetting.primaryColor);
      this.formControls.secondaryColor.setValue(vendorSetting.secondaryColor);
      this.formControls.phoneNumber.setValue(vendorSetting.phoneNumber);

      this.vendorSettingCollection?.meetingTypes.forEach((value, index) => {
        if (
          vendorSetting.meetingTypes.find(meetingType => meetingType.id === value.id && meetingType.name === value.name)
        ) {
          this.meetingTypesFormArray.controls[index].setValue({ meetingType: true });
        }
      });
    }
  }

  get formControls(): any {
    return this.form.controls;
  }

  get meetingTypesFormArray() {
    return this.formControls.meetingTypes as FormArray;
  }

  connectZoom() {
    //to be implemented later
  }

  updatePrimaryColor() {
    this.showPrimaryColorPicker = false;

    this.formControls.primaryColor.setValue(this.tempPrimaryColor);
  }

  selectPrimaryColorPicker() {
    this.showSecondaryColorPicker = false;
    this.showPrimaryColorPicker = true;
  }

  updateSecondaryColor() {
    this.showSecondaryColorPicker = false;
    this.formControls.secondaryColor.setValue(this.tempSecondaryColor);
  }

  selectSecondaryColorPicker() {
    this.showPrimaryColorPicker = false;
    this.showSecondaryColorPicker = true;
  }

  getFieldValue(fieldName: string) {
    return this.form.get(fieldName)?.value;
  }
  getMeetingTypeValue(index: number) {
    return this.meetingTypesFormArray.controls[index].value.meetingType;
  }

  markFormControlsAsTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      if (control.valid) {
        return;
      }
      if (control instanceof FormControl) {
        control.markAsTouched();
        control.markAsDirty();
        return;
      }

      if (control instanceof FormGroup) {
        control.markAsDirty();
        control.markAsTouched();
        control.setErrors({ atLeastOneSelected: true });
        return;
      }
    });
  }

  updateLogo(logoFile: File | undefined) {
    this.logoFile = logoFile;
  }

  submitVendorSetting() {
    if (!this.form.valid) {
      this.markFormControlsAsTouched(this.form);
      return;
    }
    const meetingTypes: number[] = [];
    this.vendorSettingCollection?.meetingTypes.forEach((value, index) => {
      if (this.getMeetingTypeValue(index)) {
        meetingTypes.push(value.id);
      }
    });
    if (meetingTypes.length === 0) {
      this.snackbarService.openSnackbar({
        title: this.translateService.instant('VENDOR.BOOKING.VENDOR_SETTING_ATLEAST_ONE_BOOKING_SELECTED'),
        type: 'error',
      });
    } else {
      const saveVendorSetting: SaveVendorSetting = {
        logo: this.logoFile,
        primaryColor: this.getFieldValue('primaryColor'),
        secondaryColor: this.getFieldValue('secondaryColor'),
        phoneNumber: this.getFieldValue('phoneNumber'),
        meetingTypes: meetingTypes,
      };

      this.vendorSettingCollection?.meetingTypes.forEach((value, index) => {
        if (this.getMeetingTypeValue(index)) {
          saveVendorSetting.meetingTypes.push(value.id);
        }
      });

      if (this.vendorSettingCollection) {
        this.store.dispatch(
          actions.vendorSettings.saveVendorSetting({
            pageState: this.vendorSettingCollection.pageState,
            saveVendorSetting,
          }),
        );
      }
    }
  }
}
