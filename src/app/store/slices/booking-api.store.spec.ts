import { BookingTemplateDetail } from './../../types/booking.type';
import { State, actions, initialState, reducer, selectors } from './booking-api.store';

describe('Booking API Reducer', () => {
  it('should handle getBookingTemplate action', () => {
    const state: State = { ...initialState, paramId: null };
    const newState = reducer(
      state,
      actions.getBookingTemplate({ paramDetails: { paramId: '123-XYZ-123', isClient: false } }),
    );

    expect(newState.paramId).toEqual('123-XYZ-123');
  });

  it('should handle downloadClientICS action', () => {
    const state: State = {
      ...initialState,
      downloadClientICSError: null,
      downloadClientICSPending: false,
    };
    const newState = reducer(state, actions.downloadClientICS({ appointmentId: 123 }));
    expect(newState.downloadClientICSError).toEqual(null);
    expect(newState.downloadClientICSPending).toEqual(true);
  });

  it('should handle downloadClientICSSuccess action', () => {
    const state: State = {
      ...initialState,
      downloadClientICSError: null,
      downloadClientICSPending: true,
    };
    const newState = reducer(state, actions.downloadClientICSSuccess());

    expect(newState.downloadClientICSError).toEqual(null);
    expect(newState.downloadClientICSPending).toEqual(false);
  });

  it('should handle downloadClientICSFailure action', () => {
    const errorMessage = 'Some Error Occured!';
    const state: State = {
      ...initialState,
      downloadClientICSError: null,
      downloadClientICSPending: false,
    };
    const newState = reducer(state, actions.downloadClientICSFailure({ error: errorMessage }));

    expect(newState.downloadClientICSError).toEqual(errorMessage);
    expect(newState.downloadClientICSPending).toEqual(false);
  });

  it('should handle getBookingTimeSlots action', () => {
    const state: State = {
      ...initialState,
      bookingTimeSlots: [],
      bookingTimeSlotsError: null,
      bookingTemplatePending: false,
    };
    const newState = reducer(state, actions.getBookingTimeSlots({ date: '2024-02-20' }));

    expect(newState.bookingTimeSlots).toEqual([]);
    expect(newState.bookingTimeSlotsError).toEqual(null);
    expect(newState.bookingTimeSlotsPending).toEqual(true);
  });

  it('should handle getBookingTimeSlotsSuccess action', () => {
    const timeSlots = [
      { startTime: '09:00', endTime: '09:30' },
      { startTime: '09:30', endTime: '10:00' },
    ];
    const state: State = {
      ...initialState,
      bookingTimeSlots: [],
      bookingTimeSlotsError: null,
      bookingTemplatePending: true,
    };
    const newState = reducer(state, actions.getBookingTimeSlotsSuccess({ timeSlots }));

    expect(newState.bookingTimeSlots).toEqual(timeSlots);
    expect(newState.bookingTimeSlotsError).toEqual(null);
    expect(newState.bookingTimeSlotsPending).toEqual(false);
  });

  it('should handle getBookingTimeSlotsFailure action', () => {
    const errorMessage = 'Some Error Occured!';
    const state: State = {
      ...initialState,
      bookingTimeSlots: [],
      bookingTimeSlotsError: null,
      bookingTemplatePending: false,
    };
    const newState = reducer(state, actions.getBookingTimeSlotsFailure({ error: errorMessage }));

    expect(newState.bookingTimeSlots).toEqual([]);
    expect(newState.bookingTimeSlotsError).toEqual(errorMessage);
    expect(newState.bookingTimeSlotsPending).toEqual(false);
  });
  it('should handle resetBookingTemplate action', () => {
    const bookingTemplateDetail: BookingTemplateDetail = {
      bookingTemplate: {
        id: 100,
        name: 'test',
        bufferTime: 30,
        description: 'test test test',
        duration: 30,
      },
      bookingProduct: {
        id: 100,
        url: 'test',
        imageUrl: '',
        productId: 101,
        productName: 'test',
        uuid: '123-xyz-123',
        zoomLink: 'test',
      },
      bookingMeetingTypes: [{ id: 1, name: 'Inbound Call' }],
      availabilities: [],
    };

    const state: State = {
      ...initialState,
      bookingTemplateSuccess: bookingTemplateDetail,
      bookingTimeSlotsError: 'some error',
      bookingTemplatePending: true,
    };
    const newState = reducer(state, actions.resetBookingTemplate());

    expect(newState.bookingTemplateSuccess).toEqual(null);
    expect(newState.bookingTemplateError).toEqual(null);
    expect(newState.bookingTemplatePending).toEqual(false);
  });
});

describe('Booking API Selectors', () => {
  const mockState: State = {
    paramId: '123-XYZ-123',
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

  it('should select BookingProductId', () => {
    const selectedValue = selectors.selectBookingProductId.projector(mockState);
    expect(selectedValue).toEqual(mockState.paramId);
  });
  it('should select downloadClientICSError', () => {
    const selectedValue = selectors.selectDownloadClientICSError.projector(mockState);
    expect(selectedValue).toEqual(mockState.downloadClientICSError);
  });
  it('should select downloadClientICSPending', () => {
    const selectedValue = selectors.selectDownloadClientICSPending.projector(mockState);
    expect(selectedValue).toEqual(mockState.downloadClientICSPending);
  });

  it('should select bookingTimeSlots', () => {
    const selectedValue = selectors.selectBookingTimeSlots.projector(mockState);
    expect(selectedValue).toEqual(mockState.bookingTimeSlots);
  });
  it('should select bookingTimeSlotsError', () => {
    const selectedValue = selectors.selectBookingTimeSlotsError.projector(mockState);
    expect(selectedValue).toEqual(mockState.bookingTimeSlotsError);
  });
  it('should select bookingTimeSlotsPending', () => {
    const selectedValue = selectors.selectBookingTimeSlotsPending.projector(mockState);
    expect(selectedValue).toEqual(mockState.bookingTimeSlotsPending);
  });
});
