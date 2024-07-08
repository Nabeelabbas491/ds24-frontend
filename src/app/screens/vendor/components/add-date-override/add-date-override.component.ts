import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { IconColor, IconName } from '@ds24/elements';
import { Store } from '@ngrx/store';
import { selectors, actions } from '../../../../store';
import { Observable, filter, mergeMap, takeUntil } from 'rxjs';
import { ScheduleFormService } from '../../../../services/schedule-form.service';
import { ReactiveLifecycles } from '@ds24/utilities';
import { CustomValidators } from '../../../../shared/common/custom-validator';

@Component({
  selector: 'ds-add-date-override',
  templateUrl: './add-date-override.component.html',
})
export class AddDateOverrideComponent extends ReactiveLifecycles {
  overideDaysForm: FormGroup;
  closeIcon: IconName = IconName.DialogClose;
  trash: IconName = IconName.Trash;
  icon: IconName = IconName.Plus;
  iconColor = IconColor.Neutral500;
  openOverRideModal$: Observable<boolean> = this.store.select(selectors.vendor.selectOpenAddOverrideModal);
  selectedDays$ = this.store.select(selectors.calendar.selectCalendarSelectedDays);
  constructor(
    private fb: FormBuilder,
    private store: Store,
    private scheduleFormService: ScheduleFormService,
  ) {
    super();
    this.overideDaysForm = this.fb.group({
      timeRange: this.fb.array([], [CustomValidators.validateTimeRange()]),
    });

    this.store.dispatch(actions.calendar.setMode({ mode: 'dateoverride' }));

    this.store
      .select(selectors.vendor.selectOpenAddOverrideModal)
      .pipe(
        takeUntil(this.ngOnDestroy$),
        filter(openModal => openModal === true),
        mergeMap(() => this.store.select(selectors.vendorSchedule.selectOpenedOverrideTimeSlots)),
      )
      .subscribe(timeslots => {
        this.getTimeRangeArray.clear();

        timeslots.forEach(slot => {
          const slotFormGroup = this.fb.group(
            {
              from: new FormControl(slot.from),
              to: new FormControl(slot.to),
            },
            [CustomValidators.isStartMore()],
          );

          (this.overideDaysForm.get('timeRange') as FormArray).push(slotFormGroup);
        });
      });
  }

  get getOverRideDayControls() {
    return (this.overideDaysForm.get('timeRange') as FormArray).controls;
  }

  get getTimeRangeArray() {
    return this.overideDaysForm?.get('timeRange') as FormArray;
  }

  getTimeRangeGroup(index: number) {
    return (this.overideDaysForm?.get('timeRange') as FormArray).get(index.toString()) as FormGroup;
  }

  appendTimeRanges() {
    const hasError = this.getTimeRangeArray.invalid;

    if (!hasError) {
      this.scheduleFormService.addTimeInput(this.overideDaysForm);
    }
  }

  removeTimeRanges(timeRangeIndex: number) {
    this.scheduleFormService.deleteTimeRange(timeRangeIndex, this.overideDaysForm);
  }

  saveOverrides() {
    this.store.dispatch(
      actions.vendorSchedule.saveOverrideForm({
        timeSlots: (this.overideDaysForm.get('timeRange') as FormArray).getRawValue(),
      }),
    );
    this.store.dispatch(actions.vendorSchedule.saveDateOverride());
    this.cancelOverrideModal();
  }

  cancelOverrideModal() {
    this.getTimeRangeArray.clear();
    this.overideDaysForm.reset();
    this.store.dispatch(actions.vendor.setAddOverrideModalVisibilityStatus({ addOverrideModal: false }));
    this.store.dispatch(actions.calendar.resetSelectedDays());
    this.store.dispatch(actions.vendorSchedule.resetOpenedOverrideTimeSlots());
  }
}
