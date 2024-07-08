import {
  addDays,
  addMinutes,
  addMonths,
  differenceInDays,
  differenceInMinutes,
  eachDayOfInterval,
  format,
  getDaysInMonth,
  isMonday,
  isSunday,
  nextSunday,
  parseISO,
  previousMonday,
} from 'date-fns';
import { Slot } from './../../types/calendar-day.type';
import { Availability } from './../../types/availability';
import { CalendarMode } from './../../types/misc.type';
import { BookingTemplateDetail } from './../../types/booking.type';
import { Day } from './../../types/calendar-day.type';
import { dayFactory } from './util';
import { Availibility } from 'src/app/types/vendor.types';

export function getInitialCurrentMonth() {
  const date = new Date();
  date.setDate(1);

  return date.toJSON();
}

export function getDaysForCalendar(
  month: string,
  selectedDay: Day | null,
  bookingTemplateDetail: BookingTemplateDetail,
): Day[] {
  const daysArr: Day[] = [];

  const daysInMonth = getDaysInMonth(parseISO(month));

  for (let index = 0; index < daysInMonth; index++) {
    const dayString: string = format(addDays(parseISO(month), index), 'yyyy-MM-dd');
    const slots: Slot[] = [];
    const day: Day = dayFactory([{ dayTitle: dayString, slotsArr: slots }], dayString);

    day.isSelectable = isDayAvailable(dayString, bookingTemplateDetail.availabilities);

    if (selectedDay) {
      day.isSelected = day.dayMonthYearTitle === selectedDay?.dayMonthYearTitle;
    }

    daysArr.push(day);
  }

  return adjustDaysForCalendar(daysArr);
}
export function getDaysForOverrides(month: string, selectedDays: Day[] | null) {
  const daysArr: Day[] = [];
  const daysInMonth = getDaysInMonth(parseISO(month));

  for (let index = 0; index < daysInMonth; index++) {
    const dayString: string = format(addDays(parseISO(month), index), 'yyyy-MM-dd');

    const day: Day = dayFactory([{ dayTitle: dayString, slotsArr: [] }], dayString);
    if (selectedDays && selectedDays.length > 0) {
      day.isSelected = selectedDays.find(d => d.dayMonthYearTitle === day.dayMonthYearTitle) !== undefined;
    }
    daysArr.push(day);
  }

  return adjustDaysForCalendar(daysArr);
}

export function adjustDaysForCalendar(days: Day[]): Day[] {
  const firstDay: Date = parseISO(days[0].dayMonthYearTitle);
  const lastDay: Date = parseISO(days[days.length - 1].dayMonthYearTitle);

  days.unshift(...adjustStartDays(firstDay));
  days.push(...adjustEndDays(lastDay));

  return days;
}

export function adjustStartDays(firstDay: Date): Day[] {
  const daysArr: Day[] = [];

  if (!isMonday(firstDay)) {
    const numberOfDays = differenceInDays(firstDay, previousMonday(firstDay));
    for (let index = 0; index < numberOfDays; index++) {
      const dayString: string = format(addDays(firstDay, -(index + 1)), 'yyyy-MM-dd');
      daysArr.unshift(dayFactory([{ dayTitle: dayString, slotsArr: [] }], dayString, true));
    }
  }
  return daysArr;
}
export function adjustEndDays(lastDay: Date): Day[] {
  const daysArr: Day[] = [];

  if (!isSunday(lastDay)) {
    const noOfDays = differenceInDays(nextSunday(lastDay), lastDay);

    for (let index = 0; index < noOfDays; index++) {
      const dayString: string = format(addDays(lastDay, index + 1), 'yyyy-MM-dd');
      daysArr.push(dayFactory([{ dayTitle: dayString, slotsArr: [] }], dayString, true));
    }
  }
  return daysArr;
}

export function isDayAvailable(currentDate: string, availability: Availability[]): boolean {
  const dayName = format(parseISO(currentDate), 'EEEE').toLowerCase();

  const dateOverride = availability?.find(
    x =>
      x.type === 'override' &&
      x.startDate &&
      x.endDate &&
      isDateWithinDateRange(x.startDate, x.endDate, currentDate) &&
      x.isAvailable,
  );

  if (dateOverride) {
    return true;
  }

  const dayAvailability = availability?.find(x => x.type === 'default' && x.day === dayName && x.isAvailable);
  if (dayAvailability) {
    return true;
  }

  return false;
}

export function isMonthWithinDateRange(startDate: string, endDate: string, currentMonth: string): boolean {
  const startDateFns = parseISO(startDate);
  const endDateFns = parseISO(endDate);
  const currentMonthFns = parseISO(currentMonth);
  const nextMonthFns = addMonths(currentMonthFns, 1);

  if (startDateFns > endDateFns) {
    return false;
  }

  if (startDateFns <= currentMonthFns && endDateFns >= currentMonthFns) {
    return true;
  }

  if (startDateFns >= currentMonthFns && startDateFns < nextMonthFns) {
    return true;
  }

  return false;
}

export function isDateWithinDateRange(startDate: string, endDate: string, currentDate: string): boolean {
  const startDateFns = parseISO(startDate);
  const endDateFns = parseISO(endDate);
  const currentDateFns = parseISO(currentDate);

  if (startDateFns > endDateFns) {
    return false;
  }

  if (startDateFns <= currentDateFns && endDateFns >= currentDateFns) {
    return true;
  }

  return false;
}
export function getTimeSlices(from: string, to: string, duration: number): Slot[] {
  const startDate = parseISO(`${format(new Date(), 'yyyy-MM-dd')} ${from}`);

  const endDate = parseISO(`${format(new Date(), 'yyyy-MM-dd')} ${to}`);

  const minutesDuration = differenceInMinutes(endDate, startDate);

  const numberOfSlices = Math.floor(minutesDuration / duration);

  if (numberOfSlices === 0) {
    return [];
  }

  const slicesArr: Slot[] = [];
  for (let i = 0; i < numberOfSlices; i++) {
    slicesArr.push({
      startTime: format(addMinutes(startDate, duration * i), 'HH:mm'),
      endTime: format(addMinutes(startDate, duration * i + duration), 'HH:mm'),
    });
  }
  return slicesArr;
}
export function checkIfDaySelected(mode: CalendarMode, monthDay: Day, currentDay: Day | null): boolean {
  let isSelected: boolean = false;
  if (mode === 'clientbooking') {
    isSelected = currentDay?.dayMonthYearTitle === monthDay.dayMonthYearTitle;
  } else {
    if (currentDay?.dayMonthYearTitle === monthDay.dayMonthYearTitle) {
      isSelected = !monthDay.isSelected;
    } else {
      isSelected = monthDay.isSelected;
    }
  }
  return isSelected;
}

export function selectCalendarDay(days: Day[], selectedDay: Day): Day[] {
  //select or unselect a day when calendar is set to allow multiple days selection
  const dayAlreadySelected: Day | undefined = days.find(d => d.number === selectedDay.number);

  if (dayAlreadySelected) {
    //if day was already selected, then unselect it
    return days.filter(d => d.number !== selectedDay.number);
  } else {
    days.push(selectedDay);
    return days;
  }
}

export function checkIfDayRangeIncludesSelectedDay(day: Availibility, selectedDay: Day | null): boolean {
  const startDateDate = new Date(day.startDate as string);
  const endDateDate = new Date(day.endDate as string);

  const dateArray = eachDayOfInterval({ start: startDateDate, end: endDateDate });
  const formattedDateArray = dateArray.map(date => format(date, 'yyyy-MM-dd'));

  const selectedDayTitle = selectedDay?.dayMonthYearTitle as string;
  return formattedDateArray.includes(selectedDayTitle);
}
