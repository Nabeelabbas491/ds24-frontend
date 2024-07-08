import { createReducer, on, createAction, createFeatureSelector, createSelector, props } from '@ngrx/store';
import { format, parseISO, addMonths } from 'date-fns';

import { Day } from './../../types/calendar-day.type';
import { returnFormattedDay } from '../../shared/common/util';
import { CalendarMode } from '../../types/misc.type';
import { getInitialCurrentMonth, selectCalendarDay } from './../../shared/common/calendar-util';

export const featureKey = 'calendar';

export interface State {
  currentMonth: string;
  selectedDay: Day | null;
  selectedDays: Day[]; //for multiple days selection (for example date-override screen)
  days: Day[];
  dayMonthYearFormatDate: string;
  mode: CalendarMode;
  calenderData: any;
}

export const actions = {
  currentMonth: createAction('[Calendar] Current Month'),
  navigateToMonth: createAction('[Calendar] Set Current Month', props<{ currentMonth: string }>()),
  nextMonth: createAction('[Calendar] Next Month'),
  prevMonth: createAction('[Calendar] Prev Month'),
  populateCalendar: createAction('[Calendar] Populate Calendar', props<{ days: Day[] }>()),
  updateCalendarDays: createAction('[Calendar] Update Calendar Days', props<{ days: Day[] }>()),
  selectDay: createAction('[Calendar] Select Day', props<{ day: Day | null }>()),
  selectDays: createAction('[Calendar] Select Days', props<{ day: Day }>()),
  resetSelectedDays: createAction('[Calendar] Reset Selected Days'),
  selectDefaultDay: createAction('[Calendar] Select Default Day'),
  setMode: createAction('[Calendar] Set Calendar Mode', props<{ mode: CalendarMode }>()),
  resetCalendar: createAction('[Calendar] Reset Calendar'),
  setCalenderData: createAction('[Calendar] Set Calendar Data', props<{ calenderData: any }>()),
};

export const initialState: State = {
  currentMonth: getInitialCurrentMonth(),
  selectedDay: null,
  selectedDays: [],
  days: [],
  dayMonthYearFormatDate: '',
  mode: 'clientbooking',
  calenderData: [],
};

export const reducer = createReducer(
  initialState,
  on(actions.currentMonth, state => {
    const date = new Date();
    date.setDate(1);
    return { ...state, currentMonth: date.toJSON() };
  }),
  on(actions.navigateToMonth, (state, { currentMonth }) => {
    const date = parseISO(currentMonth);
    date.setDate(1);
    date.setMilliseconds(0);
    return { ...state, currentMonth: date.toJSON() };
  }),
  on(actions.nextMonth, state => ({
    ...state,
    currentMonth: addMonths(new Date(state.currentMonth), 1).toJSON(),
  })),
  on(actions.prevMonth, state => ({
    ...state,
    currentMonth: addMonths(new Date(state.currentMonth), -1).toJSON(),
  })),
  on(actions.populateCalendar, (state, { days }) => ({ ...state, days })),
  on(actions.updateCalendarDays, (state, { days }) => ({ ...state, days })),
  on(actions.selectDay, (state, { day }) => {
    const selectedDay = day;
    const dayMonthYearTitle = selectedDay ? returnFormattedDay(selectedDay) : '';

    return { ...state, selectedDay: day, dayMonthYearFormatDate: dayMonthYearTitle };
  }),
  on(actions.selectDays, (state, { day }) => {
    return { ...state, selectedDays: [...selectCalendarDay([...state.selectedDays], day)] };
  }),
  on(actions.setMode, (state, { mode }) => ({ ...state, mode })),
  on(actions.resetSelectedDays, state => ({ ...state, selectedDays: [] })),
  on(actions.resetCalendar, state => ({ ...state, ...initialState })),
  on(actions.setCalenderData, (state, { calenderData }) => ({ ...state, calenderData })),
);

// Selectors
const selectSlice = createFeatureSelector<State>(featureKey);

export const selectors = {
  selectCalendarCurrentMonth: createSelector(selectSlice, (state: State) => state.currentMonth),
  selectCalendarCurrentMonthFormatted: createSelector(selectSlice, (state: State) =>
    format(parseISO(state.currentMonth), 'MMMM yyyy'),
  ),
  selectCalendarSelectedDay: createSelector(selectSlice, (state: State) => state.selectedDay),
  selectCalendarSelectedDays: createSelector(selectSlice, (state: State) => state.selectedDays),
  selectCalendarDays: createSelector(selectSlice, (state: State) => state.days),
  selectDayMonthYearFormatDate: createSelector(selectSlice, (state: State) => state.dayMonthYearFormatDate),
  selectCalendarMode: createSelector(selectSlice, (state: State) => state.mode),
  selectCalenderData: createSelector(selectSlice, (state: State) => state.calenderData),
};
