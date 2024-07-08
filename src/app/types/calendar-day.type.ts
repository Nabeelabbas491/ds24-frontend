export interface Day {
  number: number;
  isToday: boolean;
  isSelected: boolean;
  isOtherMonth: boolean;
  isPast: boolean;
  dayMonthYearTitle: string;
  isSelectable: boolean;
  slotsArr?: Slot[];
}

export interface Slot {
  startTime: string;
  endTime: string;
}
