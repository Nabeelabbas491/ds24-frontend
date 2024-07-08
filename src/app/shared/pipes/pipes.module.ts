import { NgModule } from '@angular/core';

import { AddCommasPipe } from './add-commas.pipe';
import { EllipsisPipe } from './ellipsis.pipe';
import { DateFormatPipe } from './date-format.pipe';
import { TimeSlotPipe } from './time-slot.pipe';
import { BookingTypeDescriptionPipe } from './booking-type-description.pipe';
import { TimezoneFormatPipe } from './timezone-format.pipe';
import { ShowPaginationPipe } from './show-pagination.pipe';

export const PIPES = [
  AddCommasPipe,
  EllipsisPipe,
  DateFormatPipe,
  TimeSlotPipe,
  BookingTypeDescriptionPipe,
  TimezoneFormatPipe,
  ShowPaginationPipe,
];

@NgModule({
  declarations: PIPES,
  exports: PIPES,
})
export class PipesModule {}
