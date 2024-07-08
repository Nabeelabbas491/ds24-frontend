import { Component } from '@angular/core';
import { ChipColor, IconColor, IconName } from '@ds24/elements';
import { Store } from '@ngrx/store';
import { ReactiveLifecycles } from '@ds24/utilities';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { takeUntil } from 'rxjs';

import * as actions from '../../../../store/actions';
import { selectors } from '../../../../store';
import { Slot } from './../../../../types/calendar-day.type';
@Component({
  selector: 'ds-time-selection',
  templateUrl: './time-selection.component.html',
})
export class TimeSelectionComponent extends ReactiveLifecycles {
  icons: typeof IconName = IconName;
  chipColor: typeof ChipColor = ChipColor;
  spinnerColor = IconColor.Primary300;

  selectedTimeZone$ = this.store.select(selectors.booking.selectTimeZone);
  selectedDay$ = this.store.select(selectors.booking.selectSelectedDay);
  selectedTimeSlot$ = this.store.select(selectors.booking.selectTimeSlot);

  isBookingTimeSlotsPending$ = this.store.select(selectors.bookingAPI.selectBookingTimeSlotsPending);
  bookingTimeSlots$ = this.store.select(selectors.bookingAPI.selectBookingTimeSlots);

  timeZones$ = this.store.select(selectors.timeZoneAPI.selectTimeZones);

  form: FormGroup = this.fb.group({
    timeZone: new FormControl(''),
  });

  constructor(
    private store: Store,
    private fb: FormBuilder,
  ) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();

    this.selectedTimeZone$.pipe(takeUntil(this.ngOnDestroy$)).subscribe(x => {
      this.formControls.timeZone.setValue(x);
    });

    this.formControls.timeZone.valueChanges.pipe(takeUntil(this.ngOnDestroy$)).subscribe((timeZone: string) => {
      this.store.dispatch(actions.booking.timeZone({ timeZone }));
    });
  }
  selectTimeSlot(timeSlot: Slot) {
    this.store.dispatch(actions.booking.timeSlot({ timeSlot }));
  }

  get formControls(): any {
    return this.form.controls;
  }
}
