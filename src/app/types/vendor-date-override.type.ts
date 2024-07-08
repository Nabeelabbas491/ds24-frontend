import { Slot } from './calendar-day.type';
import { DateRange } from './misc.type';

export interface DateOverrideListItem extends DateRange {
  timeSlots: Slot[];
}

export type OverlapType = {
  existingContains: boolean;
  inputContains: boolean;
  existingCoincidesFirst: boolean;
  inputCoincidesFirst: boolean;
};
