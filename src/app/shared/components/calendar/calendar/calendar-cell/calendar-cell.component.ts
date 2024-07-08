import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Day } from './../../../../../types/calendar-day.type';

@Component({
  selector: 'ds-calendar-cell',
  templateUrl: './calendar-cell.component.html',
  styleUrls: ['./calendar-cell.component.scss'],
})
export class CalendarCellComponent {
  readonly dateOverrideMode = 'dateoverride';

  @Input()
  calendarMode: string | null = '';

  @Input()
  dayObj: Day | undefined;

  @Output()
  daySelected: EventEmitter<Day> = new EventEmitter();

  @Output()
  daysSelected: EventEmitter<Day> = new EventEmitter();

  selectDay() {
    if (!this.dayObj?.isOtherMonth && !this.dayObj?.isPast) {
      if (this.calendarMode === this.dateOverrideMode) {
        this.daysSelected.emit(this.dayObj);
      } else {
        if (this.dayObj?.isSelectable) {
          this.daySelected.emit(this.dayObj);
        }
      }
    }
  }
}
