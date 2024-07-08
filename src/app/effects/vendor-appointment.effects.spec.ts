import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { provideMockStore } from '@ngrx/store/testing';
import { Observable, of, throwError } from 'rxjs';
import * as actions from '../store/actions';
import { VendorAppointmentEffects } from './vendor-appointment.effects';
import { VendorService } from '../services/vendor.service';
import { hot, cold } from 'jasmine-marbles';
import { appointmentDetailData, appointmentListData } from '../types/vendor.types.mock';
import { provideMockActions } from '@ngrx/effects/testing';
import { AppointmentListParams } from '../types/vendor.types';
import { DsSnackbarService } from '@ds24/elements';
import * as helper from '../shared/common/util';
import { HttpErrorResponse } from '@angular/common/http';
import { selectors } from '../store';
describe('VendorAppointmentEffects', () => {
  let effects: VendorAppointmentEffects;
  let actions$: Observable<any>;
  let vendorServiceSpy: jest.Mocked<VendorService>;
  let snackbarService: DsSnackbarService;

  beforeEach(() => {
    vendorServiceSpy = {
      getAppointmentListData: jest.fn(),
      getAppointmentDetailsData: jest.fn(),
      cancelAppointment: jest.fn(),
      downloadVendorICS: jest.fn(),
    } as any;

    TestBed.configureTestingModule({
      providers: [
        VendorAppointmentEffects,
        {
          provide: DsSnackbarService,
          useValue: { openSnackbar: jest.fn() },
        },
        provideMockStore({
          selectors: [
            {
              selector: selectors.vendorAppointment.selectListParams,
              value: {
                searchValue: '',
                page: 1,
                limit: 10,
                sortOrder: 'date',
              },
            },
          ],
        }),
        provideMockActions(() => actions$),
        { provide: VendorService, useValue: vendorServiceSpy },
      ],
    });

    effects = TestBed.inject(VendorAppointmentEffects);
    actions$ = TestBed.inject(Actions);
    snackbarService = TestBed.inject(DsSnackbarService);
  });

  describe('loadAppointmentList$', () => {
    it('should load appointment list successfully', () => {
      const appointmentListDataSol = appointmentListData;
      vendorServiceSpy.getAppointmentListData.mockReturnValue(of(appointmentListDataSol));
      const listParams: AppointmentListParams = {
        searchValue: '',
        page: 1,
        limit: 10,
        sortOrder: 'date',
      };
      const action = actions.vendorAppointment.loadAppointmentList({ listParams });
      const completion = actions.vendorAppointment.loadAppointmentListSuccess({
        appointmentListData: appointmentListDataSol,
      });

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.loadAppointmentList$).toBeObservable(expected);
    });

    it('should handle error when loading appointment list', () => {
      const ErrorMessage = 'An error occurred';
      vendorServiceSpy.getAppointmentListData.mockReturnValue(throwError(ErrorMessage));
      const listParams: AppointmentListParams = {
        searchValue: '',
        page: 1,
        limit: 10,
        sortOrder: 'date',
      };
      const action = actions.vendorAppointment.loadAppointmentList({ listParams });
      const completion = actions.vendorAppointment.setErrorMessage({ ErrorMessage });

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.loadAppointmentList$).toBeObservable(expected);
    });
  });

  it('should load appointment details successfully', () => {
    const appointmentDetailDataSol = appointmentDetailData;
    vendorServiceSpy.getAppointmentDetailsData.mockReturnValue(of(appointmentDetailDataSol));
    const detailsId = 4;
    const action = actions.vendorAppointment.loadAppointmentDetail({ detailsId });
    const completion = actions.vendorAppointment.setAppointmentDetail({
      appointmentDetailData: appointmentDetailDataSol,
    });

    actions$ = hot('-a', { a: action });
    const expected = cold('-b', { b: completion });

    expect(effects.initAppointmentDetails$).toBeObservable(expected);
  });

  it('should dispatch loadAppointmentDetail action on cancelAppointment success', () => {
    const appointmentId = 1;
    const cancellationMessage = 'Appointment cancelled successfully';
    const action = actions.vendorAppointment.cancelAppointment({ appointmentId });
    const completion = actions.vendorAppointment.loadAppointmentDetail({ detailsId: appointmentId });

    actions$ = hot('-a', { a: action });
    const response = cold('-a|', { a: cancellationMessage });
    vendorServiceSpy.cancelAppointment.mockReturnValue(response);
    const expected = cold('--b', { b: completion });
    expect(effects.cancelAppointment$).toBeObservable(expected);
    expect(snackbarService.openSnackbar).toHaveBeenCalledWith({ title: cancellationMessage, type: 'info' });
  });

  it('should dispatch setErrorMessage action on cancelAppointment failure', () => {
    const appointmentId = 1;
    const errorMessage = 'Error cancelling appointment';
    const action = actions.vendorAppointment.cancelAppointment({ appointmentId });
    const completion = actions.vendorAppointment.setErrorMessage({ ErrorMessage: errorMessage });

    actions$ = hot('-a', { a: action });
    const response = cold('-#|', {}, errorMessage);
    vendorServiceSpy.cancelAppointment.mockReturnValue(response);

    const expected = cold('--b', { b: completion });
    expect(effects.cancelAppointment$).toBeObservable(expected);
    expect(snackbarService.openSnackbar).toHaveBeenCalledWith({ title: errorMessage, type: 'error' });
  });

  it('should handle error when loading appointment details', () => {
    const errorMessage = 'An error occurred';
    vendorServiceSpy.getAppointmentDetailsData.mockReturnValue(throwError(errorMessage));
    const detailsId = 4;
    const action = actions.vendorAppointment.loadAppointmentDetail({ detailsId });
    const completion = actions.vendorAppointment.setErrorMessage({ ErrorMessage: errorMessage });

    actions$ = hot('-a', { a: action });
    const expected = cold('-b', { b: completion });

    expect(effects.initAppointmentDetails$).toBeObservable(expected);
  });
  it('when downloadVendorICS action is raised, it should raise downloadVendorICSSuccess event', () => {
    const appointmentId: number = 123;
    const icsFileContent = new Blob(['testing']);

    const action = actions.vendorAppointment.downloadVendorICS({ appointmentId });
    actions$ = hot('-a', { a: action });

    const completion = actions.vendorAppointment.downloadVendorICSSuccess();

    const response = cold('-a|', { a: icsFileContent });
    const expected = cold('--b', { b: completion });

    vendorServiceSpy.downloadVendorICS.mockReturnValue(response);

    const spy = jest.spyOn(helper, 'downloadFile');
    spy.mockReturnValue();

    expect(effects.downloadVendorICS$).toBeObservable(expected);
  });
  it('when downloadVendorICS action is raised, it should raise downloadVendorICSFailure event', () => {
    const appointmentId: number = 123;

    const action = actions.vendorAppointment.downloadVendorICS({ appointmentId });
    const error = { message: 'error' } as HttpErrorResponse;
    const completion = actions.vendorAppointment.downloadVendorICSFailure({ error: error.message });

    actions$ = hot('-a', { a: action });

    const expected = cold('-b', { b: completion });

    vendorServiceSpy.downloadVendorICS.mockReturnValue(throwError(() => error.message));

    const spy = jest.spyOn(helper, 'downloadFile');
    spy.mockReturnValue();

    expect(effects.downloadVendorICS$).toBeObservable(expected);
  });

  it('should call updateListParam action when tabView is true', () => {
    const action = actions.vendor.saveTabView({ tabView: true });
    const listParams: AppointmentListParams = {
      searchValue: '',
      page: 1,
      limit: 10,
      sortOrder: 'date',
    };
    const completion = actions.vendorAppointment.loadAppointmentList({ listParams });

    actions$ = hot('-a', { a: action });
    const expected = cold('-b', { b: completion });

    expect(effects.changeDataOnTabViewChange$).toBeObservable(expected);
  });

  it('should call populateInitialCalendarDays action when tabView is false', () => {
    const action = actions.vendor.saveTabView({ tabView: false });
    const completion = actions.vendorCalendar.populateInitialCalendarDays();

    actions$ = hot('-a', { a: action });
    const expected = cold('-b', { b: completion });

    expect(effects.changeDataOnTabViewChange$).toBeObservable(expected);
  });
});
