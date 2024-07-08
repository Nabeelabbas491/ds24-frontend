import { Pipe, PipeTransform } from '@angular/core';
import { DateFormat } from './../../types/misc.type';
import { TranslateService } from '@ngx-translate/core';
import { format, parseISO } from 'date-fns';

@Pipe({
  name: 'dateFormat',
})
export class DateFormatPipe implements PipeTransform {
  constructor(private translateService: TranslateService) {}
  transform(dateString: string | undefined | null, formatStr: DateFormat = 'full'): string {
    if (dateString == null) {
      return '';
    }
    if (formatStr === 'full') {
      return format(parseISO(dateString), this.translateService.instant('CALENDAR.DAY_FORMAT_STRING.FULL'));
    }
    if (formatStr === 'full_without_year') {
      return format(
        parseISO(dateString),
        this.translateService.instant('CALENDAR.DAY_FORMAT_STRING.FULL_WITHOUT_YEAR'),
      );
    }

    if (formatStr === 'day_month_year') {
      return format(parseISO(dateString), 'dd MMMM, yyyy');
    }
    if (formatStr === 'day_half-month_year') {
      return format(parseISO(dateString), 'dd MMM, yyyy');
    }

    return '';
  }
}
