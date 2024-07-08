import { Component, Input } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { ScheduleFormService } from '../../../../services/schedule-form.service';

@Component({
  selector: 'ds-time-range',
  templateUrl: './time-range.component.html',
  styleUrls: ['./time-range.component.scss'],
})
export class TimeRangeComponent {
  @Input() timeRangeGroup!: FormGroup;
  @Input() timeRangeIndex: number = 0;
  @Input() timeRangeArray!: FormArray;

  constructor(public scheduleFormService: ScheduleFormService) {}

  changeOfInputValues() {
    this.timeRangeArray.markAllAsTouched();
    this.timeRangeArray.updateValueAndValidity();
  }
}
