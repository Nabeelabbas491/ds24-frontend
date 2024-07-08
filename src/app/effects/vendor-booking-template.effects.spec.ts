import { Observable, throwError } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { VendorBookingTemplateEffects } from './vendor-booking-template.effects';
import { VendorService } from '../services/vendor.service';
import { provideMockStore } from '@ngrx/store/testing';
import { actions, selectors } from '../store';
import { cold, hot } from 'jasmine-marbles';
import { BookingTemplateCollection, SaveBookingTemplate } from '../types/vendor.types';
import { add, format } from 'date-fns';
import { BookingTemplateList } from '../types/vendor.booking-template.type';

describe('VendorBookingTemplateEffects', () => {
  let effects: VendorBookingTemplateEffects;
  let actions$: Observable<any>;
  let vendorService: VendorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        VendorBookingTemplateEffects,
        provideMockActions(() => actions$),
        provideMockStore({
          selectors: [
            {
              selector: selectors.vendorBookingTemplate.selectBookingTemplateListCurrentPage,
              value: 1,
            },
          ],
        }),
        {
          provide: VendorService,
          useValue: {
            getBookingTemplateCollection: jest.fn(),
            insertBookingTemplate: jest.fn(),
            getBookingTemplateList: jest.fn(),
          },
        },
      ],
    });

    effects = TestBed.inject(VendorBookingTemplateEffects);
    actions$ = TestBed.inject(Actions);
    vendorService = TestBed.inject(VendorService);
  });

  describe('createEdit$', () => {
    it('calendarEffects$ should be created', () => {
      const action = actions.vendorBookingTemplate.openCreateBookingModal();

      actions$ = hot('-a', { a: action });

      expect(effects.createEdit$).toBeTruthy();
    });
  });

  it('should dispatch getCollection action when openCreateBookingModal action is called', () => {
    const action = actions.vendorBookingTemplate.openCreateBookingModal();
    const completion = actions.vendorBookingTemplate.getCollection({ bookingTemplateId: undefined });

    actions$ = hot('-a', { a: action });
    const expected = cold('-b', { b: completion });

    expect(effects.createEdit$).toBeObservable(expected);
  });
  it('should dispatch getCollection action when editBookingTemplate action is called', () => {
    const action = actions.vendorBookingTemplate.openEditBookingModal({ bookingTemplateId: 100 });
    const completion = actions.vendorBookingTemplate.getCollection({ bookingTemplateId: 100 });

    actions$ = hot('-a', { a: action });
    const expected = cold('-b', { b: completion });

    expect(effects.createEdit$).toBeObservable(expected);
  });

  it('should return bookingTemplateCollection object when getCollection action is successful', () => {
    const bookingTemplateCollection = {
      meetingTypes: [],
      meetingProducts: [],
      bookingTemplateDetail: null,
      modalState: 'create',
      vendorSetting: null,
    } as BookingTemplateCollection;

    const action = actions.vendorBookingTemplate.getCollection({ bookingTemplateId: undefined });
    const completion = actions.vendorBookingTemplate.getCollectionSuccess({ bookingTemplateCollection });

    actions$ = hot('-a', { a: action });
    const response = cold('-a|', { a: bookingTemplateCollection });
    const expected = cold('--b', { b: completion });
    vendorService.getBookingTemplateCollection = jest.fn(() => response);

    expect(effects.getTemplateFormCollection$).toBeObservable(expected);
  });

  it('should dispatch getCollectionFailure action when getCollection action throws an error', () => {
    const bookingTemplateCollection = {
      meetingTypes: [],
      meetingProducts: [],
      bookingTemplateDetail: null,
      modalState: 'create',
      vendorSetting: null,
    } as BookingTemplateCollection;

    const action = actions.vendorBookingTemplate.getCollection({ bookingTemplateId: undefined });
    const error = 'error';
    const completion = actions.vendorBookingTemplate.getCollectionFailure({ error });

    actions$ = hot('-a--', { a: action });
    const response = cold('-#', { a: bookingTemplateCollection });
    const expected = cold('--b', { b: completion });
    vendorService.getBookingTemplateCollection = jest.fn(() => response);

    expect(effects.getTemplateFormCollection$).toBeObservable(expected);
  });

  it('should return bookingTemplateList object when getBookingTemplateList action is successful', () => {
    const bookingTemplateList: BookingTemplateList = {
      bookingTemplates: [],
      total: 1,
      page: 1,
      limit: 10,
    };

    const action = actions.vendorBookingTemplate.getBookingTemplateList();
    const completion = actions.vendorBookingTemplate.getBookingTemplateListSuccess({ bookingTemplateList });

    actions$ = hot('-a', { a: action });
    const response = cold('-a|', { a: bookingTemplateList });
    const expected = cold('--b', { b: completion });
    vendorService.getBookingTemplateList = jest.fn(() => response);

    expect(effects.getBookingTemplateList$).toBeObservable(expected);
  });

  it('should dispatch getBookingTemplateListFailure action when bookingTemplateList action throws an error', () => {
    const bookingTemplateList: BookingTemplateList = {
      bookingTemplates: [],
      total: 1,
      page: 1,
      limit: 10,
    };

    const action = actions.vendorBookingTemplate.getBookingTemplateList();
    const error = 'error';
    const completion = actions.vendorBookingTemplate.getBookingTemplateListFailure({ error });

    actions$ = hot('-a--', { a: action });
    const response = cold('-#', { a: bookingTemplateList });
    const expected = cold('--b', { b: completion });
    vendorService.getBookingTemplateList = jest.fn(() => response);

    expect(effects.getBookingTemplateList$).toBeObservable(expected);
  });
  it('should dispatch getBookingTemplateList action when setBookingTemplateListCurrentPage action is raised', () => {
    const action = actions.vendorBookingTemplate.setBookingTemplateListCurrentPage({ currentPage: 1 });
    const completion = actions.vendorBookingTemplate.getBookingTemplateList();

    actions$ = hot('-a', { a: action });
    const expected = cold('-b', { b: completion });

    expect(effects.setBookingTemplateListCurrentPage$).toBeObservable(expected);
  });

  it('should dispatch insertBookingTemplateSuccess action when insertBookingTemplate action is raised successfully', () => {
    const saveBookingTemplate = {
      name: '',
      description: '',
      duration: 30,
      startDate: format(add(new Date(), { days: 1 }), 'yyyy-MM-dd'),
      endDate: format(add(new Date(), { days: 1 }), 'yyyy-MM-dd'),
      bufferTime: 10,
      products: [1, 2],
      meetingTypes: [1, 3],
      phoneNumber: '123-456',
    } as SaveBookingTemplate;

    const action = actions.vendorBookingTemplate.upsertBookingTemplate({ saveBookingTemplate });
    const success = { message: 'success' };
    const completion = actions.vendorBookingTemplate.upsertBookingTemplateSuccess({ success: success.message });

    actions$ = hot('-a', { a: action });
    const response = cold('-a|', { a: success });
    const expected = cold('--b', { b: completion });
    vendorService.insertBookingTemplate = jest.fn(() => response);

    expect(effects.upsertBookingTemplate$).toBeObservable(expected);
  });

  it('should dispatch insertBookingTemplateFailure action when insertBookingTemplate action throws an error', () => {
    const saveBookingTemplate = {
      name: '',
      description: '',
      duration: 30,
      startDate: format(add(new Date(), { days: 1 }), 'yyyy-MM-dd'),
      endDate: format(add(new Date(), { days: 1 }), 'yyyy-MM-dd'),
      bufferTime: 10,
      products: [],
      meetingTypes: [1, 3],
      phoneNumber: '123-456',
    } as SaveBookingTemplate;

    const action = actions.vendorBookingTemplate.upsertBookingTemplate({ saveBookingTemplate });
    const error = 'error';
    const completion = actions.vendorBookingTemplate.upsertBookingTemplateFailure({ error });

    actions$ = hot('-a', { a: action });
    const expected = cold('-b', { b: completion });
    vendorService.insertBookingTemplate = jest.fn(() => throwError(() => error));

    expect(effects.upsertBookingTemplate$).toBeObservable(expected);
  });
});
