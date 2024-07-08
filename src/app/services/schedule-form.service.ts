import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { DefaultTime } from '../shared/common/util';
import { Injectable } from '@angular/core';
import { CustomValidators } from '../shared/common/custom-validator';
@Injectable()
export class ScheduleFormService {
  addTimeInput(dayForm: FormGroup) {
    const isUnavailable = dayForm?.get('unavailable');
    const selected = dayForm?.get('selected');
    const timeRange = dayForm?.get('timeRange') as FormArray;
    const lastFormGroupEmpty = timeRange.controls.length === 0;

    if (!isUnavailable?.value && lastFormGroupEmpty === false) {
      const lastFormGroup = timeRange.controls[timeRange.controls.length - 1].value;
      const lastTimeRangeEndValue = parseInt(lastFormGroup.to.split(':')[0]);
      const formattedValue = (lastTimeRangeEndValue + 1) % 24;
      const incrementedStartTime = formattedValue.toString().padStart(2, '0') + ':00';
      const incrementedEndTime = (formattedValue + 1).toString().padStart(2, '0') + ':00';

      timeRange.controls.push(
        new FormGroup(
          {
            from: new FormControl(incrementedStartTime),
            to: new FormControl(incrementedEndTime !== '24:00' ? incrementedEndTime : '23:59'),
          },
          [CustomValidators.isStartMore()],
        ),
      );

      this.markTimeRangeAsChecked(timeRange);
      return;
    }

    selected?.setValue(true);
    isUnavailable?.setValue(false);

    if (lastFormGroupEmpty === true) {
      timeRange.controls.push(
        new FormGroup(
          {
            from: new FormControl(DefaultTime.from),
            to: new FormControl(DefaultTime.to),
          },
          [CustomValidators.isStartMore()],
        ),
      );
      this.markTimeRangeAsChecked(timeRange);
    }
  }

  markTimeRangeAsChecked(timeRange: FormArray) {
    timeRange.markAllAsTouched();
    timeRange.updateValueAndValidity();
  }

  deleteTimeRange(timeRangeIndex: number, dayForm: FormGroup) {
    const timeRange = dayForm?.get('timeRange') as FormArray;

    if (timeRangeIndex === 0 && timeRange.length === 1) {
      const selected = dayForm?.get('selected');
      const unavailable = dayForm?.get('unavailable');
      selected?.setValue(false);
      unavailable?.setValue(true);
    }

    timeRange?.removeAt(timeRangeIndex);
  }

  toggleDaySelection(event: any, dayForm: FormGroup) {
    const selected = dayForm?.get('selected');
    selected?.setValue(event.target.checked);

    const timeRange = dayForm?.get('timeRange') as FormArray;
    const unavailable = dayForm?.get('unavailable') as FormControl;

    if (!event.target.checked) {
      timeRange.clear();
      unavailable.setValue(true);
      return;
    }

    unavailable.setValue(false);

    if ((dayForm?.get('timeRange') as FormArray).controls.length === 0) {
      (dayForm?.get('timeRange') as FormArray).controls.push(
        new FormGroup(
          {
            from: new FormControl(DefaultTime.from),
            to: new FormControl(DefaultTime.to),
          },
          [CustomValidators.isStartMore()],
        ),
      );
    }
  }
}
