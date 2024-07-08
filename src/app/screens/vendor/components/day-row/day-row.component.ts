import { Component, Input } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { IconColor, IconName } from '@ds24/elements';
import { ScheduleFormService } from '../../../../services/schedule-form.service';
@Component({
  selector: 'ds-day-row',
  templateUrl: './day-row.component.html',
})
export class DayRowComponent {
  @Input() dayRowIndex: number = 0;
  @Input() dayForm!: FormGroup;
  timeRangeArray: FormArray;

  icon: IconName = IconName.Plus;
  trash: IconName = IconName.Trash;
  iconColor = IconColor.Neutral500;
  constructor(private scheduleFormService: ScheduleFormService) {
    this.timeRangeArray = this.getTimeRangeArray;
  }

  get getTimeRangeArrayControls() {
    return (this.dayForm?.get('timeRange') as FormArray).controls;
  }

  get getTimeRangeArray() {
    return this.dayForm?.get('timeRange') as FormArray;
  }

  get getDayName() {
    return this.dayForm?.get('dayOfWeek')?.value;
  }

  getTimeRangeGroup(index: number) {
    return (this.dayForm?.get('timeRange') as FormArray).get(index.toString()) as FormGroup;
  }

  pushTimeRange() {
    const hasError = this.getTimeRangeArray.invalid;

    if (!hasError) {
      this.scheduleFormService.addTimeInput(this.dayForm);
    }
  }

  removeTimeRange(timeRangeIndex: number) {
    this.scheduleFormService.deleteTimeRange(timeRangeIndex, this.dayForm);
  }

  changeDaySelection(event: any) {
    this.scheduleFormService.toggleDaySelection(event, this.dayForm);
  }
}
