import { BookingTemplateCollection, SaveBookingTemplate } from 'src/app/types/vendor.types';
import { reducer, initialState, actions, selectors, State } from './vendor-booking-template.store';
import { BookingTemplateList } from './../../types/vendor.booking-template.type';

describe('Vendor Booking Template Reducers', () => {
  it('should handle getCollection action', () => {
    const newState = reducer(initialState, actions.getCollection({ bookingTemplateId: undefined }));

    expect(newState.bookingTemplateCollectionPending).toEqual(true);
    expect(newState.bookingTemplateCollectionError).toEqual(null);
  });

  it('should handle getCollectionSuccess action', () => {
    const bookingTemplateCollection: BookingTemplateCollection = {
      meetingProducts: [],
      bookingTemplateDetail: null,
      vendorSetting: null,
      modalState: 'create',
    };

    const newState = reducer(initialState, actions.getCollectionSuccess({ bookingTemplateCollection }));

    expect(newState.bookingTemplateCollectionPending).toEqual(false);
    expect(newState.bookingTemplateCollectionError).toEqual(null);
  });

  it('should handle getCollectionFailure action', () => {
    const error: string = 'error';
    const newState = reducer(initialState, actions.getCollectionFailure({ error }));

    expect(newState.bookingTemplateCollectionPending).toEqual(false);
    expect(newState.bookingTemplateCollectionError).toEqual(error);
  });

  it('should handle getBookingTemplateList action', () => {
    const newState = reducer(initialState, actions.getBookingTemplateList());

    expect(newState.bookingTemplateListPending).toEqual(true);
    expect(newState.bookingTemplateListError).toEqual(null);
  });

  it('should handle getBookingTemplateListSuccess action', () => {
    const bookingTemplateList: BookingTemplateList = {
      bookingTemplates: [],
      total: 1,
      page: 1,
      limit: 10,
    };

    const newState = reducer(initialState, actions.getBookingTemplateListSuccess({ bookingTemplateList }));

    expect(newState.bookingTemplateListPending).toEqual(false);
    expect(newState.bookingTemplateListError).toEqual(null);
  });

  it('should handle getBookingTemplateListFailure action', () => {
    const error: string = 'error';
    const newState = reducer(initialState, actions.getBookingTemplateListFailure({ error }));

    expect(newState.bookingTemplateListPending).toEqual(false);
    expect(newState.bookingTemplateListError).toEqual(error);
  });
  it('should handle setBookingTemplateListCurrentPage action', () => {
    const newPage: number = 2;
    const newState = reducer(initialState, actions.setBookingTemplateListCurrentPage({ currentPage: newPage }));

    expect(newState.currentPage).toEqual(newPage);
  });

  it('should handle insertBookingTemplate action', () => {
    const saveBookingTemplate: SaveBookingTemplate = {
      name: '',
      description: '',
      duration: 30,
      products: [1, 2],
      phoneNumber: '123-456',
      meetingTypes: [1, 3],
    };

    const newState = reducer(initialState, actions.upsertBookingTemplate({ saveBookingTemplate }));

    expect(newState.upsertBookingTemplatePending).toEqual(true);
    expect(newState.upsertBookingTemplateError).toEqual(null);
  });

  it('should handle insertBookingTemplateFailure action', () => {
    const error: string = 'error';

    const newState = reducer(initialState, actions.upsertBookingTemplateFailure({ error }));

    expect(newState.upsertBookingTemplatePending).toEqual(false);
    expect(newState.upsertBookingTemplateError).toEqual(error);
  });

  it('should handle closeBookingModal action', () => {
    const newState = reducer(initialState, actions.closeBookingModal());

    expect(newState.bookingTemplateCollection).toEqual(undefined);
    expect(newState.bookingTemplateCollectionError).toEqual(null);
    expect(newState.bookingTemplateCollectionPending).toEqual(false);
  });
});

describe('Vendor Booking Template Selectors', () => {
  const mockState: State = {
    bookingTemplateCollectionError: 'error',
    bookingTemplateCollectionPending: false,
    bookingTemplateCollection: undefined,

    bookingTemplateListError: null,
    bookingTemplateListPending: false,
    bookingTemplateList: undefined,
    currentPage: 1,

    upsertBookingTemplateError: 'error',
    upsertBookingTemplatePending: false,
    upsertBookingTemplateSuccess: 'success',
  };

  it('should select bookingTemplateCollectionError', () => {
    const selectedValue = selectors.selectUpsertBookingTemplateError.projector(mockState);
    expect(selectedValue).toEqual(mockState.bookingTemplateCollectionError);
  });

  it('should select bookingTemplateCollectionPending', () => {
    const selectedValue = selectors.selectBookingTemplateCollectionPending.projector(mockState);
    expect(selectedValue).toEqual(mockState.bookingTemplateCollectionPending);
  });

  it('should select bookingTemplateCollection', () => {
    const selectedValue = selectors.selectBookingTemplateCollection.projector(mockState);
    expect(selectedValue).toEqual(mockState.bookingTemplateCollection);
  });

  it('should select bookingTemplateListError', () => {
    const selectedValue = selectors.selectBookingTemplateListError.projector(mockState);
    expect(selectedValue).toEqual(mockState.bookingTemplateListError);
  });

  it('should select bookingTemplateListPending', () => {
    const selectedValue = selectors.selectBookingTemplateListPending.projector(mockState);
    expect(selectedValue).toEqual(mockState.bookingTemplateListPending);
  });

  it('should select bookingTemplateList', () => {
    const selectedValue = selectors.selectBookingTemplateList.projector(mockState);
    expect(selectedValue).toEqual(mockState.bookingTemplateList);
  });

  it('should select bookingTemplateList Current Page', () => {
    const selectedValue = selectors.selectBookingTemplateListCurrentPage.projector(mockState);
    expect(selectedValue).toEqual(mockState.currentPage);
  });

  it('should select upsertBookingTemplateError', () => {
    const selectedValue = selectors.selectUpsertBookingTemplateError.projector(mockState);
    expect(selectedValue).toEqual(mockState.upsertBookingTemplateError);
  });

  it('should select upsertBookingTemplatePending', () => {
    const selectedValue = selectors.selectUpsertBookingTemplatePending.projector(mockState);
    expect(selectedValue).toEqual(mockState.upsertBookingTemplatePending);
  });
  it('should select upsertBookingTemplateSuccess', () => {
    const selectedValue = selectors.selectUpsertBookingTemplateSuccess.projector(mockState);
    expect(selectedValue).toEqual(mockState.upsertBookingTemplateSuccess);
  });
});
