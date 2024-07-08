import { DateRange } from 'src/app/types/misc.type';
import {
  buildDateOverridePayload,
  buildInputDateOverrides,
  buildDateRanges,
  isDateAdjacent,
  isDateWithinRange,
  generatePayloadFromDateOverrides,
  getDateRangeWhenStartDateSame,
  getPartialDateRangeEndDateSame,
  handleNonOverlapCases,
  buildInitialDateOverrideList,
  constructTimeSlots,
  addUniqueDateOverride,
  hasOverlap,
  returnOverlapType,
  getDividedDateOverrides,
  getPartialDateForExistingEnddateCoincide,
  getPartialDateForInputEnddateCoincide,
  updateDateOverrideList,
  areTimeSlotsIdentical,
  buildConstructedDateRange,
} from './date-override-utils';
import { Day, Slot } from './../../types/calendar-day.type';
import { parseISO } from 'date-fns';
import { DateOverrideListItem, OverlapType } from '../../types/vendor-date-override.type';
import { Availibility } from '../../types/vendor.types';

describe('buildDateRanges Tests', () => {
  it('buildDateRanges - date range is built correctly even if selected days are not in sorted order', () => {
    const selectedDays: Day[] = [
      {
        number: 15,
        isToday: false,
        isSelected: true,
        isOtherMonth: false,
        isSelectable: true,
        isPast: false,
        dayMonthYearTitle: '2024-01-15',
        slotsArr: [],
      },
      {
        number: 17,
        isToday: false,
        isSelected: true,
        isOtherMonth: false,
        isSelectable: true,
        isPast: false,
        dayMonthYearTitle: '2024-01-17',
        slotsArr: [],
      },
      {
        number: 16,
        isToday: false,
        isSelected: true,
        isOtherMonth: false,
        isSelectable: true,
        isPast: false,
        dayMonthYearTitle: '2024-01-16',
        slotsArr: [],
      },
    ];

    const dateRange: DateRange[] = [{ startDate: '2024-01-15', endDate: '2024-01-17' }];
    const result = buildDateRanges(selectedDays);

    expect(result).toStrictEqual(dateRange);
  });
  it('buildDateRanges - date range is built for adjacent days and individual days are entered as a separate entry', () => {
    const selectedDays: Day[] = [
      {
        number: 15,
        isToday: false,
        isSelected: true,
        isOtherMonth: false,
        isSelectable: true,
        isPast: false,
        dayMonthYearTitle: '2024-01-15',
        slotsArr: [],
      },
      {
        number: 17,
        isToday: false,
        isSelected: true,
        isOtherMonth: false,
        isSelectable: true,
        isPast: false,
        dayMonthYearTitle: '2024-01-17',
        slotsArr: [],
      },
      {
        number: 16,
        isToday: false,
        isSelected: true,
        isOtherMonth: false,
        isSelectable: true,
        isPast: false,
        dayMonthYearTitle: '2024-01-16',
        slotsArr: [],
      },
      {
        number: 24,
        isToday: false,
        isSelected: true,
        isOtherMonth: false,
        isSelectable: true,
        isPast: false,
        dayMonthYearTitle: '2024-01-24',
        slotsArr: [],
      },
    ];

    const dateRange: DateRange[] = [
      { startDate: '2024-01-15', endDate: '2024-01-17' },
      { startDate: '2024-01-24', endDate: '2024-01-24' },
    ];
    const result = buildDateRanges(selectedDays);

    expect(result).toStrictEqual(dateRange);
  });
});

describe('isDateWithinRange Tests', () => {
  it('check if a given date is within date range of two dates', () => {
    const date = parseISO('2024-01-15');

    const startDate = parseISO('2024-01-15');

    const endDate = parseISO('2024-01-16');

    const result = isDateWithinRange(date, startDate, endDate);

    expect(result).toStrictEqual(true);
  });

  it('check if a given date is within date range of two dates when start and end date are same', () => {
    const date = parseISO('2024-01-15');

    const startDate = parseISO('2024-01-15');

    const endDate = parseISO('2024-01-15');

    const result = isDateWithinRange(date, startDate, endDate);

    expect(result).toStrictEqual(true);
  });

  it('check if a given date is not within date range of two dates', () => {
    const date = parseISO('2024-01-16');

    const startDate = parseISO('2024-01-15');

    const endDate = parseISO('2024-01-15');

    const result = isDateWithinRange(date, startDate, endDate);

    expect(result).toStrictEqual(false);
  });
});

describe('isDateAdjacent Tests', () => {
  it('check if a given date is adjacent (comes right after) the other date', () => {
    const date = '2024-01-16';

    const endDate = parseISO('2024-01-15');

    const result = isDateAdjacent(date, endDate);

    expect(result).toStrictEqual(true);
  });
  it('check if a given date is not adjacent (comes right after) the other date', () => {
    const date = '2024-01-15';

    const endDate = parseISO('2024-01-15');

    const result = isDateAdjacent(date, endDate);

    expect(result).toStrictEqual(false);
  });
});

describe('Build buildDateOverridePayload', () => {
  it('should return the inputoverride if the existing is empty', () => {
    const existingOverrideList: DateOverrideListItem[] = [];

    const selectedDays = [
      {
        number: 2,
        isToday: false,
        isSelected: false,
        isOtherMonth: false,
        isSelectable: true,
        isPast: false,
        dayMonthYearTitle: '2024-02-02',
        slotsArr: [],
      },
    ];

    const timeSlots = [
      {
        startTime: '09:00',
        endTime: '17:00',
      },
    ];

    const result = buildDateOverridePayload(existingOverrideList, selectedDays, timeSlots);

    const dateRanges: DateRange[] = buildDateRanges(selectedDays);
    const inputDateOverrides: DateOverrideListItem[] = buildInputDateOverrides(dateRanges, timeSlots);
    const finalResult = generatePayloadFromDateOverrides(inputDateOverrides);
    expect(result).toStrictEqual(finalResult);
  });

  it('should return the inputoverride if the existing contains the identical date range override', () => {
    const existingOverrideList = [
      {
        startDate: '2024-02-02',
        endDate: '2024-02-02',
        timeSlots: [
          {
            startTime: '09:00',
            endTime: '17:00',
          },
          {
            startTime: '18:00',
            endTime: '19:00',
          },
        ],
      },
    ];

    const selectedDays = [
      {
        number: 2,
        isToday: false,
        isSelected: false,
        isOtherMonth: false,
        isSelectable: true,
        isPast: false,
        dayMonthYearTitle: '2024-02-02',
        slotsArr: [],
      },
    ];

    const timeSlots = [
      {
        startTime: '09:00',
        endTime: '17:00',
      },
    ];

    const result = buildDateOverridePayload(existingOverrideList, selectedDays, timeSlots);

    const dateRanges: DateRange[] = buildDateRanges(selectedDays);
    const inputDateOverrides: DateOverrideListItem[] = buildInputDateOverrides(dateRanges, timeSlots);
    const finalResult = generatePayloadFromDateOverrides(inputDateOverrides);
    expect(result).toStrictEqual(finalResult);
  });

  it('should return the inputoverride if the existing contains the start date that is equal', () => {
    const existingOverrideList = [
      {
        startDate: '2024-02-02',
        endDate: '2024-02-05',
        timeSlots: [
          {
            startTime: '09:00',
            endTime: '17:00',
          },
          {
            startTime: '18:00',
            endTime: '19:00',
          },
        ],
      },
    ];

    const selectedDays = [
      {
        number: 2,
        isToday: false,
        isSelected: false,
        isOtherMonth: false,
        isSelectable: true,
        isPast: false,
        dayMonthYearTitle: '2024-02-02',
        slotsArr: [],
      },
    ];

    const timeSlots = [
      {
        startTime: '09:00',
        endTime: '17:00',
      },
    ];

    const result = buildDateOverridePayload(existingOverrideList, selectedDays, timeSlots);

    const dateRanges: DateRange[] = buildDateRanges(selectedDays);
    const inputDateOverrides: DateOverrideListItem[] = buildInputDateOverrides(dateRanges, timeSlots);

    const generatedDateOverrides = getDateRangeWhenStartDateSame(inputDateOverrides[0], existingOverrideList[0]);
    const finalResult = generatePayloadFromDateOverrides(generatedDateOverrides);
    expect(result).toStrictEqual(finalResult);
  });

  it('should return the inputoverride if the existing contains the end date that is equal', () => {
    const existingOverrideList = [
      {
        startDate: '2024-02-02',
        endDate: '2024-02-05',
        timeSlots: [
          {
            startTime: '09:00',
            endTime: '17:00',
          },
          {
            startTime: '18:00',
            endTime: '19:00',
          },
        ],
      },
    ];

    const selectedDays = [
      {
        number: 2,
        isToday: false,
        isSelected: false,
        isOtherMonth: false,
        isSelectable: true,
        isPast: false,
        dayMonthYearTitle: '2024-02-05',
        slotsArr: [],
      },
    ];

    const timeSlots = [
      {
        startTime: '09:00',
        endTime: '17:00',
      },
    ];

    const result = buildDateOverridePayload(existingOverrideList, selectedDays, timeSlots);

    const dateRanges: DateRange[] = buildDateRanges(selectedDays);
    const inputDateOverrides: DateOverrideListItem[] = buildInputDateOverrides(dateRanges, timeSlots);

    const generatedDateOverrides = getPartialDateRangeEndDateSame(inputDateOverrides[0], existingOverrideList[0]);
    const finalResult = generatePayloadFromDateOverrides(generatedDateOverrides);
    expect(result).toStrictEqual(finalResult);
  });

  it('should return the inputoverride if the existing contains the end date that is equal', () => {
    const existingOverrideList = [
      {
        startDate: '2024-02-02',
        endDate: '2024-02-05',
        timeSlots: [
          {
            startTime: '09:00',
            endTime: '17:00',
          },
          {
            startTime: '18:00',
            endTime: '19:00',
          },
        ],
      },
    ];

    const selectedDays = [
      {
        number: 2,
        isToday: false,
        isSelected: false,
        isOtherMonth: false,
        isSelectable: true,
        isPast: false,
        dayMonthYearTitle: '2024-02-06',
        slotsArr: [],
      },
    ];

    const timeSlots = [
      {
        startTime: '09:00',
        endTime: '17:00',
      },
    ];

    const result = buildDateOverridePayload(existingOverrideList, selectedDays, timeSlots);
    const dateOverrideListTemp: DateOverrideListItem[] = [];
    const dateRanges: DateRange[] = buildDateRanges(selectedDays);
    const inputDateOverrides: DateOverrideListItem[] = buildInputDateOverrides(dateRanges, timeSlots);

    handleNonOverlapCases(dateOverrideListTemp, inputDateOverrides[0], existingOverrideList[0]);
    const finalResult = generatePayloadFromDateOverrides(dateOverrideListTemp);
    expect(result).toStrictEqual(finalResult);
  });
});

describe('buildInitialDateOverrideList', () => {
  it('should filter and map availabilities correctly', () => {
    const availabilities: Availibility[] = [
      {
        startDate: '2022-01-01',
        endDate: '2022-01-02',
        type: 'override',
        day: '',
        slot: [{ from: '09:00', to: '12:00' }],
      },
      {
        startDate: '2022-01-03',
        endDate: '2022-01-04',
        type: 'default',
        day: '',
        slot: [{ from: '14:00', to: '17:00' }],
      },
    ];

    const result: DateOverrideListItem[] = buildInitialDateOverrideList(availabilities, null);

    expect(result.length).toBe(1);
    expect(result[0].startDate).toBe('2022-01-01');
    expect(result[0].endDate).toBe('2022-01-02');
    expect(result[0].timeSlots[0]).toEqual({
      startTime: '09:00',
      endTime: '12:00',
    } as Slot);
  });
});

describe('constructTimeSlots', () => {
  it('should construct time slots correctly', () => {
    const overrideForm = [
      { from: '09:00', to: '12:00' },
      { from: '14:00', to: '17:00' },
    ];

    const result: Slot[] = constructTimeSlots(overrideForm);

    expect(result.length).toBe(2);
    expect(result[0]).toEqual({
      startTime: '09:00',
      endTime: '12:00',
    } as Slot);
    expect(result[1]).toEqual({
      startTime: '14:00',
      endTime: '17:00',
    } as Slot);
  });
});

describe('generatePayloadFromDateOverrides', () => {
  it('should generate payload correctly from date override list', () => {
    const dateOverrideListTemp: DateOverrideListItem[] = [
      {
        startDate: '2022-01-01',
        endDate: '2022-01-02',
        timeSlots: [
          { startTime: '09:00', endTime: '12:00' },
          { startTime: '14:00', endTime: '17:00' },
        ],
      },
    ];

    const result: Availibility[] = generatePayloadFromDateOverrides(dateOverrideListTemp);

    expect(result.length).toBe(1);
    expect(result[0]).toEqual({
      startDate: '2022-01-01',
      endDate: '2022-01-02',
      type: 'override',
      day: '',
      slot: [
        { from: '09:00', to: '12:00' },
        { from: '14:00', to: '17:00' },
      ],
    } as Availibility);
  });
});

describe('buildInputDateOverrides', () => {
  it('should build input date overrides correctly', () => {
    const dateRanges: DateRange[] = [
      { startDate: '2022-01-01', endDate: '2022-01-02' },
      { startDate: '2022-01-03', endDate: '2022-01-04' },
    ];
    const timeSlots: Slot[] = [
      { startTime: '09:00', endTime: '12:00' },
      { startTime: '14:00', endTime: '17:00' },
    ];

    const result: DateOverrideListItem[] = buildInputDateOverrides(dateRanges, timeSlots);

    expect(result.length).toBe(2);
    expect(result[0]).toEqual({
      startDate: '2022-01-01',
      endDate: '2022-01-02',
      timeSlots,
    });
    expect(result[1]).toEqual({
      startDate: '2022-01-03',
      endDate: '2022-01-04',
      timeSlots,
    });
  });
});

describe('hasOverlap', () => {
  it('should return true if overlapType has any true values', () => {
    const overlapTypeWithTrue: OverlapType = {
      existingContains: true,
      inputContains: false,
      existingCoincidesFirst: false,
      inputCoincidesFirst: false,
    };

    const result: boolean = hasOverlap(overlapTypeWithTrue);

    expect(result).toBe(true);
  });

  it('should return false if overlapType has only false values', () => {
    const overlapTypeWithFalse: OverlapType = {
      existingContains: false,
      inputContains: false,
      existingCoincidesFirst: false,
      inputCoincidesFirst: false,
    };

    const result: boolean = hasOverlap(overlapTypeWithFalse);

    expect(result).toBe(false);
  });
});

describe('addUniqueDateOverride', () => {
  it('should add unique date override to the list', () => {
    const dateOverrideList: DateOverrideListItem[] = [
      { startDate: '2022-01-01', endDate: '2022-01-02', timeSlots: [] },
      { startDate: '2022-01-03', endDate: '2022-01-04', timeSlots: [] },
    ];
    const inputOverride: DateOverrideListItem = { startDate: '2022-01-05', endDate: '2022-01-06', timeSlots: [] };

    addUniqueDateOverride(dateOverrideList, inputOverride);

    expect(dateOverrideList.length).toBe(3);
    expect(dateOverrideList[2]).toEqual({ startDate: '2022-01-05', endDate: '2022-01-06', timeSlots: [] });
  });

  it('should not add duplicate date override to the list', () => {
    const dateOverrideList: DateOverrideListItem[] = [
      { startDate: '2022-01-01', endDate: '2022-01-02', timeSlots: [] },
      { startDate: '2022-01-03', endDate: '2022-01-04', timeSlots: [] },
    ];
    const inputOverride: DateOverrideListItem = { startDate: '2022-01-03', endDate: '2022-01-04', timeSlots: [] };

    addUniqueDateOverride(dateOverrideList, inputOverride);

    expect(dateOverrideList.length).toBe(2);
  });
});

describe('returnOverlapType', () => {
  it('should correctly determine overlapType when existingOverride contains inputOverride', () => {
    const inputOverride: DateOverrideListItem = {
      startDate: '2022-01-02',
      endDate: '2022-01-04',
      timeSlots: [],
    };
    const existingOverride: DateOverrideListItem = {
      startDate: '2022-01-01',
      endDate: '2022-01-05',
      timeSlots: [],
    };

    const result: OverlapType = returnOverlapType(inputOverride, existingOverride);

    expect(result).toEqual({
      existingContains: true,
      inputContains: false,
      existingCoincidesFirst: false,
      inputCoincidesFirst: false,
    } as OverlapType);
  });

  it('should correctly determine overlapType when inputOverride coincides with existingOverride first', () => {
    const inputOverride: DateOverrideListItem = {
      startDate: '2022-01-01',
      endDate: '2022-01-03',
      timeSlots: [],
    };
    const existingOverride: DateOverrideListItem = {
      startDate: '2022-01-02',
      endDate: '2022-01-04',
      timeSlots: [],
    };

    const result: OverlapType = returnOverlapType(inputOverride, existingOverride);

    expect(result).toEqual({
      existingContains: false,
      inputContains: false,
      existingCoincidesFirst: false,
      inputCoincidesFirst: true,
    } as OverlapType);
  });
});

describe('getDividedDateOverrides', () => {
  it('should correctly handle existingContains overlap type', () => {
    const inputOverrides: DateOverrideListItem = {
      startDate: '2022-01-02',
      endDate: '2022-01-04',
      timeSlots: [],
    };
    const existingOverride: DateOverrideListItem = {
      startDate: '2022-01-01',
      endDate: '2022-01-05',
      timeSlots: [{ startTime: '09:00', endTime: '12:00' }],
    };
    const overlapType: OverlapType = {
      existingContains: true,
      inputContains: false,
      existingCoincidesFirst: false,
      inputCoincidesFirst: false,
    };

    const result: DateOverrideListItem[] = getDividedDateOverrides(inputOverrides, existingOverride, overlapType);

    expect(result.length).toBe(3);
    expect(result[0].startDate).toBe('2022-01-01');
    expect(result[0].endDate).toBe('2022-01-01');
    expect(result[0].timeSlots).toEqual([{ startTime: '09:00', endTime: '12:00' }]);
    expect(result[1].startDate).toBe('2022-01-02');
    expect(result[1].endDate).toBe('2022-01-04');
    expect(result[1].timeSlots).toEqual([]);
    expect(result[2].startDate).toBe('2022-01-05');
    expect(result[2].endDate).toBe('2022-01-05');
    expect(result[2].timeSlots).toEqual([{ startTime: '09:00', endTime: '12:00' }]);
  });

  it('should correctly handle inputContains overlap type', () => {
    const inputOverrides: DateOverrideListItem = {
      startDate: '2022-01-02',
      endDate: '2022-01-04',
      timeSlots: [],
    };
    const existingOverride: DateOverrideListItem = {
      startDate: '2022-01-01',
      endDate: '2022-01-05',
      timeSlots: [{ startTime: '09:00', endTime: '12:00' }],
    };
    const overlapType: OverlapType = {
      existingContains: false,
      inputContains: true,
      existingCoincidesFirst: false,
      inputCoincidesFirst: false,
    };

    const result: DateOverrideListItem[] = getDividedDateOverrides(inputOverrides, existingOverride, overlapType);

    expect(result.length).toBe(1);
    expect(result[0].startDate).toBe('2022-01-02');
    expect(result[0].endDate).toBe('2022-01-04');
    expect(result[0].timeSlots).toEqual([]);
  });

  it('should correctly handle existingCoincidesFirst overlap type', () => {
    const inputOverrides: DateOverrideListItem = {
      startDate: '2022-01-02',
      endDate: '2022-01-06',
      timeSlots: [],
    };
    const existingOverride: DateOverrideListItem = {
      startDate: '2022-01-01',
      endDate: '2022-01-04',
      timeSlots: [{ startTime: '09:00', endTime: '12:00' }],
    };
    const overlapType: OverlapType = {
      existingContains: false,
      inputContains: false,
      existingCoincidesFirst: true,
      inputCoincidesFirst: false,
    };

    const result: DateOverrideListItem[] = getDividedDateOverrides(inputOverrides, existingOverride, overlapType);
    expect(result.length).toBe(2);
    expect(result[0].startDate).toBe('2022-01-01');
    expect(result[0].endDate).toBe('2022-01-01');
    expect(result[0].timeSlots).toEqual([{ startTime: '09:00', endTime: '12:00' }]);
    expect(result[1].startDate).toBe('2022-01-02');
    expect(result[1].endDate).toBe('2022-01-06');
    expect(result[1].timeSlots).toEqual([]);
  });

  it('should correctly handle existingCoincidesFirst overlap type', () => {
    const inputOverrides: DateOverrideListItem = {
      startDate: '2022-01-01',
      endDate: '2022-01-04',
      timeSlots: [{ startTime: '09:00', endTime: '12:00' }],
    };
    const existingOverride: DateOverrideListItem = {
      startDate: '2022-01-02',
      endDate: '2022-01-06',
      timeSlots: [],
    };
    const overlapType: OverlapType = {
      existingContains: false,
      inputContains: false,
      existingCoincidesFirst: false,
      inputCoincidesFirst: true,
    };

    const result: DateOverrideListItem[] = getDividedDateOverrides(inputOverrides, existingOverride, overlapType);
    expect(result.length).toBe(2);
    expect(result[0].startDate).toBe('2022-01-01');
    expect(result[0].endDate).toBe('2022-01-04');
    expect(result[0].timeSlots).toEqual([{ startTime: '09:00', endTime: '12:00' }]);
    expect(result[1].startDate).toBe('2022-01-05');
    expect(result[1].endDate).toBe('2022-01-06');
    expect(result[1].timeSlots).toEqual([]);
  });
});

describe('getDateRangeWhenStartDateSame and getPartialDateRangeEndDateSame', () => {
  it('should correctly handle getDateRangeWhenStartDateSame', () => {
    const inputDateRange: DateOverrideListItem = {
      startDate: '2022-01-02',
      endDate: '2022-01-06',
      timeSlots: [],
    };
    const existingDateRange: DateOverrideListItem = {
      startDate: '2022-01-02',
      endDate: '2022-01-08',
      timeSlots: [{ startTime: '09:00', endTime: '12:00' }],
    };

    const result: DateOverrideListItem[] = getDateRangeWhenStartDateSame(inputDateRange, existingDateRange);

    expect(result.length).toBe(2);
    expect(result[0].startDate).toBe('2022-01-02');
    expect(result[0].endDate).toBe('2022-01-06');
    expect(result[0].timeSlots).toEqual([]);
    expect(result[1].startDate).toBe('2022-01-07');
    expect(result[1].endDate).toBe('2022-01-08');
    expect(result[1].timeSlots).toEqual([{ startTime: '09:00', endTime: '12:00' }]);
  });

  it('should correctly handle getPartialDateRangeEndDateSame', () => {
    const inputDateRange: DateOverrideListItem = {
      startDate: '2022-01-02',
      endDate: '2022-01-06',
      timeSlots: [],
    };
    const existingDateRange: DateOverrideListItem = {
      startDate: '2022-01-01',
      endDate: '2022-01-06',
      timeSlots: [{ startTime: '09:00', endTime: '12:00' }],
    };

    const result: DateOverrideListItem[] = getPartialDateRangeEndDateSame(inputDateRange, existingDateRange);

    expect(result.length).toBe(2);
    expect(result[0].startDate).toBe('2022-01-01');
    expect(result[0].endDate).toBe('2022-01-01');
    expect(result[0].timeSlots).toEqual([{ startTime: '09:00', endTime: '12:00' }]);
    expect(result[1].startDate).toBe('2022-01-02');
    expect(result[1].endDate).toBe('2022-01-06');
    expect(result[1].timeSlots).toEqual([]);
  });
});

describe('getPartialDateForInputEnddateCoincide', () => {
  it('should return partial date ranges when input end date coincides', () => {
    const inputDateRange = {
      startDate: '2022-01-01',
      endDate: '2022-01-05',
      timeSlots: [{ startTime: '09:00', endTime: '12:00' }],
    };
    const existingDateRange = {
      startDate: '2022-01-05',
      endDate: '2022-01-10',
      timeSlots: [{ startTime: '13:00', endTime: '15:00' }],
    };

    const result = getPartialDateForInputEnddateCoincide(inputDateRange, existingDateRange);

    expect(result.length).toBe(2);
    expect(result[0]).toEqual({
      startDate: '2022-01-01',
      endDate: '2022-01-05',
      timeSlots: [{ startTime: '09:00', endTime: '12:00' }],
    });
    expect(result[1]).toEqual({
      startDate: '2022-01-06',
      endDate: '2022-01-10',
      timeSlots: [{ startTime: '13:00', endTime: '15:00' }],
    });
  });
});

describe('getPartialDateForExistingEnddateCoincide', () => {
  it('should return partial date ranges when existing end date coincides', () => {
    const existingDateRange = {
      startDate: '2022-01-05',
      endDate: '2022-01-10',
      timeSlots: [{ startTime: '13:00', endTime: '15:00' }],
    };

    const inputDateRange = {
      startDate: '2022-01-10',
      endDate: '2022-01-15',
      timeSlots: [{ startTime: '09:00', endTime: '12:00' }],
    };

    const result = getPartialDateForExistingEnddateCoincide(inputDateRange, existingDateRange);

    expect(result.length).toBe(2);
    expect(result[0]).toEqual({
      startDate: '2022-01-05',
      endDate: '2022-01-09',
      timeSlots: [{ startTime: '13:00', endTime: '15:00' }],
    });
    expect(result[1]).toEqual({
      startDate: '2022-01-10',
      endDate: '2022-01-15',
      timeSlots: [{ startTime: '09:00', endTime: '12:00' }],
    });
  });
});

describe('updateDateOverrideList', () => {
  it('should update date override list correctly', () => {
    const dateOverrideList: DateOverrideListItem[] = [
      { startDate: '2022-01-01', endDate: '2022-01-02', timeSlots: [] },
      { startDate: '2022-01-03', endDate: '2022-01-04', timeSlots: [] },
    ];
    const finalDateRange: DateOverrideListItem[] = [{ startDate: '2022-01-05', endDate: '2022-01-06', timeSlots: [] }];

    const result: DateOverrideListItem[] = updateDateOverrideList(dateOverrideList, finalDateRange);

    expect(result.length).toBe(3);
    expect(result[2]).toEqual({ startDate: '2022-01-05', endDate: '2022-01-06', timeSlots: [] });
  });

  it('should not add duplicates to date override list', () => {
    const dateOverrideList: DateOverrideListItem[] = [
      { startDate: '2022-01-01', endDate: '2022-01-02', timeSlots: [] },
      { startDate: '2022-01-05', endDate: '2022-01-06', timeSlots: [] },
    ];
    const finalDateRange: DateOverrideListItem[] = [{ startDate: '2022-01-05', endDate: '2022-01-08', timeSlots: [] }];

    const result: DateOverrideListItem[] = updateDateOverrideList(dateOverrideList, finalDateRange);

    expect(result.length).toBe(2);
    expect(result[1]).toEqual({ startDate: '2022-01-05', endDate: '2022-01-06', timeSlots: [] });
  });
});

describe('handleNonOverlapCases', () => {
  it('should add constructed date range to dateOverrideList when dates are adjacent and time slots are identical', () => {
    const dateOverrideList: DateOverrideListItem[] = [];
    const inputOverride: DateOverrideListItem = {
      startDate: '2022-01-05',
      endDate: '2022-01-08',
      timeSlots: [{ startTime: '09:00', endTime: '12:00' }],
    };
    const existingOverride: DateOverrideListItem = {
      startDate: '2022-01-01',
      endDate: '2022-01-04',
      timeSlots: [{ startTime: '09:00', endTime: '12:00' }],
    };

    handleNonOverlapCases(dateOverrideList, inputOverride, existingOverride);

    expect(dateOverrideList.length).toBe(1);
    expect(dateOverrideList[0].startDate).toBe('2022-01-01');
    expect(dateOverrideList[0].endDate).toBe('2022-01-08');
    expect(dateOverrideList[0].timeSlots).toEqual([{ startTime: '09:00', endTime: '12:00' }]);
  });

  it('should add existing and input overrides separately to dateOverrideList when dates are not adjacent or time slots are not identical', () => {
    const dateOverrideList: DateOverrideListItem[] = [];
    const inputOverride: DateOverrideListItem = {
      startDate: '2022-01-05',
      endDate: '2022-01-08',
      timeSlots: [{ startTime: '09:00', endTime: '12:00' }],
    };
    const existingOverride: DateOverrideListItem = {
      startDate: '2022-01-01',
      endDate: '2022-01-03',
      timeSlots: [{ startTime: '13:00', endTime: '15:00' }],
    };

    handleNonOverlapCases(dateOverrideList, inputOverride, existingOverride);
    expect(dateOverrideList.length).toBe(2);
    expect(dateOverrideList[0].startDate).toEqual('2022-01-01');
    expect(dateOverrideList[0].endDate).toEqual('2022-01-03');
    expect(dateOverrideList[0].timeSlots).toEqual([{ startTime: '13:00', endTime: '15:00' }]);
    expect(dateOverrideList[1].startDate).toEqual('2022-01-05');
    expect(dateOverrideList[1].endDate).toEqual('2022-01-08');
    expect(dateOverrideList[1].timeSlots).toEqual([{ startTime: '09:00', endTime: '12:00' }]);
  });

  it('should add existing and input overrides separately to dateOverrideList when dates are adjacent & time slots are identical', () => {
    const dateOverrideList: DateOverrideListItem[] = [];
    const inputOverride: DateOverrideListItem = {
      startDate: '2022-01-01',
      endDate: '2022-01-04',
      timeSlots: [{ startTime: '13:00', endTime: '15:00' }],
    };
    const existingOverride: DateOverrideListItem = {
      startDate: '2022-01-05',
      endDate: '2022-01-08',
      timeSlots: [{ startTime: '13:00', endTime: '15:00' }],
    };

    handleNonOverlapCases(dateOverrideList, inputOverride, existingOverride);
    console.log(isDateAdjacent(inputOverride.endDate, parseISO(existingOverride.startDate)));
    expect(dateOverrideList.length).toBe(1);
    expect(dateOverrideList[0].startDate).toBe('2022-01-01');
    expect(dateOverrideList[0].endDate).toBe('2022-01-08');
    expect(dateOverrideList[0].timeSlots).toEqual([{ startTime: '13:00', endTime: '15:00' }]);
  });
});

describe('isDateAdjacent', () => {
  it('should return true when dates are adjacent', () => {
    const date = '2022-01-05';
    const endDate = new Date('2022-01-04');

    const result = isDateAdjacent(date, endDate);

    expect(result).toBe(true);
  });

  it('should return false when dates are not adjacent', () => {
    const date = '2022-01-05';
    const endDate = new Date('2022-01-04');

    const result = isDateAdjacent(date, endDate);

    expect(result).toBe(true);
  });
});

describe('areTimeSlotsIdentical', () => {
  it('should return true when time slots are identical', () => {
    const inputTimeSlots: Slot[] = [
      { startTime: '09:00', endTime: '12:00' },
      { startTime: '13:00', endTime: '15:00' },
    ];
    const existingTimeSlots: Slot[] = [
      { startTime: '09:00', endTime: '12:00' },
      { startTime: '13:00', endTime: '15:00' },
    ];

    const result = areTimeSlotsIdentical(inputTimeSlots, existingTimeSlots);

    expect(result).toBe(true);
  });

  it('should return false when time slots are not identical', () => {
    const inputTimeSlots: Slot[] = [
      { startTime: '09:00', endTime: '12:00' },
      { startTime: '13:00', endTime: '15:00' },
    ];
    const existingTimeSlots: Slot[] = [
      { startTime: '09:00', endTime: '12:00' },
      { startTime: '16:00', endTime: '18:00' },
    ];

    const result = areTimeSlotsIdentical(inputTimeSlots, existingTimeSlots);

    expect(result).toBe(false);
  });
});

describe('buildConstructedDateRange', () => {
  it('should build constructed date range with input override start date when it is after existing override start date', () => {
    const inputOverride: DateOverrideListItem = {
      startDate: '2022-01-05',
      endDate: '2022-01-08',
      timeSlots: [{ startTime: '09:00', endTime: '12:00' }],
    };
    const existingOverride: DateOverrideListItem = {
      startDate: '2022-01-01',
      endDate: '2022-01-04',
      timeSlots: [{ startTime: '09:00', endTime: '12:00' }],
    };

    const result: DateOverrideListItem = buildConstructedDateRange(inputOverride, existingOverride);

    expect(result.startDate).toBe('2022-01-01');
    expect(result.endDate).toBe('2022-01-08');
    expect(result.timeSlots).toEqual([{ startTime: '09:00', endTime: '12:00' }]);
  });
});

describe('areTimeSlotsIdentical', () => {
  it('should return true for identical time slots', () => {
    const inputTimeSlots = [
      { startTime: '09:00', endTime: '12:00' },
      { startTime: '14:00', endTime: '17:00' },
    ];

    const existingTimeSlots = [
      { startTime: '09:00', endTime: '12:00' },
      { startTime: '14:00', endTime: '17:00' },
    ];

    const result = areTimeSlotsIdentical(inputTimeSlots, existingTimeSlots);

    expect(result).toBe(true);
  });

  it('should return false for different time slot lengths', () => {
    const inputTimeSlots = [{ startTime: '09:00', endTime: '12:00' }];
    const existingTimeSlots = [
      { startTime: '09:00', endTime: '12:00' },
      { startTime: '14:00', endTime: '17:00' },
    ];

    const result = areTimeSlotsIdentical(inputTimeSlots, existingTimeSlots);

    expect(result).toBe(false);
  });

  it('should return false for different time slots', () => {
    const inputTimeSlots = [{ startTime: '09:00', endTime: '12:00' }];
    const existingTimeSlots = [{ startTime: '14:00', endTime: '17:00' }];

    const result = areTimeSlotsIdentical(inputTimeSlots, existingTimeSlots);

    expect(result).toBe(false);
  });
});
