import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot, convertToParamMap } from '@angular/router';
import { bookingTemplateResolver } from './booking-template.resolver';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { State, actions } from '../../../store';

describe('bookingTemplateResolver', () => {
  const executeResolver: ResolveFn<void> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => bookingTemplateResolver(...resolverParameters));
  let mockStore: MockStore<State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore()],
    });

    mockStore = TestBed.inject(MockStore);
    jest.spyOn(mockStore, 'dispatch');
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });

  it('should call getBookingTemplate action', () => {
    const routeStub = {
      paramMap: convertToParamMap({ pid: '1' }),
      queryParamMap: convertToParamMap({ isSync: false }),
    } as ActivatedRouteSnapshot;
    const stateStub = {} as RouterStateSnapshot;

    TestBed.runInInjectionContext(() => bookingTemplateResolver(routeStub, stateStub));
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      actions.bookingAPI.getBookingTemplate({ paramDetails: { paramId: '1', isClient: true } }),
    );
    expect(mockStore.dispatch).toHaveBeenCalledWith(actions.timeZoneAPI.getTimeZones());
  });
});
