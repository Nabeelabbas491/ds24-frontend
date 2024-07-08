import { createReducer, on, createAction, createFeatureSelector, createSelector, props } from '@ngrx/store';
import { Day, Slot } from './../../types/calendar-day.type';
import {
  BookingSaveSuccess,
  BookingSnapshot,
  BookingStep,
  BookingTemplateSummary,
  MeetingTypeId,
} from '../../types/booking.type';
import { guessDefaultTimezone } from './../../shared/common/util';
import { MeetingType } from './../../types/misc.type';
import { IconName } from '@ds24/elements';

export const featureKey = 'booking';

export interface State {
  currentStep: BookingStep;
  selectedDay: Day | null;
  meetingType: MeetingType | null;
  timeZone: string;
  prevTimeSlot: Slot | null;
  timeSlot: Slot | null;
  bookingTemplateSummary: BookingTemplateSummary;

  isBookingSynced: boolean;

  bookingSaveSuccess: BookingSaveSuccess | null;
}

export const actions = {
  selectDay: createAction('[Booking] Select Day', props<{ day: Day | null }>()),
  meetingType: createAction('[Booking] Booking Type', props<{ meetingType: MeetingType | null }>()),
  timeZone: createAction('[Booking] Time Zone', props<{ timeZone: string }>()),

  timeSlot: createAction('[Booking] Time Slot', props<{ timeSlot: Slot | null }>()),
  prevTimeSlot: createAction('[Booking] Prev Time Slot', props<{ prevTimeSlot: Slot | null }>()),

  setBookingTemplateSummary: createAction(
    '[Booking] set booking template summary',
    props<{ bookingTemplateSummary: BookingTemplateSummary }>(),
  ),

  editBooking: createAction('[Booking] Edit Booking'),

  selectStep: createAction('[Booking] Select Step', props<{ step: BookingStep }>()),
  completeBooking: createAction('[Booking] Complete Booking', props<{ bookingSaveSuccess: BookingSaveSuccess }>()),

  loadBookingSnapshot: createAction('[Booking] Load Booking Snapshot', props<{ bookingSnapshot: BookingSnapshot }>()),

  isBookingSynced: createAction(
    '[Booking] Is Booking Syced with Google Calendar',
    props<{ isBookingSynced: boolean }>(),
  ),
};

export const initialState: State = {
  currentStep: 'calendar',
  selectedDay: null,
  meetingType: null,
  timeZone: guessDefaultTimezone(),
  prevTimeSlot: null,
  timeSlot: null,
  isBookingSynced: false,
  bookingTemplateSummary: {
    heading: '',
    duration: 30,
    userName: 'test',
    imageUrl: '',
  },
  bookingSaveSuccess: null,
};

export const reducer = createReducer(
  initialState,
  on(actions.selectDay, (state, { day }) => ({ ...state, timeSlot: null, prevTimeSlot: null, selectedDay: day })),
  on(actions.meetingType, (state, { meetingType }) => ({ ...state, meetingType })),
  on(actions.timeZone, (state, { timeZone }) => ({ ...state, timeZone })),
  on(actions.timeSlot, (state, { timeSlot }) => ({ ...state, timeSlot })),
  on(actions.prevTimeSlot, (state, { prevTimeSlot }) => ({ ...state, prevTimeSlot })),
  on(actions.selectStep, (state, { step }) => ({ ...state, currentStep: step })),
  on(actions.setBookingTemplateSummary, (state, { bookingTemplateSummary }) => ({ ...state, bookingTemplateSummary })),
  on(actions.completeBooking, (state, { bookingSaveSuccess }) => ({ ...state, bookingSaveSuccess })),
  on(actions.loadBookingSnapshot, (state, { bookingSnapshot }) => ({ ...state, ...bookingSnapshot })),
  on(actions.isBookingSynced, (state, { isBookingSynced }) => ({ ...state, isBookingSynced })),
);

// Selectors
const selectSlice = createFeatureSelector<State>(featureKey);

const selectCurrentStep = createSelector(selectSlice, (state: State) => state.currentStep);

const selectSelectedDay = createSelector(selectSlice, (state: State) => state.selectedDay);

const selectMeetingType = createSelector(selectSlice, (state: State) => state.meetingType);
const selectTimeZone = createSelector(selectSlice, (state: State) => state.timeZone);
const selectTimeSlot = createSelector(selectSlice, (state: State) => state.timeSlot);
const selectPrevTimeSlot = createSelector(selectSlice, (state: State) => state.prevTimeSlot);

const selectBookingTemplateSummary = createSelector(selectSlice, (state: State) => state.bookingTemplateSummary);

const selectBookingSaveSuccess = createSelector(selectSlice, (state: State) => state.bookingSaveSuccess);
const selectBookingSnapshot = createSelector(selectSlice, (state: State) => state as BookingSnapshot);

const selectIsBookingSynced = createSelector(selectSlice, (state: State) => state.isBookingSynced);

const selectCallType = createSelector(
  selectSlice,
  (state: State) => `BOOKING.CALL_TYPE.CALL_TYPE_SHORT.${state.meetingType?.id}`,
);
const selectCallTypeIcon = createSelector(selectSlice, (state: State) =>
  state.meetingType?.id === MeetingTypeId.Zoom ? IconName.Camera : IconName.Phone,
);
const selectcallTypeSummary = createSelector(
  selectSlice,
  (state: State) => `BOOKING.CALL_TYPE.CALL_TYPE_SUMMARY.${state.meetingType?.id}`,
);

export const selectors = {
  selectCurrentStep,

  selectSelectedDay,
  selectMeetingType,
  selectTimeZone,
  selectTimeSlot,
  selectPrevTimeSlot,

  selectBookingTemplateSummary,

  selectCallType,
  selectCallTypeIcon,
  selectcallTypeSummary,

  selectBookingSaveSuccess,

  selectBookingSnapshot,

  selectIsBookingSynced,

  isDateTimeSelectionStepComplete: createSelector(
    selectSelectedDay,
    selectTimeZone,
    selectTimeSlot,
    (day, timeZone, timeSlot) => {
      return !!day && !!timeZone && !!timeSlot;
    },
  ),

  isBookingSelectionStepComplete: createSelector(
    selectSelectedDay,
    selectMeetingType,
    selectTimeZone,
    selectTimeSlot,
    (day, meetingType, timeZone, timeSlot) => {
      return !!day && !!meetingType && !!timeZone && !!timeSlot;
    },
  ),
};
