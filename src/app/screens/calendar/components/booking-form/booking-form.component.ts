import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveLifecycles } from '@ds24/utilities';
import { Store } from '@ngrx/store';
import { actions, selectors } from '../../../../store';
import { BehaviorSubject, filter, takeUntil } from 'rxjs';
import { MeetingTypeId } from './../../../../types/booking.type';
import { IconColor } from '@ds24/elements';
import { noWhitespaceValidator } from './../../../../shared/common/util';

@Component({
  selector: 'ds-booking-form',
  templateUrl: './booking-form.component.html',
})
export class BookingFormComponent extends ReactiveLifecycles {
  meetingTypeIds = MeetingTypeId;

  meetingType$ = this.store.select(selectors.booking.selectMeetingType);
  isMobileView$ = this.store.select(selectors.viewBreakPoint.selectIsMobileView);
  error$ = this.store.select(selectors.bookingAPI.selectBookingSaveError);
  saveBookingPending$ = this.store.select(selectors.bookingAPI.selectBookingSavePending);

  leftCountName$ = new BehaviorSubject<number>(80);
  leftCountComments$ = new BehaviorSubject<number>(300);

  spinnerColor = IconColor.Primary300;

  form: FormGroup = this.fb.group({
    name: new FormControl('', { validators: [Validators.required, Validators.maxLength(80), noWhitespaceValidator] }),
    email: new FormControl('', { validators: [Validators.required, Validators.maxLength(255)] }),
    phoneNo: new FormControl('', { validators: [Validators.pattern(/^\+\d{1,4}\s?\d{1,}$/)] }),
    note: new FormControl('', { validators: [Validators.maxLength(300), noWhitespaceValidator] }),
  });

  constructor(
    private fb: FormBuilder,
    private store: Store,
  ) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();

    this.saveBookingPending$.pipe(takeUntil(this.ngOnDestroy$)).subscribe(isPending => {
      if (isPending) {
        this.form.disable();
      } else {
        this.form.enable();
      }
    });

    this.form
      .get('name')
      ?.valueChanges.pipe(takeUntil(this.ngOnDestroy$))
      .subscribe(value => {
        value ? this.leftCountName$.next(Math.max(0, 80 - value?.length)) : this.leftCountName$.next(80);
      });

    this.form
      .get('note')
      ?.valueChanges.pipe(takeUntil(this.ngOnDestroy$))
      .subscribe(value => {
        value ? this.leftCountComments$.next(Math.max(0, 300 - value?.length)) : this.leftCountComments$.next(300);
      });

    this.meetingType$
      .pipe(
        filter(meetingType => meetingType?.id === this.meetingTypeIds.Outbound),
        takeUntil(this.ngOnDestroy$),
      )
      .subscribe(() => {
        //eslint-disable-line
        this.formControls.phoneNo?.setValidators([Validators.required, Validators.pattern(/^\+\d{1,4}\s?\d{1,}$/)]);
      });
  }

  prevStep() {
    this.store.dispatch(actions.booking.selectStep({ step: 'booking_type' }));
  }
  confirmBooking() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.store.dispatch(actions.bookingAPI.saveBooking({ bookingDetail: this.form.value }));
    }
  }

  get formControls(): any {
    return this.form.controls;
  }
}
