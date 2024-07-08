import { CalendarMode } from 'src/app/types/misc.type';
import {
  adjustDaysForCalendar,
  adjustEndDays,
  adjustStartDays,
  checkIfDayRangeIncludesSelectedDay,
  checkIfDaySelected,
  getTimeSlices,
  isDateWithinDateRange,
  isMonthWithinDateRange,
} from './calendar-util';
import { Day } from './../../types/calendar-day.type';
import { calendarPopulatedDays } from './../../types/calendar-day.type.mock';
import { format, parseISO } from 'date-fns';
import { Availibility } from 'src/app/types/vendor.types';

describe('Is Month Within Date Range Tests', () => {
  it('test if month falls within date range (start date and end falls within same month)', () => {
    const startDate = '2023-12-10';
    const endDate = '2023-12-25';

    const currentMonth = '2023-12-01';

    const result = isMonthWithinDateRange(startDate, endDate, currentMonth);

    expect(result).toStrictEqual(true);
  });

  it('test if month falls within date range (start date is within month and end date is in next month)', () => {
    const startDate = '2023-12-31';
    const endDate = '2024-01-25';

    const currentMonth = '2023-12-01';

    const result = isMonthWithinDateRange(startDate, endDate, currentMonth);

    expect(result).toStrictEqual(true);
  });

  it('test if month falls within date range (start date is in previous month and end date is also in previous month)', () => {
    const startDate = '2023-08-10';
    const endDate = '2023-11-01';

    const currentMonth = '2023-12-01';

    const result = isMonthWithinDateRange(startDate, endDate, currentMonth);

    expect(result).toStrictEqual(false);
  });

  it('test if month falls within date range (start date is in future month and end date is also in future month)', () => {
    const startDate = '2024-01-10';
    const endDate = '2024-01-31';

    const currentMonth = '2023-12-01';

    const result = isMonthWithinDateRange(startDate, endDate, currentMonth);

    expect(result).toStrictEqual(false);
  });

  it('test if month falls within date range (start date is in previous month and end date is in current month)', () => {
    const startDate = '2023-08-10';
    const endDate = '2023-12-02';

    const currentMonth = '2023-12-01';

    const result = isMonthWithinDateRange(startDate, endDate, currentMonth);

    expect(result).toStrictEqual(true);
  });

  it('test if month falls within date range (start date is greater than end date)', () => {
    const startDate = '2023-12-10';
    const endDate = '2023-12-01';

    const currentMonth = '2023-12-01';

    const result = isMonthWithinDateRange(startDate, endDate, currentMonth);

    expect(result).toStrictEqual(false);
  });
});

describe('Is Date Within Date Range Tests', () => {
  it('test if date falls within date range (current date is equal to start date)', () => {
    const startDate = '2023-12-10';
    const endDate = '2023-12-25';

    const currentDate = '2023-12-10';

    const result = isDateWithinDateRange(startDate, endDate, currentDate);

    expect(result).toStrictEqual(true);
  });

  it('test if date falls within date range (current date is within the range of start and end date)', () => {
    const startDate = '2023-12-10';
    const endDate = '2023-12-25';

    const currentDate = '2023-12-15';

    const result = isDateWithinDateRange(startDate, endDate, currentDate);

    expect(result).toStrictEqual(true);
  });
  it('test if date falls within date range (current date is less than start date)', () => {
    const startDate = '2023-12-10';
    const endDate = '2023-12-25';

    const currentDate = '2023-12-09';

    const result = isDateWithinDateRange(startDate, endDate, currentDate);

    expect(result).toStrictEqual(false);
  });

  it('test if date falls within date range (current date is greater than start date)', () => {
    const startDate = '2023-12-10';
    const endDate = '2023-12-25';

    const currentDate = '2023-12-26';

    const result = isDateWithinDateRange(startDate, endDate, currentDate);

    expect(result).toStrictEqual(false);
  });
});

describe('getTimeSlices Tests', () => {
  it('Get Time Slices from time range if duration fits neatly within the time range)', () => {
    const startTime = '09:00';
    const endTime = '10:00';
    const duration = 30;

    const result = getTimeSlices(startTime, endTime, duration);

    expect(result).toStrictEqual([
      { startTime: '09:00', endTime: '09:30' },
      { startTime: '09:30', endTime: '10:00' },
    ]);
  });

  it('Get Time Slices from time range, if duration creates a remainded in time range)', () => {
    const startTime = '09:00';
    const endTime = '10:00';
    const duration = 40;

    const result = getTimeSlices(startTime, endTime, duration);

    expect(result).toStrictEqual([{ startTime: '09:00', endTime: '09:40' }]);
  });

  it('Get Time Slices from time range, if no time slice is possible)', () => {
    const startTime = '09:00';
    const endTime = '10:00';
    const duration = 70;

    const result = getTimeSlices(startTime, endTime, duration);

    expect(result).toStrictEqual([]);
  });
});

describe('adjust days for calendar Tests', () => {
  it('adjustStartDays - add other month start days to the start of calendar', () => {
    const firstDate: Date = new Date('2023-12-01');
    const result = adjustStartDays(firstDate);

    const expectedDays: Day[] = [
      {
        number: 27,
        isToday: false,
        isSelected: false,
        isOtherMonth: true,
        isSelectable: true,
        isPast: true,
        dayMonthYearTitle: '2023-11-27',
        slotsArr: [],
      },
      {
        number: 28,
        isToday: false,
        isSelected: false,
        isOtherMonth: true,
        isSelectable: true,
        isPast: true,
        dayMonthYearTitle: '2023-11-28',
        slotsArr: [],
      },
      {
        number: 29,
        isToday: false,
        isSelected: false,
        isOtherMonth: true,
        isSelectable: true,
        isPast: true,
        dayMonthYearTitle: '2023-11-29',
        slotsArr: [],
      },
      {
        number: 30,
        isToday: false,
        isSelected: false,
        isOtherMonth: true,
        isSelectable: true,
        isPast: true,
        dayMonthYearTitle: '2023-11-30',
        slotsArr: [],
      },
    ];

    expect(result).toStrictEqual(expectedDays);
  });
  it('adjustEndDays - add other month start days to the end of calendar', () => {
    const lastDate: Date = new Date('2023-11-30');
    const result = adjustEndDays(lastDate);

    const expectedDays: Day[] = [
      {
        number: 1,
        isToday: false,
        isSelected: false,
        isOtherMonth: true,
        isSelectable: true,
        isPast: true,
        dayMonthYearTitle: '2023-12-01',
        slotsArr: [],
      },
      {
        number: 2,
        isToday: false,
        isSelected: false,
        isOtherMonth: true,
        isSelectable: true,
        isPast: true,
        dayMonthYearTitle: '2023-12-02',
        slotsArr: [],
      },
      {
        number: 3,
        isToday: false,
        isSelected: false,
        isOtherMonth: true,
        isSelectable: true,
        isPast: true,
        dayMonthYearTitle: '2023-12-03',
        slotsArr: [],
      },
    ];

    expect(result).toStrictEqual(expectedDays);
  });

  it('adjustDaysForCalendar - adjust calendar to add days to start and end (if required)', () => {
    const result = adjustDaysForCalendar(
      calendarPopulatedDays.filter(day => format(parseISO(day.dayMonthYearTitle), 'MMM') === 'Dec'),
    );

    expect(result).toStrictEqual(calendarPopulatedDays);
  });
});

describe('checkIfDaySelected Tests', () => {
  it('checkIfDaySelected - calendarMode=clientbooking', () => {
    const calendarMode: CalendarMode = 'clientbooking';
    const monthDay: Day = {
      number: 2,
      isToday: false,
      isSelected: true,
      isOtherMonth: false,
      isSelectable: true,
      isPast: false,
      dayMonthYearTitle: '2023-12-02',
      slotsArr: [],
    };
    const currentDay: Day = {
      number: 2,
      isToday: false,
      isSelected: true,
      isOtherMonth: false,
      isSelectable: true,
      isPast: false,
      dayMonthYearTitle: '2023-12-02',
      slotsArr: [],
    };
    const result = checkIfDaySelected(calendarMode, monthDay, currentDay);

    expect(result).toStrictEqual(true);
  });
  it('checkIfDaySelected - calendarMode=dateoverride, monthDay is same as current day', () => {
    const calendarMode: CalendarMode = 'dateoverride';
    const monthDay: Day = {
      number: 2,
      isToday: false,
      isSelected: true,
      isOtherMonth: false,
      isSelectable: true,
      isPast: false,
      dayMonthYearTitle: '2023-12-02',
      slotsArr: [],
    };
    const currentDay: Day = {
      number: 2,
      isToday: false,
      isSelected: true,
      isOtherMonth: false,
      isSelectable: true,
      isPast: false,
      dayMonthYearTitle: '2023-12-02',
      slotsArr: [],
    };
    const result = checkIfDaySelected(calendarMode, monthDay, currentDay);

    expect(result).toStrictEqual(false);
  });
  it('checkIfDaySelected - calendarMode=dateoverride, monthDay is different from current day', () => {
    const calendarMode: CalendarMode = 'dateoverride';
    const monthDay: Day = {
      number: 1,
      isToday: false,
      isSelected: true,
      isOtherMonth: false,
      isSelectable: true,
      isPast: false,
      dayMonthYearTitle: '2023-12-01',
      slotsArr: [],
    };
    const currentDay: Day = {
      number: 2,
      isToday: false,
      isSelected: true,
      isOtherMonth: false,
      isSelectable: true,
      isPast: false,
      dayMonthYearTitle: '2023-12-02',
      slotsArr: [],
    };
    const result = checkIfDaySelected(calendarMode, monthDay, currentDay);

    expect(result).toStrictEqual(true);
  });
});

describe('checkIfDayRangeIncludesSelectedDay', () => {
  it('should return true when selectedDay is within the range', () => {
    const day: Availibility = {
      id: 1,
      day: 'monday',
      type: 'override',
      slot: [{ from: '09:00', to: '09:30' }],
      startDate: '2023-12-01',
      endDate: '2023-12-05',
    };

    const selectedDay: Day = {
      number: 3,
      isToday: false,
      isSelected: false,
      isOtherMonth: false,
      isSelectable: true,
      isPast: false,
      dayMonthYearTitle: '2023-12-03',
    };

    const result = checkIfDayRangeIncludesSelectedDay(day, selectedDay);

    expect(result).toBe(true);
  });

  it('should return false when selectedDay is outside the range', () => {
    const day: Availibility = {
      id: 1,
      day: 'monday',
      type: 'override',
      slot: [{ from: '09:00', to: '09:30' }],
      startDate: '2023-12-01',
      endDate: '2023-12-05',
    };

    const selectedDay: Day = {
      number: 10,
      isToday: false,
      isSelected: false,
      isOtherMonth: false,
      isSelectable: true,
      isPast: false,
      dayMonthYearTitle: '2023-12-10',
    };

    const result = checkIfDayRangeIncludesSelectedDay(day, selectedDay);

    expect(result).toBe(false);
  });

  it('should return false when selectedDay is null', () => {
    const day: Availibility = {
      id: 1,
      day: 'monday',
      type: 'override',
      slot: [{ from: '09:00', to: '09:30' }],
      startDate: '2023-12-01',
      endDate: '2023-12-05',
    };

    const result = checkIfDayRangeIncludesSelectedDay(day, null);

    expect(result).toBe(false);
  });
});
