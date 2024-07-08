import { reducer, initialState, actions, State, selectors } from './calendar.store';
import { addMonths, parseISO } from 'date-fns';
import { Day } from './../../types/calendar-day.type';
import { daysMock } from './../../types/calendar-day.type.mock';

describe('Calendar Reducer', () => {
  it('should handle currentMonth action', () => {
    const newState = reducer(initialState, actions.currentMonth());

    const date = new Date();
    date.setDate(1);
    date.setMilliseconds(0);

    const stateDate = new Date(newState.currentMonth);
    stateDate.setMilliseconds(0);
    expect(stateDate.toISOString()).toEqual(date.toJSON());
  });

  it('should handle navigateToMonth action', () => {
    const newState = reducer(initialState, actions.navigateToMonth({ currentMonth: '2024-08-01' }));
    const date = parseISO(newState.currentMonth);
    date.setDate(1);
    date.setMilliseconds(0);

    expect(newState.currentMonth).toEqual(date.toJSON());
  });

  it('should handle nextMonth action', () => {
    const state: State = { ...initialState, currentMonth: '2023-11-01' };
    const newState = reducer(state, actions.nextMonth());

    expect(newState.currentMonth).toEqual(addMonths(new Date(state.currentMonth), 1).toJSON());
  });

  it('should handle prevMonth action', () => {
    const state: State = { ...initialState, currentMonth: '2023-11-01' };
    const newState = reducer(state, actions.prevMonth());

    expect(newState.currentMonth).toEqual(addMonths(new Date(state.currentMonth), -1).toJSON());
  });

  it('should handle populateCalendar action', () => {
    const mockDays: Day[] = [];
    const newState = reducer(initialState, actions.populateCalendar({ days: mockDays }));

    expect(newState.days).toEqual(mockDays);
  });

  it('should handle populateCalendar action', () => {
    const mockDays: Day[] = daysMock;
    const newState = reducer(initialState, actions.populateCalendar({ days: mockDays }));

    expect(newState.days).toEqual(mockDays);
  });

  it('should handle selectDay action', () => {
    const mockSelectedDay: Day = {
      number: 26,
      isToday: true,
      isSelected: false,
      isOtherMonth: false,
      isSelectable: true,
      isPast: false,
      dayMonthYearTitle: '2023-12-26',
      slotsArr: [
        { startTime: '09:00', endTime: '09:30' },
        { startTime: '10:00', endTime: '10:30' },
        { startTime: '11:00', endTime: '11:30' },
        { startTime: '12:00', endTime: '12:30' },
      ],
    };
    const state: State = { ...initialState, selectedDay: null, dayMonthYearFormatDate: '' };
    const newState = reducer(state, actions.selectDay({ day: mockSelectedDay }));

    expect(newState.selectedDay).toEqual(mockSelectedDay);
    expect(newState.dayMonthYearFormatDate).toEqual('26 December, 2023');
  });

  it('should handle setMode action', () => {
    const mode = 'clientbooking';
    const newState = reducer(initialState, actions.setMode({ mode }));
    expect(newState.mode).toEqual(mode);
  });

  it('should handle setCalenderData action', () => {
    const calenderData: any = [];
    const newState = reducer(initialState, actions.setCalenderData({ calenderData }));
    expect(newState.calenderData).toEqual(calenderData);
  });

  it('should handle resetSelectedDays action', () => {
    const newState = reducer(initialState, actions.resetSelectedDays());
    expect(newState.selectedDays).toEqual([]);
  });

  it('should handle resetCalendar action', () => {
    const state: State = {
      ...initialState,
      currentMonth: '2024-01-01',
      selectedDay: {
        number: 1,
        isToday: false,
        isSelected: false,
        isOtherMonth: false,
        isSelectable: true,
        isPast: false,
        dayMonthYearTitle: '2024-01-01',
        slotsArr: [],
      },
    };
    const newState = reducer(state, actions.resetCalendar());

    expect(newState).toEqual(initialState);
  });
});

describe('Calendar Selectors', () => {
  const mockState: State = {
    currentMonth: '2023-11-01',
    selectedDay: null,
    selectedDays: [],
    days: [],
    mode: 'clientbooking',
    dayMonthYearFormatDate: '',
    calenderData: [],
  };

  it('should select currentMonth', () => {
    const selectedValue = selectors.selectCalendarCurrentMonth.projector(mockState);
    expect(selectedValue).toEqual(mockState.currentMonth);
  });

  it('should select formatted currentMonth', () => {
    const selectedValue = selectors.selectCalendarCurrentMonthFormatted.projector(mockState);
    expect(selectedValue).toEqual('November 2023');
  });

  it('should select selectedDay', () => {
    const selectedValue = selectors.selectCalendarSelectedDay.projector(mockState);
    expect(selectedValue).toEqual(mockState.selectedDay);
  });

  it('should select days', () => {
    const selectedValue = selectors.selectCalendarDays.projector(mockState);
    expect(selectedValue).toEqual(mockState.days);
  });

  it('should select dayMonthYearFormatDate', () => {
    const selectedValue = selectors.selectDayMonthYearFormatDate.projector(mockState);
    expect(selectedValue).toEqual(mockState.dayMonthYearFormatDate);
  });

  it('should select calenderData', () => {
    const selectedValue = selectors.selectCalenderData.projector(mockState);
    expect(selectedValue).toEqual(mockState.calenderData);
  });
});
