import { reducer, initialState, actions, selectors } from './vendor-appointment.store';
import { appointmentDetailData, appointmentListData } from './../../types/vendor.types.mock';
import { AppointmentList, AppointmentDetails } from '../../types/vendor.types';

describe('Appointment appointment reducers', () => {
  const mockState = {
    errorMessage: 'sample error message',
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
    cancellationMessage: '',
    cancelPending: false,
    downloadVendorICSError: null,
    downloadVendorICSPending: false,
    calendarAppointmentCount: 0,
  };

  it('should handle loadAppointmentDetail action', () => {
    const detailsId = 1;
    const action = actions.loadAppointmentDetail({ detailsId });
    const state = reducer(mockState, action);
    expect(state.pending).toBe(true);
  });

  it('should handle setAppointmentDetail action', () => {
    const action = actions.setAppointmentDetail({ appointmentDetailData });
    const state = reducer(mockState, action);
    expect(state.appointmentDetailData).toBe(appointmentDetailData);
    expect(state.pending).toBe(mockState.pending);
  });

  it('should handle setAppointmentListSuccess action', () => {
    const action = actions.loadAppointmentListSuccess({ appointmentListData: appointmentListData });
    const state = reducer(mockState, action);
    expect(state.appointmentListData).toBe(appointmentListData);
    expect(state.pending).toBe(mockState.pending);
  });

  it('should handle setAppointmentList action', () => {
    const action = actions.loadAppointmentList({ listParams: mockState.listParams });
    const state = reducer(mockState, action);
    expect(state.listParams).toBe(mockState.listParams);
    expect(state.pending).toBe(true);
  });

  it('should handle setErrorMessage action', () => {
    const errorMessage = 'sample error message';
    const action = actions.setErrorMessage({ ErrorMessage: errorMessage });
    const state = reducer(mockState, action);
    expect(state.errorMessage).toBe(errorMessage);
    expect(state.pending).toBe(mockState.pending);
  });

  it('should handle setErrorMessage action', () => {
    const appointmentId = 2;
    const action = actions.cancelAppointment({ appointmentId });
    const state = reducer(mockState, action);
    expect(state.pending).toBe(false);
  });

  it('should handle updateListParams', () => {
    const paramName = 'sortOrder';
    const paramValue = 'asc';
    const action = actions.updateListParam({ paramName, paramValue });
    const state = reducer(mockState, action);
    expect(state.listParams.sortOrder).toBe(paramValue);
  });

  it('should handle downloadVendorICS', () => {
    const action = actions.downloadVendorICS({ appointmentId: 1 });
    const state = reducer(mockState, action);
    expect(state.downloadVendorICSError).toBe(null);
    expect(state.downloadVendorICSPending).toBe(true);
  });

  it('should handle downloadVendorICSSuccess', () => {
    const action = actions.downloadVendorICSSuccess();
    const state = reducer(mockState, action);
    expect(state.downloadVendorICSError).toBe(null);
    expect(state.downloadVendorICSPending).toBe(false);
  });

  it('should handle downloadVendorICSFailiure', () => {
    const action = actions.downloadVendorICSFailure({ error: 'error' });
    const state = reducer(mockState, action);
    expect(state.downloadVendorICSError).toBe('error');
    expect(state.downloadVendorICSPending).toBe(false);
  });

  it('should handle setTotalNumberOfAppointments', () => {
    const action = actions.setTotalNumberOfAppointments({ appointmentTotal: 1 });
    const state = reducer(mockState, action);
    expect(state.calendarAppointmentCount).toBe(1);
  });
});

describe('Appointment appointment selectors', () => {
  const mockState = {
    errorMessage: 'sample error message',
    appointmentListData: appointmentListData,
    appointmentDetailData: appointmentDetailData,
    listParams: {
      searchValue: '',
      page: 1,
      limit: 10,
      sortOrder: 'asc',
    },
    pending: false,
    cancellationMessage: '',
    cancelPending: false,
    downloadVendorICSError: null,
    downloadVendorICSPending: false,
    calendarAppointmentCount: 0,
  };

  it('should select appointment list', () => {
    const appointmentList: AppointmentList = appointmentListData;
    const result = selectors.selectAppointmentsData.projector(mockState);
    expect(result).toStrictEqual(appointmentList);
  });

  it('should select appointment details data', () => {
    const appointmentDetailsData: AppointmentDetails = {
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
    };
    const result = selectors.selectAppointmentsDetailData.projector(initialState);
    expect(result).toStrictEqual(appointmentDetailsData);
  });

  it('should select listParams from the store', () => {
    const result = selectors.selectListParams.projector(initialState);
    expect(result).toEqual(mockState.listParams);
  });

  it('should select pending from the store', () => {
    const result = selectors.selectPending.projector(initialState);
    expect(result).toEqual(mockState.pending);
  });

  it('should select page count', () => {
    const result = selectors.selectListPageCount.projector(initialState);
    expect(result).toEqual(mockState.listParams.page);
  });

  it('should select page count', () => {
    const result = selectors.selectListLimit.projector(initialState);
    expect(result).toEqual(mockState.listParams.limit);
  });

  it('should select download ics pending state', () => {
    const result = selectors.selectDownloadVendorICSPending.projector(initialState);
    expect(result).toEqual(mockState.downloadVendorICSPending);
  });
});
