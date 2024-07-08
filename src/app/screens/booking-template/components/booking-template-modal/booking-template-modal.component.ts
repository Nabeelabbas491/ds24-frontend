import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IconColor, IconName, MessageType } from '@ds24/elements';
import { ReactiveLifecycles } from '@ds24/utilities';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { BookingTemplateCollection, MeetingProduct, SaveBookingTemplate } from '../../../../types/vendor.types';
import { DEFAULT_ELEMENT_LENGTHS, bookingDurations } from '../../../../shared/common/util';
import { Store } from '@ngrx/store';
import { selectors, actions } from '../../../../store';
import { BookingTemplateListItem } from '../../../../types/vendor.booking-template.type';
import { Router } from '@angular/router';
import { MeetingTypeId } from './../../../../types/booking.type';

@Component({
  selector: 'ds-booking-template-modal',
  templateUrl: './booking-template-modal.component.html',
})
export class BookingTemplateModalComponent extends ReactiveLifecycles {
  closeIcon: IconName = IconName.DialogClose;
  darkIconColor = IconColor.Neutral500;
  spinnerColor = IconColor.Primary300;

  warningMessageType = MessageType.warning;
  inboundPhoneCallType = MeetingTypeId.Inbound;

  bookingTemplateForm: FormGroup;

  durations = bookingDurations;

  leftCountName$ = new BehaviorSubject<number>(DEFAULT_ELEMENT_LENGTHS.BOOKING_TEMPLATE_NAME_LENGTH);
  leftCountDescription$ = new BehaviorSubject<number>(DEFAULT_ELEMENT_LENGTHS.BOOKING_TEMPLATE_COMMENTS_LENGTH);
  templateUuid: number = 0;

  editIndex: number = 0;

  bookingTemplateCollection?: BookingTemplateCollection | null = null;

  upsertBookingTemplatePending$ = this.store.select(selectors.vendorBookingTemplate.selectUpsertBookingTemplatePending);

  alreadyAttachedMeetingProductList: Array<MeetingProduct> = [];

  @Input()
  set bookingTemplateFormCollection(value: BookingTemplateCollection | null | undefined) {
    this.bookingTemplateCollection = value;

    this.bookingTemplateCollection?.vendorSetting?.meetingTypes.forEach(() => {
      this.meetingTypesFormArray.push(this.fb.group({ meetingType: [false] }));
    });

    this.formControls.vendorPhoneNumber.setValue(value?.vendorSetting?.phoneNumber);

    if (value?.modalState === 'edit') {
      this.populateFormValues(value.bookingTemplateDetail);
    }
  }

  @Output() closeTemplatePanel = new EventEmitter<boolean>();

  currentEditIndex: number | undefined = undefined;
  editedTemplateId: string | undefined;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private router: Router,
  ) {
    super();

    this.bookingTemplateForm = this.fb.group({
      templateName: new FormControl('', [
        Validators.required,
        Validators.maxLength(DEFAULT_ELEMENT_LENGTHS.BOOKING_TEMPLATE_NAME_LENGTH),
      ]),
      description: new FormControl('', [
        Validators.required,
        Validators.maxLength(DEFAULT_ELEMENT_LENGTHS.BOOKING_TEMPLATE_COMMENTS_LENGTH),
      ]),
      products: new FormControl(''),
      duration: new FormControl('30', [Validators.required]),
      vendorPhoneNumber: new FormControl(''),
      meetingTypes: this.fb.array([]),
    });

    this.bookingTemplateForm
      .get('templateName')
      ?.valueChanges.pipe(takeUntil(this.ngOnDestroy$))
      .subscribe(value => {
        value
          ? this.leftCountName$.next(Math.max(0, DEFAULT_ELEMENT_LENGTHS.BOOKING_TEMPLATE_NAME_LENGTH - value?.length))
          : this.leftCountName$.next(DEFAULT_ELEMENT_LENGTHS.BOOKING_TEMPLATE_NAME_LENGTH);
      });

    this.bookingTemplateForm
      .get('description')
      ?.valueChanges.pipe(takeUntil(this.ngOnDestroy$))
      .subscribe(value => {
        value
          ? this.leftCountDescription$.next(
              Math.max(0, DEFAULT_ELEMENT_LENGTHS.BOOKING_TEMPLATE_COMMENTS_LENGTH - value?.length),
            )
          : this.leftCountDescription$.next(DEFAULT_ELEMENT_LENGTHS.BOOKING_TEMPLATE_COMMENTS_LENGTH);
      });

    this.bookingTemplateForm
      .get('products')
      ?.valueChanges.pipe(takeUntil(this.ngOnDestroy$))
      .subscribe(value => {
        this.setWarningProductsList(value);
      });

    this.meetingTypesFormArray.valueChanges.pipe(takeUntil(this.ngOnDestroy$)).subscribe(meetingTypes => {
      let isInboundSelected = false;

      this.bookingTemplateCollection?.vendorSetting?.meetingTypes.forEach((value, index) => {
        isInboundSelected = value.id === MeetingTypeId.Inbound && meetingTypes[index].meetingType;
      });

      if (isInboundSelected) {
        this.formControls.vendorPhoneNumber.setValidators([Validators.required]);
      } else {
        this.formControls.vendorPhoneNumber.clearValidators();
      }
    });

    this.store
      .select(selectors.vendor.selectEditedIndex)
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe(editIndex => {
        this.currentEditIndex = editIndex;
      });

    this.store
      .select(selectors.vendorBookingTemplate.selectUpsertBookingTemplateSuccess)
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe(successMsg => {
        if (successMsg) {
          this.resetBookingModal();
          this.closeTemplatePanel.emit(true);
        }
      });
  }

  submitBookingTemplateModal() {
    if (!this.bookingTemplateForm.valid) {
      this.markFormControlsAsTouched(this.bookingTemplateForm);
      return;
    }

    const saveBookingTemplate: SaveBookingTemplate = {
      name: this.getFieldValue('templateName'),
      description: this.getFieldValue('description'),
      duration: +this.getFieldValue('duration'),
      products: this.getFieldValue('products').map((x: string) => +x),
      phoneNumber: this.getFieldValue('vendorPhoneNumber'),
      meetingTypes: [],
    };

    this.bookingTemplateCollection?.vendorSetting?.meetingTypes.forEach((value, index) => {
      if (this.getMeetingTypeValue(index)) {
        saveBookingTemplate.meetingTypes.push(value.id);
      }
    });

    if (this.bookingTemplateCollection?.modalState === 'edit') {
      this.store.dispatch(
        actions.vendorBookingTemplate.upsertBookingTemplate({
          bookingTemplateId: this.bookingTemplateCollection.bookingTemplateDetail?.id,
          saveBookingTemplate,
        }),
      );
    } else {
      this.store.dispatch(actions.vendorBookingTemplate.upsertBookingTemplate({ saveBookingTemplate }));
    }
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

  getFieldValue(fieldName: string) {
    return this.bookingTemplateForm.get(fieldName)?.value;
  }
  getMeetingTypeValue(index: number) {
    return this.meetingTypesFormArray.controls[index].value.meetingType;
  }

  cancelBookingModal() {
    this.resetBookingModal();
    this.closeTemplatePanel.emit(false);
  }

  get formControls(): any {
    return this.bookingTemplateForm.controls;
  }

  get meetingTypesFormArray() {
    return this.formControls.meetingTypes as FormArray;
  }

  populateFormValues(bookingTemplateDetail: BookingTemplateListItem | null) {
    if (bookingTemplateDetail) {
      this.formControls.templateName.setValue(bookingTemplateDetail.name);
      this.formControls.description.setValue(bookingTemplateDetail.description);
      this.formControls.duration.setValue(`${bookingTemplateDetail.duration}`);
      this.formControls.products.setValue(bookingTemplateDetail.bookingProducts.map(x => `${x.id}`));

      this.bookingTemplateCollection?.vendorSetting?.meetingTypes.forEach((value, index) => {
        if (
          bookingTemplateDetail.bookingMeetingTypes.find(
            meetingType => meetingType.id === value.id && meetingType.name === value.name,
          )
        ) {
          this.meetingTypesFormArray.controls[index].setValue({ meetingType: true });
        }
      });
    }
  }
  resetBookingModal() {
    this.leftCountName$.next(DEFAULT_ELEMENT_LENGTHS.BOOKING_TEMPLATE_NAME_LENGTH);
    this.leftCountDescription$.next(DEFAULT_ELEMENT_LENGTHS.BOOKING_TEMPLATE_COMMENTS_LENGTH);
    this.bookingTemplateCollection = null;
  }

  navigateToSettings() {
    this.router.navigate(['/vendor/settings']);
  }

  switchProductById(id: string | number | undefined) {
    this.alreadyAttachedMeetingProductList = this.alreadyAttachedMeetingProductList?.filter(
      (meetingProduct: MeetingProduct) => meetingProduct.id !== id,
    );
  }

  removeProductById(id: string | number | undefined) {
    const productIds = this.bookingTemplateForm.value.products.filter(
      (meetingProductId: string | number | undefined) => meetingProductId !== id,
    );
    this.bookingTemplateForm.patchValue({ products: productIds });
  }

  setWarningProductsList(selectedProductIds: Array<string | number>) {
    const savedBookingProducts = this.bookingTemplateCollection?.bookingTemplateDetail?.bookingProducts.map(
      meetingProduct => `${meetingProduct.id}`,
    );
    this.alreadyAttachedMeetingProductList = this.bookingTemplateCollection?.meetingProducts.filter(
      meetingProduct =>
        selectedProductIds.includes(meetingProduct.id) &&
        !savedBookingProducts?.includes(meetingProduct.id) &&
        meetingProduct.is_attached,
    ) as MeetingProduct[];
  }
}
