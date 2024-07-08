import { Pipe, PipeTransform } from '@angular/core';
import { Slot } from './../../types/calendar-day.type';

@Pipe({
  name: 'timeSlot',
})
export class TimeSlotPipe implements PipeTransform {
  transform(slot: Slot | null): string {
    if (slot !== null) {
      return `${slot.startTime} - ${slot.endTime}`;
    }

    return '';
  }
}
