import { addDays, format, parseISO, subDays } from 'date-fns';
import { Slot, Day } from './../../types/calendar-day.type';
import { DateOverrideListItem } from './../../types/vendor-date-override.type';
import { DateRange } from './../../types/misc.type';
import { Availibility, TimeSlot } from '../../types/vendor.types';
import { OverlapType } from '../../types/vendor-date-override.type';

export function buildInitialDateOverrideList(
  availabilities: Availibility[],
  vendorIndex: number | null,
): DateOverrideListItem[] {
  return availabilities
    .filter(day => day.type === 'override' && day.id !== vendorIndex)
    .map(day => {
      const timeSlots = day.slot.map(slot => {
        return {
          startTime: slot.from,
          endTime: slot.to,
        } as Slot;
      });

      return {
        startDate: day.startDate,
        endDate: day.endDate,
        timeSlots: { ...timeSlots },
      } as DateOverrideListItem;
    });
}

export function constructTimeSlots(overrideForm: TimeSlot[]): Slot[] {
  return overrideForm.map(slot => {
    return {
      startTime: slot.from,
      endTime: slot.to,
    } as Slot;
  });
}

export function buildDateOverridePayload(
  existingOverrideList: DateOverrideListItem[],
  selectedDays: Day[],
  timeSlots: Slot[],
): Availibility[] {
  const dateRanges: DateRange[] = buildDateRanges(selectedDays);
  const inputDateOverrides: DateOverrideListItem[] = buildInputDateOverrides(dateRanges, timeSlots);
  let dateOverrideListTemp: DateOverrideListItem[] = [];

  if (existingOverrideList.length === 0) {
    dateOverrideListTemp = [...inputDateOverrides];
  }

  if (inputDateOverrides.length === 0) {
    dateOverrideListTemp = [...existingOverrideList];
  }

  inputDateOverrides.forEach(inputOverride => {
    existingOverrideList.forEach(existingOverride => {
      const overlapType = returnOverlapType(inputOverride, existingOverride);
      const areDaysIdentical = areDayRangesIdentical(inputOverride, existingOverride);
      const hasSameStartDate = inputOverride.startDate === existingOverride.startDate;
      const hasSameEndDate = inputOverride.endDate === existingOverride.endDate;
      const inputEndDateCoincides = inputOverride.endDate === existingOverride.startDate;
      const existingEndDateCoincides = inputOverride.startDate === existingOverride.endDate;

      if (areDaysIdentical) {
        addUniqueDateOverride(dateOverrideListTemp, inputOverride);
      } else if (hasSameStartDate) {
        const sameStartDateRanges = getDateRangeWhenStartDateSame(inputOverride, existingOverride);
        dateOverrideListTemp = updateDateOverrideList(dateOverrideListTemp, sameStartDateRanges);
      } else if (hasSameEndDate) {
        const sameEndDateRanges = getPartialDateRangeEndDateSame(inputOverride, existingOverride);
        dateOverrideListTemp = updateDateOverrideList(dateOverrideListTemp, sameEndDateRanges);
      } else if (inputEndDateCoincides) {
        const inputEndDateCoincidesRanges = getPartialDateForInputEnddateCoincide(inputOverride, existingOverride);
        dateOverrideListTemp = updateDateOverrideList(dateOverrideListTemp, inputEndDateCoincidesRanges);
      } else if (existingEndDateCoincides) {
        const existingEndDateCoincidesRanges = getPartialDateForExistingEnddateCoincide(
          inputOverride,
          existingOverride,
        );
        dateOverrideListTemp = updateDateOverrideList(dateOverrideListTemp, existingEndDateCoincidesRanges);
      } else if (hasOverlap(overlapType)) {
        const overlapDateRanges = getDividedDateOverrides(inputOverride, existingOverride, overlapType);
        dateOverrideListTemp = updateDateOverrideList(dateOverrideListTemp, overlapDateRanges);
      } else {
        handleNonOverlapCases(dateOverrideListTemp, inputOverride, existingOverride);
      }
    });
  });

  const dateOverridePayload: Availibility[] = generatePayloadFromDateOverrides(dateOverrideListTemp);

  return dateOverridePayload;
}

export function generatePayloadFromDateOverrides(dateOverrideListTemp: DateOverrideListItem[]): Availibility[] {
  const unSortedPayload = dateOverrideListTemp.map(day => {
    const slotArray = Object.values(day.timeSlots).map(
      slot =>
        ({
          from: slot.startTime,
          to: slot.endTime,
        }) as TimeSlot,
    );

    return {
      startDate: day.startDate,
      endDate: day.endDate,
      type: 'override',
      day: '',
      slot: [...slotArray],
    } as Availibility;
  });

  const sortedPayload = toSorted(unSortedPayload);

  return sortedPayload;
}

function toSorted(payload: Availibility[]): Availibility[] {
  return payload.sort((a, b) => parseISO(a.startDate as string).getTime() - parseISO(b.startDate as string).getTime());
}

export function buildInputDateOverrides(dateRanges: DateRange[], timeSlots: Slot[]): DateOverrideListItem[] {
  return dateRanges.map(dateRange => ({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    timeSlots: timeSlots,
  }));
}

export function hasOverlap(overlapType: OverlapType): boolean {
  return Object.values(overlapType).some(value => value === true);
}

export function updateDateOverrideList(
  dateOverrideList: DateOverrideListItem[],
  finalDateRange: DateOverrideListItem[],
): DateOverrideListItem[] {
  const uniqueStartDates = new Set(dateOverrideList.map(override => override.startDate));

  const uniqueFinalDateRanges = finalDateRange.filter(finalRange => !uniqueStartDates.has(finalRange.startDate));

  return [...dateOverrideList, ...uniqueFinalDateRanges];
}

export function addUniqueDateOverride(
  dateOverrideList: DateOverrideListItem[],
  inputOverride: DateOverrideListItem,
): void {
  const existingIndex = dateOverrideList.findIndex(
    override => override.startDate === inputOverride.startDate || override.endDate === inputOverride.endDate,
  );

  if (existingIndex !== -1) {
    const existingOverride = dateOverrideList[existingIndex];
    const isStartOverlap = parseISO(existingOverride.endDate) <= parseISO(inputOverride.endDate);
    const isEndOverlap = parseISO(existingOverride.startDate) >= parseISO(inputOverride.startDate);

    if (isStartOverlap || isEndOverlap) {
      dateOverrideList.splice(existingIndex, 1);
    }
  }

  dateOverrideList.push(inputOverride);
}

export function handleNonOverlapCases(
  dateOverrideList: DateOverrideListItem[],
  inputOverride: DateOverrideListItem,
  existingOverride: DateOverrideListItem,
): void {
  if (
    (isDateAdjacent(inputOverride.startDate, parseISO(existingOverride.endDate)) ||
      isDateAdjacent(existingOverride.startDate, parseISO(inputOverride.endDate))) &&
    areTimeSlotsIdentical(inputOverride.timeSlots, existingOverride.timeSlots)
  ) {
    const constructedDateRange = buildConstructedDateRange(inputOverride, existingOverride);
    addUniqueDateOverride(dateOverrideList, constructedDateRange);
  } else {
    addUniqueDateOverride(dateOverrideList, existingOverride);
    addUniqueDateOverride(dateOverrideList, inputOverride);
  }
}

export function buildConstructedDateRange(
  inputOverride: DateOverrideListItem,
  existingOverride: DateOverrideListItem,
): DateOverrideListItem {
  const inputStartDate = parseISO(inputOverride.startDate);
  const existingStartDate = parseISO(existingOverride.startDate);

  return {
    startDate: inputStartDate > existingStartDate ? existingOverride.startDate : inputOverride.startDate,
    endDate: inputStartDate > existingStartDate ? inputOverride.endDate : existingOverride.endDate,
    timeSlots: [...inputOverride.timeSlots],
  } as DateOverrideListItem;
}

export function returnOverlapType(
  inputOverride: DateOverrideListItem,
  existingOverride: DateOverrideListItem,
): OverlapType {
  const isBefore = (dateA: Date, dateB: Date): boolean => dateA <= dateB;

  const inputOverrideStart = parseISO(inputOverride.startDate);
  const inputOverrideEnd = parseISO(inputOverride.endDate);
  const existingOverrideStart = parseISO(existingOverride.startDate);
  const existingOverrideEnd = parseISO(existingOverride.endDate);

  const existingContainsInput =
    isBefore(existingOverrideStart, inputOverrideStart) &&
    isBefore(inputOverrideStart, inputOverrideEnd) &&
    isBefore(inputOverrideEnd, existingOverrideEnd);

  const inputContainsExisting =
    isBefore(inputOverrideStart, existingOverrideStart) &&
    isBefore(existingOverrideStart, existingOverrideEnd) &&
    isBefore(existingOverrideEnd, inputOverrideEnd);

  const existingCoincidesFirst =
    !existingContainsInput &&
    !inputContainsExisting &&
    isBefore(existingOverrideStart, inputOverrideStart) &&
    isBefore(inputOverrideStart, existingOverrideEnd) &&
    isBefore(existingOverrideStart, inputOverrideEnd);

  const inputCoincidesFirst =
    !existingContainsInput &&
    !inputContainsExisting &&
    isBefore(inputOverrideStart, existingOverrideStart) &&
    isBefore(existingOverrideStart, inputOverrideEnd) &&
    isBefore(inputOverrideEnd, existingOverrideEnd);

  return {
    existingContains: existingContainsInput,
    inputContains: inputContainsExisting,
    existingCoincidesFirst: existingCoincidesFirst,
    inputCoincidesFirst: inputCoincidesFirst,
  } as OverlapType;
}

export function areTimeSlotsIdentical(inputTimeSlots: Slot[], existingTimeSlots: Slot[]) {
  const existingTimeSlotsArray = Object.values(existingTimeSlots).map(
    slot =>
      ({
        startTime: slot.startTime,
        endTime: slot.endTime,
      }) as Slot,
  );

  if (inputTimeSlots.length !== existingTimeSlotsArray.length) {
    return false;
  }

  const sortedInputTimeSlots = inputTimeSlots.slice().sort((a, b) => a.startTime.localeCompare(b.startTime));
  const sortedExistingTimeSlots = existingTimeSlotsArray.slice().sort((a, b) => a.startTime.localeCompare(b.startTime));

  for (let i = 0; i < sortedInputTimeSlots.length; i++) {
    const inputSlot = sortedInputTimeSlots[i];
    const existingSlot = sortedExistingTimeSlots[i];

    if (inputSlot.startTime !== existingSlot.startTime || inputSlot.endTime !== existingSlot.endTime) {
      return false;
    }
  }

  return true;
}
export function getDateRangeWhenStartDateSame(
  inputDateRange: DateOverrideListItem,
  existngDateRange: DateOverrideListItem,
): DateOverrideListItem[] {
  const sourceEndDate = parseISO(inputDateRange.endDate);
  const destinationEndDate = parseISO(existngDateRange.endDate);

  if (sourceEndDate < destinationEndDate) {
    return [
      { startDate: inputDateRange.startDate, endDate: inputDateRange.endDate, timeSlots: inputDateRange.timeSlots },
      {
        startDate: format(addDays(sourceEndDate, 1), 'yyyy-MM-dd'),
        endDate: existngDateRange.endDate,
        timeSlots: existngDateRange.timeSlots,
      },
    ];
  }
  if (sourceEndDate > destinationEndDate) {
    return [
      { startDate: inputDateRange.startDate, endDate: inputDateRange.endDate, timeSlots: inputDateRange.timeSlots },
    ];
  }
  return [];
}

export function getPartialDateRangeEndDateSame(
  inputDateRange: DateOverrideListItem,
  existingDateRange: DateOverrideListItem,
): DateOverrideListItem[] {
  const inputStartDate = parseISO(inputDateRange.startDate);
  const existingStartDate = parseISO(existingDateRange.startDate);

  if (inputStartDate > existingStartDate) {
    return [
      {
        startDate: existingDateRange.startDate,
        endDate: format(subDays(inputStartDate, 1), 'yyyy-MM-dd'),
        timeSlots: existingDateRange.timeSlots,
      },
      {
        startDate: inputDateRange.startDate,
        endDate: inputDateRange.endDate,
        timeSlots: inputDateRange.timeSlots,
      },
    ];
  }
  if (existingStartDate > inputStartDate) {
    return [
      { startDate: inputDateRange.startDate, endDate: inputDateRange.endDate, timeSlots: inputDateRange.timeSlots },
    ];
  }
  return [];
}

export function getPartialDateForInputEnddateCoincide(
  inputDateRange: DateOverrideListItem,
  existingDateRange: DateOverrideListItem,
): DateOverrideListItem[] {
  const inputEndDate = parseISO(inputDateRange.endDate);

  return [
    {
      startDate: inputDateRange.startDate,
      endDate: inputDateRange.endDate,
      timeSlots: inputDateRange.timeSlots,
    },
    {
      startDate: format(addDays(inputEndDate, 1), 'yyyy-MM-dd'),
      endDate: existingDateRange.endDate,
      timeSlots: existingDateRange.timeSlots,
    },
  ];
}

export function getPartialDateForExistingEnddateCoincide(
  inputDateRange: DateOverrideListItem,
  existingDateRange: DateOverrideListItem,
): DateOverrideListItem[] {
  const inputStartDate = parseISO(inputDateRange.startDate);
  return [
    {
      startDate: existingDateRange.startDate,
      endDate: format(subDays(inputStartDate, 1), 'yyyy-MM-dd'),
      timeSlots: existingDateRange.timeSlots,
    },
    {
      startDate: inputDateRange.startDate,
      endDate: inputDateRange.endDate,
      timeSlots: inputDateRange.timeSlots,
    },
  ];
}

export function getDividedDateOverrides(
  inputOverrides: DateOverrideListItem,
  existingOverride: DateOverrideListItem,
  overlapType: OverlapType,
): DateOverrideListItem[] {
  const buildDateRange = (start: string, end: string, timeSlots: Slot[]): DateOverrideListItem => ({
    startDate: start,
    endDate: end,
    timeSlots: timeSlots,
  });

  const subtractDays = (date: string, days: number): string => format(subDays(parseISO(date), days), 'yyyy-MM-dd');
  const addDaysToFormat = (date: string, days: number): string => format(addDays(parseISO(date), days), 'yyyy-MM-dd');

  const existingStartDate = existingOverride.startDate;
  const inputStartDate = inputOverrides.startDate;
  const inputEndDate = inputOverrides.endDate;
  const existingEndDate = existingOverride.endDate;

  if (overlapType.existingCoincidesFirst) {
    return [
      buildDateRange(existingStartDate, subtractDays(inputStartDate, 1), existingOverride.timeSlots),
      buildDateRange(inputStartDate, inputEndDate, inputOverrides.timeSlots),
    ];
  } else if (overlapType.inputCoincidesFirst) {
    return [
      buildDateRange(inputStartDate, inputEndDate, inputOverrides.timeSlots),
      buildDateRange(addDaysToFormat(inputEndDate, 1), existingEndDate, existingOverride.timeSlots),
    ];
  } else if (overlapType.existingContains) {
    return [
      buildDateRange(existingStartDate, subtractDays(inputStartDate, 1), existingOverride.timeSlots),
      buildDateRange(inputStartDate, inputEndDate, inputOverrides.timeSlots),
      buildDateRange(addDaysToFormat(inputEndDate, 1), existingEndDate, existingOverride.timeSlots),
    ];
  } else if (overlapType.inputContains) {
    return [buildDateRange(inputStartDate, inputEndDate, inputOverrides.timeSlots)];
  }
  return [];
}

export function buildDateRanges(selectedDays: Day[]): DateRange[] {
  const dateRanges: DateRange[] = [];

  selectedDays = selectedDays.slice().sort((a, b) => {
    const date1 = parseISO(a.dayMonthYearTitle).getTime();
    const date2 = parseISO(b.dayMonthYearTitle).getTime();
    return date1 - date2;
  });

  for (const day of selectedDays) {
    let isDateRangeFound: boolean = false;

    const date = parseISO(day.dayMonthYearTitle);

    for (const dateRange of dateRanges) {
      const startDate = parseISO(dateRange.startDate);
      const endDate = parseISO(dateRange.endDate);

      if (isDateWithinRange(date, startDate, endDate)) {
        isDateRangeFound = true;
        break;
      }
      if (isDateAdjacent(day.dayMonthYearTitle, endDate)) {
        isDateRangeFound = true;
        dateRange.endDate = format(addDays(endDate, 1), 'yyyy-MM-dd');
        break;
      }
    }
    if (!isDateRangeFound) {
      dateRanges.push({ startDate: day.dayMonthYearTitle, endDate: day.dayMonthYearTitle });
    }
  }

  return dateRanges;
}
export function isDateWithinRange(date: Date, startDate: Date, endDate: Date): boolean {
  return date >= startDate && date <= endDate;
}
export function isDateAdjacent(date: string, endDate: Date): boolean {
  return format(addDays(endDate, 1), 'yyyy-MM-dd') === date;
}

export function areDayRangesIdentical(
  inputOverride: DateOverrideListItem,
  existingOverride: DateOverrideListItem,
): boolean {
  return inputOverride.startDate === existingOverride.startDate && existingOverride.endDate === inputOverride.endDate;
}
