import { Pipe, PipeTransform } from '@angular/core';
import { TimeZone } from '../../types/timezone.type';

@Pipe({
  name: 'timezoneFormat',
})
export class TimezoneFormatPipe implements PipeTransform {
  transform(timeZone: TimeZone): string {
    if (timeZone) {
      return timeZone.name + ', ' + timeZone.abbreviatedTimeZone + ' ' + timeZone.offset;
    }
    return '';
  }
}
