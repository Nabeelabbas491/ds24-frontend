import { createReducer, on, createFeatureSelector, createAction, props, createSelector } from '@ngrx/store';
import { BookingTemplateCollection, SaveBookingTemplate } from './../../types/vendor.types';
import { BookingTemplateList } from 'src/app/types/vendor.booking-template.type';

export const featureKey = 'vendor-booking-template';

export interface State {
  bookingTemplateCollectionError: string | null;
  bookingTemplateCollectionPending: boolean;
  bookingTemplateCollection: BookingTemplateCollection | undefined;

  bookingTemplateListError: string | null;
  bookingTemplateListPending: boolean;
  bookingTemplateList: BookingTemplateList | undefined;
  currentPage: number;

  upsertBookingTemplateError: string | null;
  upsertBookingTemplatePending: boolean;
  upsertBookingTemplateSuccess: string | null;
}

export const actions = {
  getCollection: createAction(
    '[Vendor Booking Template] Get data needed for create / edit booking template form',
    props<{ bookingTemplateId?: number }>(),
  ),
  getCollectionSuccess: createAction(
    '[Vendor Booking Template] Data required for booking template form is successfully fetched',
    props<{ bookingTemplateCollection: BookingTemplateCollection }>(),
  ),
  getCollectionFailure: createAction(
    '[Vendor Booking Template] Error in fetching collection data',
    props<{ error: any }>(),
  ),

  getBookingTemplateList: createAction('[Vendor Booking Template] Get lists of booking templates'),
  getBookingTemplateListSuccess: createAction(
    '[Vendor Booking Template] Lists of booking templates received successfully',
    props<{ bookingTemplateList: BookingTemplateList }>(),
  ),
  getBookingTemplateListFailure: createAction(
    '[Vendor Booking Template] Error in getting list of booking templates',
    props<{ error: any }>(),
  ),
  setBookingTemplateListCurrentPage: createAction(
    '[Vendor Booking Template] Set current page for booking template list',
    props<{ currentPage: number }>(),
  ),

  upsertBookingTemplate: createAction(
    '[Vendor Booking Template] Insert / Update Booking Template',
    props<{ bookingTemplateId?: number; saveBookingTemplate: SaveBookingTemplate }>(),
  ),
  upsertBookingTemplateSuccess: createAction(
    '[Vendor Booking Template] Insert / Update Booking Template Success',
    props<{ success: any }>(),
  ),
  upsertBookingTemplateFailure: createAction(
    '[Vendor Booking Template] Error in inserting / updating a booking template',
    props<{ error: any }>(),
  ),

  openCreateBookingModal: createAction('[Vendor Booking Template] Open Create Booking Template Modal Popup'),
  openEditBookingModal: createAction(
    '[Vendor Booking Template] Open Edit Booking Template Modal Popup',
    props<{ bookingTemplateId: number }>(),
  ),
  closeBookingModal: createAction('[Vendor Booking Template] Close Booking Template Modal Popup'),
};

export const initialState: State = {
  bookingTemplateCollectionError: null,
  bookingTemplateCollectionPending: false,
  bookingTemplateCollection: undefined,

  bookingTemplateListError: null,
  bookingTemplateListPending: false,
  bookingTemplateList: undefined,
  currentPage: 1,

  upsertBookingTemplateError: null,
  upsertBookingTemplatePending: false,
  upsertBookingTemplateSuccess: null,
};

export const reducer = createReducer(
  initialState,
  on(actions.getCollection, state => ({
    ...state,
    bookingTemplateCollectionError: null,
    bookingTemplateCollectionPending: true,
  })),
  on(actions.getCollectionSuccess, (state, { bookingTemplateCollection }) => ({
    ...state,
    bookingTemplateCollectionError: null,
    bookingTemplateCollectionPending: false,
    bookingTemplateCollection,
  })),
  on(actions.getCollectionFailure, (state, { error }) => ({
    ...state,
    bookingTemplateCollectionError: error,
    bookingTemplateCollectionPending: false,
  })),

  on(actions.closeBookingModal, state => ({
    ...state,
    bookingTemplateCollection: undefined,
  })),

  on(actions.getBookingTemplateList, state => ({
    ...state,
    bookingTemplateList: undefined,
    bookingTemplateListError: null,
    bookingTemplateListPending: true,
  })),
  on(actions.getBookingTemplateListSuccess, (state, { bookingTemplateList }) => ({
    ...state,
    bookingTemplateListError: null,
    bookingTemplateListPending: false,
    bookingTemplateList,
  })),
  on(actions.getBookingTemplateListFailure, (state, { error }) => ({
    ...state,
    bookingTemplateListError: error,
    bookingTemplateListPending: false,
  })),
  on(actions.setBookingTemplateListCurrentPage, (state, { currentPage }) => ({
    ...state,
    currentPage,
  })),

  on(actions.upsertBookingTemplate, state => ({
    ...state,
    upsertBookingTemplateError: null,
    upsertBookingTemplatePending: true,
    upsertBookingTemplateSuccess: null,
  })),
  on(actions.upsertBookingTemplateSuccess, (state, { success }) => ({
    ...state,
    upsertBookingTemplateError: null,
    upsertBookingTemplatePending: false,
    upsertBookingTemplateSuccess: success,
  })),
  on(actions.upsertBookingTemplateFailure, (state, { error }) => ({
    ...state,
    upsertBookingTemplateError: error,
    upsertBookingTemplatePending: false,
    upsertBookingTemplateSuccess: null,
  })),
);

// Selectors

export const selectSlice = createFeatureSelector<State>(featureKey);

export const selectors = {
  selectBookingTemplateCollectionPending: createSelector(
    selectSlice,
    (state: State) => state.bookingTemplateCollectionPending,
  ),
  selectBookingTemplateCollectionError: createSelector(
    selectSlice,
    (state: State) => state.bookingTemplateCollectionError,
  ),
  selectBookingTemplateCollection: createSelector(selectSlice, (state: State) => state.bookingTemplateCollection),

  selectBookingTemplateListPending: createSelector(selectSlice, (state: State) => state.bookingTemplateListPending),
  selectBookingTemplateListError: createSelector(selectSlice, (state: State) => state.bookingTemplateListError),
  selectBookingTemplateList: createSelector(selectSlice, (state: State) => state.bookingTemplateList),
  selectBookingTemplateListCurrentPage: createSelector(selectSlice, (state: State) => state.currentPage),

  selectUpsertBookingTemplatePending: createSelector(selectSlice, (state: State) => state.upsertBookingTemplatePending),
  selectUpsertBookingTemplateError: createSelector(selectSlice, (state: State) => state.upsertBookingTemplateError),
  selectUpsertBookingTemplateSuccess: createSelector(selectSlice, (state: State) => state.upsertBookingTemplateSuccess),
};
