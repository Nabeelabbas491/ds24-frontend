import { createAction, createFeatureSelector, createReducer, createSelector, on, props } from '@ngrx/store';
import { AppointmentDetails, AppointmentList, AppointmentListParams } from '../../types/vendor.types';

export const featureKey = 'vendor-appointment';

export interface State {
  errorMessage: string;
  appointmentListData: AppointmentList;
  appointmentDetailData: AppointmentDetails;
  listParams: AppointmentListParams;
  pending: boolean;
  cancelPending: boolean;
  downloadVendorICSError: string | null;
  downloadVendorICSPending: boolean;
  calendarAppointmentCount: number;
}

export const initialState: State = {
  errorMessage: '',
  appointmentListData: {
    appointments: [],
    page: 0,
    limit: 10,
    total: 0,
  },
  appointmentDetailData: {
    id: null,
    timezone: '',
    abbreviatedTimeZone: '',
    date: '',
    startTime: '',
    endTime: '',
    name: '',
    email: '',
    note: '',
    phoneNumber: '',
    status: '',
    bookingMeetingType: {
      id: null,
      name: '',
    },
    bookingProduct: {
      id: null,
      productId: null,
      productName: '',
    },
    zoomLink: '',
    vendorGoogleSynced: false,
  },
  listParams: {
    searchValue: '',
    page: 1,
    limit: 10,
    sortOrder: 'asc',
  },
  pending: false,
  cancelPending: false,
  downloadVendorICSError: null,
  downloadVendorICSPending: false,
  calendarAppointmentCount: 0,
};

export const actions = {
  loadAppointmentDetail: createAction(
    '[Vendor Appointment] Load Appointment detail to page',
    props<{ detailsId: number }>(),
  ),
  redirectToVendorDetailPage: createAction('[Vendor Appointment] Navigate to page', props<{ detailsId: number }>()),
  loadAppointmentList: createAction(
    '[Vendor Appointment] Load Appointment List',
    props<{ listParams: AppointmentListParams }>(),
  ),
  loadAppointmentListSuccess: createAction(
    '[Vendor Appointment] Load Appointment Success',
    props<{ appointmentListData: AppointmentList }>(),
  ),
  setErrorMessage: createAction('[Vendor Appointment] Set Error Messages', props<{ ErrorMessage: string }>()),
  setAppointmentDetail: createAction(
    '[Vendor Appointment] Set Appointment Details',
    props<{ appointmentDetailData: AppointmentDetails }>(),
  ),
  updateListParam: createAction(
    '[Vendor Appointment] Set appointment list param',
    props<{ paramName: string; paramValue: string | number }>(),
  ),
  cancelAppointment: createAction('[Vendor Appointment] Delete appointment', props<{ appointmentId: number }>()),
  downloadVendorICS: createAction('[Vendor Appointment] Download Vendor ICS', props<{ appointmentId: number }>()),
  downloadVendorICSSuccess: createAction('[Vendor Appointment] Download Vendor ICS Success'),
  downloadVendorICSFailure: createAction('[Vendor Appointment] Download Vendor ICS Failure', props<{ error: any }>()),
  setTotalNumberOfAppointments: createAction(
    '[Vendor Appointment] Set total numer of appointments',
    props<{ appointmentTotal: number }>(),
  ),
};

export const reducer = createReducer(
  initialState,
  on(actions.loadAppointmentDetail, (state, { detailsId }) => ({
    ...state,
    detailsId,
    pending: true,
    cancelPending: false,
  })),
  on(actions.setAppointmentDetail, (state, { appointmentDetailData }) => ({
    ...state,
    appointmentDetailData,
    pending: false,
  })),
  on(actions.loadAppointmentList, (state, { listParams }) => ({ ...state, listParams, pending: true })),
  on(actions.loadAppointmentListSuccess, (state, { appointmentListData }) => ({
    ...state,
    appointmentListData,
    pending: false,
  })),
  on(actions.setErrorMessage, (state, { ErrorMessage }) => ({ ...state, ErrorMessage, pending: false })),
  on(actions.cancelAppointment, state => ({ ...state, cancelPending: true })),
  on(actions.updateListParam, (state, { paramName, paramValue }) => ({
    ...state,
    listParams: { ...state.listParams, [paramName]: paramValue },
  })),
  on(actions.downloadVendorICS, state => ({
    ...state,
    downloadVendorICSError: null,
    downloadVendorICSPending: true,
  })),
  on(actions.downloadVendorICSSuccess, state => ({
    ...state,
    downloadVendorICSError: null,
    downloadVendorICSPending: false,
  })),
  on(actions.downloadVendorICSFailure, (state, { error }) => ({
    ...state,
    downloadVendorICSError: error,
    downloadVendorICSPending: false,
  })),
  on(actions.setTotalNumberOfAppointments, (state, { appointmentTotal }) => ({
    ...state,
    calendarAppointmentCount: appointmentTotal,
  })),
);

export const selectSlice = createFeatureSelector<State>(featureKey);

export const selectors = {
  selectAppointmentsData: createSelector(selectSlice, (state: State) => state.appointmentListData),
  selectAppointmentsDetailData: createSelector(selectSlice, (state: State) => state.appointmentDetailData),
  selectListParams: createSelector(selectSlice, (state: State) => state.listParams),
  selectPending: createSelector(selectSlice, (state: State) => state.pending),
  selectCancelPending: createSelector(selectSlice, (state: State) => state.cancelPending),
  selectListPageCount: createSelector(selectSlice, (state: State) => state.listParams.page),
  selectListLimit: createSelector(selectSlice, (state: State) => state.listParams.limit),
  selectDownloadVendorICSPending: createSelector(selectSlice, (state: State) => state.downloadVendorICSPending),
  selectAppointmentCount: createSelector(selectSlice, (state: State) => state.appointmentListData.total),
  selectCalendarAppointmentCount: createSelector(selectSlice, (state: State) => state.calendarAppointmentCount),
};
