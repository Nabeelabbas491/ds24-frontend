import { createAction, createFeatureSelector, createReducer, createSelector, on, props } from '@ngrx/store';
import {
  BookingDetail,
  BookingSaveSuccess,
  BookingTemplateDetail,
  BookingTemplatePayload,
} from '../../types/booking.type';
import { Slot } from './../../types/calendar-day.type';

export const featureKey = 'booking-api';

export const actions = {
  getBookingTemplate: createAction(
    '[Booking/API] Get Booking Template',
    props<{ paramDetails: BookingTemplatePayload }>(),
  ),
  getBookingTemplateSuccess: createAction(
    '[Booking/API] Get Booking Template Success',
    props<{ bookingTemplateDetail: BookingTemplateDetail }>(),
  ),
  getBookingTemplateFailure: createAction('[Booking/API] Get Booking Template Failure', props<{ error: any }>()),
  resetBookingTemplate: createAction('[Booking/API] Reset Booking Template'),

  getBookingTimeSlots: createAction('[Booking/API] Get Booking Time Slots', props<{ date: string }>()),
  getBookingTimeSlotsSuccess: createAction(
    '[Booking/API] Get Booking Time Slots Success',
    props<{ timeSlots: Slot[] }>(),
  ),
  getBookingTimeSlotsFailure: createAction('[Booking/API] Get Booking Time Slots Failure', props<{ error: any }>()),

  downloadClientICS: createAction('[Booking/API] Download Client ICS', props<{ appointmentId: number }>()),
  downloadClientICSSuccess: createAction('[Booking/API] Download Client ICS Success'),
  downloadClientICSFailure: createAction('[Booking/API] Download Client ICS Failure', props<{ error: any }>()),

  saveBooking: createAction('[Booking/API] Save Booking', props<{ bookingDetail: BookingDetail }>()),
  saveBookingSuccess: createAction(
    '[Booking/API] Save Booking Success',
    props<{ bookingSaveSuccess: BookingSaveSuccess }>(),
  ),
  saveBookingFailure: createAction('[Booking/API] Save Booking Failure', props<{ error: any }>()),
};

export interface State {
  paramId: string | null;
  bookingTemplateError: string | null;
  bookingTemplatePending: boolean;
  bookingTemplateSuccess: BookingTemplateDetail | null;

  downloadClientICSError: string | null;
  downloadClientICSPending: boolean;

  bookingTimeSlotsError: string | null;
  bookingTimeSlotsPending: boolean;
  bookingTimeSlots: Slot[];

  error: string | null;
  pending: boolean;
  bookingSaveSuccess: BookingSaveSuccess | null;
}

export const initialState: State = {
  paramId: null,
  bookingTemplateError: null,
  bookingTemplatePending: false,
  bookingTemplateSuccess: null,

  downloadClientICSError: null,
  downloadClientICSPending: false,

  bookingTimeSlotsError: null,
  bookingTimeSlotsPending: false,
  bookingTimeSlots: [],

  error: null,
  pending: false,
  bookingSaveSuccess: null,
};

export const reducer = createReducer(
  initialState,
  on(actions.getBookingTemplate, (state, { paramDetails }) => ({
    ...state,
    paramId: paramDetails.paramId,
    bookingTemplateError: null,
    bookingTemplatePending: true,
  })),
  on(actions.getBookingTemplateSuccess, (state, { bookingTemplateDetail }) => ({
    ...state,
    bookingTemplateError: null,
    bookingTemplatePending: false,
    bookingTemplateSuccess: bookingTemplateDetail,
  })),
  on(actions.getBookingTemplateFailure, (state, { error }) => ({
    ...state,
    bookingTemplateError: error,
    bookingTemplatePending: false,
  })),
  on(actions.resetBookingTemplate, state => ({
    ...state,
    bookingTemplateError: null,
    bookingTemplatePending: false,
    bookingTemplateSuccess: null,
  })),

  on(actions.downloadClientICS, state => ({
    ...state,
    downloadClientICSError: null,
    downloadClientICSPending: true,
  })),
  on(actions.downloadClientICSSuccess, state => ({
    ...state,
    downloadClientICSError: null,
    downloadClientICSPending: false,
  })),
  on(actions.downloadClientICSFailure, (state, { error }) => ({
    ...state,
    downloadClientICSError: error,
    downloadClientICSPending: false,
  })),

  on(actions.getBookingTimeSlots, state => ({
    ...state,
    bookingTimeSlots: [],
    bookingTimeSlotsError: null,
    bookingTimeSlotsPending: true,
  })),
  on(actions.getBookingTimeSlotsSuccess, (state, { timeSlots }) => ({
    ...state,
    bookingTimeSlots: [...timeSlots],
    bookingTimeSlotsError: null,
    bookingTimeSlotsPending: false,
  })),
  on(actions.getBookingTimeSlotsFailure, (state, { error }) => ({
    ...state,
    bookingTimeSlots: [],
    bookingTimeSlotsError: error,
    bookingTimeSlotsPending: false,
  })),

  on(actions.saveBooking, state => ({ ...state, error: null, pending: true })),
  on(actions.saveBookingSuccess, (state, { bookingSaveSuccess }) => ({
    ...state,
    error: null,
    pending: false,
    bookingSaveSuccess: bookingSaveSuccess,
  })),
  on(actions.saveBookingFailure, (state, { error }) => ({ ...state, error, pending: false })),
);

// Selectors
export const selectSlice = createFeatureSelector<State>(featureKey);

export const selectors = {
  selectBookingProductId: createSelector(selectSlice, (state: State) => state.paramId),
  selectBookingTemplateError: createSelector(selectSlice, (state: State) => state.bookingTemplateError),
  selectBookingTemplatePending: createSelector(selectSlice, (state: State) => state.bookingTemplatePending),

  selectBookingTemplateSuccess: createSelector(selectSlice, (state: State) => state.bookingTemplateSuccess),
  selectBookingMeetingTypes: createSelector(
    selectSlice,
    (state: State) => state.bookingTemplateSuccess?.bookingMeetingTypes,
  ),
  selectBookingProduct: createSelector(selectSlice, (state: State) => state.bookingTemplateSuccess?.bookingProduct),

  selectDownloadClientICSError: createSelector(selectSlice, (state: State) => state.downloadClientICSError),
  selectDownloadClientICSPending: createSelector(selectSlice, (state: State) => state.downloadClientICSPending),

  selectBookingSaveError: createSelector(selectSlice, (state: State) => state.error),
  selectBookingSavePending: createSelector(selectSlice, (state: State) => state.pending),
  selectBookingSaveSuccess: createSelector(selectSlice, (state: State) => state.bookingSaveSuccess),

  selectBookingTimeSlotsError: createSelector(selectSlice, (state: State) => state.bookingTimeSlotsError),
  selectBookingTimeSlotsPending: createSelector(selectSlice, (state: State) => state.bookingTimeSlotsPending),
  selectBookingTimeSlots: createSelector(selectSlice, (state: State) => state.bookingTimeSlots),
};
