import { createAction, createFeatureSelector, createReducer, createSelector, on, props } from '@ngrx/store';
import { EditOverrideDetails, FormDayDetail, TimeSlot, WeekSchedule } from 'src/app/types/vendor.types';
import { blankAvailabilities } from '../../types/vendor.types.mock';
import { GenericResponse } from 'src/app/types/misc.type';

export const featureKey = 'vendor-schedule';

export interface State {
  errorMessage: string;
  weekSchedule: WeekSchedule;
  pending: boolean;
  isUnavailable: boolean;
  isScheduleEmpty: boolean;
  overrideTimeSlots: TimeSlot[];
  openedOverrideTimeSlots: TimeSlot[];
  updateOverrideIndex: number | null;
  isRemoveDateOveridePending: boolean;
}

export const initialState: State = {
  errorMessage: '',
  weekSchedule: {
    id: 1,
    timeZone: '',
    availabilities: blankAvailabilities,
  },
  pending: false,
  isUnavailable: false,
  isScheduleEmpty: false,
  overrideTimeSlots: [],
  openedOverrideTimeSlots: [],
  updateOverrideIndex: 0,
  isRemoveDateOveridePending: false,
};

export const actions = {
  setErrorMessage: createAction('[Vendor Schedule] Set Error Messages Schedule', props<{ ErrorMessage: string }>()),
  saveErrorMessage: createAction('[Vendor Schedule] Save Error Messages Schedule', props<{ ErrorMessage: string }>()),
  setSuccessMessage: createAction(
    '[Vendor Schedule] Set Success Messages Schedule',
    props<{ SuccessMessage: string }>(),
  ),
  loadVendorSchedule: createAction('[Vendor Schedule] Load Vendor Schedule'),
  loadVendorScheduleSuccess: createAction(
    '[Vendor Schedule] Load Vendor Schedule Success',
    props<{ weekSchedule: WeekSchedule }>(),
  ),
  saveScheduleStatus: createAction('[Vendor Schedule] Save schedule status', props<{ isScheduleEmpty: boolean }>()),
  saveVendorScheduleForm: createAction(
    '[Vendor Schedule] Save vendor schedule form',
    props<{ daysFormValue: FormDayDetail[] }>(),
  ),
  showInvalidFormError: createAction('[Vendor Schedule] Show invalid form error', props<{ formError: string }>()),
  createVendorSchedule: createAction(
    '[Vendor Schedule] Create Vendor Schedule',
    props<{ weekSchedule: WeekSchedule }>(),
  ),
  handleScheduleSuccessResponse: createAction(
    '[Vendor Schedule] Handle Schedule Success Response',
    props<{ weekData: GenericResponse<WeekSchedule> }>(),
  ),
  saveVendorSchedule: createAction('[Vendor Schedule] Save Vendor Schedule', props<{ weekSchedule: WeekSchedule }>()),
  saveDateOverride: createAction('[Vendor Schedule] Save date override'),
  saveOverrideForm: createAction('[Vendor Schedule] Save override schedule form', props<{ timeSlots: TimeSlot[] }>()),
  updateOpenedOverrideTimeslots: createAction(
    '[Vendor Schedule] Update opened override timeslots',
    props<{ slots: TimeSlot[] }>(),
  ),
  setIfUnavailable: createAction('[Vendor Schedule] Set if unavailable', props<{ isUnavailable: boolean }>()),
  setUpdateOverrideDetails: createAction(
    '[Vendor Schedule] Set update schedules index ',
    props<{ updateOverrideIndex: number | null }>(),
  ),
  resetOpenedOverrideTimeSlots: createAction('[Vendor Schedule] Reset opened override timeslots'),
  editOverrideSchedule: createAction(
    '[Vendor Schedule] Edit Modal for override timeslots',
    props<{ editSheduleDetails: EditOverrideDetails }>(),
  ),
  removeSelectedOverride: createAction('[Vendor Schedule] Remove override days', props<{ index: number }>()),
  setRemoveDateOveridePendingStatus: createAction(
    '[Vendor Schedule] Set remove selected override pending status',
    props<{ isPending: boolean }>(),
  ),
};

export const reducer = createReducer(
  initialState,
  on(actions.setErrorMessage, (state, { ErrorMessage }) => ({
    ...state,
    ErrorMessage,
    pending: false,
  })),
  on(actions.saveErrorMessage, (state, { ErrorMessage }) => ({ ...state, ErrorMessage, pending: false })),
  on(actions.loadVendorSchedule, state => ({ ...state, pending: true })),
  on(actions.loadVendorScheduleSuccess, (state, { weekSchedule }) => ({ ...state, weekSchedule, pending: false })),
  on(actions.saveVendorSchedule, state => ({ ...state, pending: true })),
  on(actions.setIfUnavailable, (state, { isUnavailable }) => ({ ...state, isUnavailable })),
  on(actions.saveScheduleStatus, (state, { isScheduleEmpty }) => ({ ...state, isScheduleEmpty })),
  on(actions.saveOverrideForm, (state, { timeSlots }) => ({ ...state, overrideTimeSlots: timeSlots })),
  on(actions.updateOpenedOverrideTimeslots, (state, { slots }) => ({ ...state, openedOverrideTimeSlots: slots })),
  on(actions.setUpdateOverrideDetails, (state, { updateOverrideIndex }) => ({ ...state, updateOverrideIndex })),
  on(actions.resetOpenedOverrideTimeSlots, state => ({ ...state, openedOverrideTimeSlots: [] })),
  on(actions.removeSelectedOverride, state => ({ ...state })),
  on(actions.setSuccessMessage, state => ({ ...state })),
  on(actions.setRemoveDateOveridePendingStatus, (state, { isPending }) => ({
    ...state,
    isRemoveDateOveridePending: isPending,
  })),
  on(actions.handleScheduleSuccessResponse, (state, { weekData }) => ({
    ...state,
    isScheduleEmpty: false,
    weekSchedule: weekData.data,
    pending: false,
  })),
);

export const selectSlice = createFeatureSelector<State>(featureKey);

export const selectors = {
  selectErrorMessage: createSelector(selectSlice, (state: State) => state.errorMessage),
  selectVendorSchedule: createSelector(selectSlice, (state: State) => state.weekSchedule),
  selectOverrideDays: createSelector(selectSlice, (state: State) => {
    return state.weekSchedule.availabilities.filter(day => day.type === 'override');
  }),
  selectVendorIsUnavailable: createSelector(selectSlice, (state: State) => state.isUnavailable),
  selectPending: createSelector(selectSlice, (state: State) => state.pending),
  selectScheduleStatus: createSelector(selectSlice, (state: State) => state.isScheduleEmpty),
  selectOverrideFormValue: createSelector(selectSlice, (state: State) => state.overrideTimeSlots),
  selectOpenedOverrideTimeSlots: createSelector(selectSlice, (state: State) => state.openedOverrideTimeSlots),
  selectUpdateOverrideIndex: createSelector(selectSlice, (state: State) => state.updateOverrideIndex),
  selectRemoveDateOveridePending: createSelector(selectSlice, (state: State) => state.isRemoveDateOveridePending),
};
