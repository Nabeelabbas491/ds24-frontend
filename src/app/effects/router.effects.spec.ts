import { TestBed, fakeAsync, flush } from '@angular/core/testing';

import { of } from 'rxjs';

import { Actions } from '@ngrx/effects';
import { provideMockStore } from '@ngrx/store/testing';

import { RouterEffects } from './router.effects';
import { actions } from '../store';
import { VendorService } from '../services/vendor.service';
import { Router } from '@angular/router';
import { provideMockActions } from '@ngrx/effects/testing';
import { ROUTER_NAVIGATION } from '@ngrx/router-store';
import { cold, hot } from 'jasmine-marbles';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { State } from '../store';
import { VendorTabs } from '../types/tab.type';

describe('RouterEffects', () => {
  let effects: RouterEffects;
  let actions$: Actions;
  let routerService: Router;
  let mockStore: Store<State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      providers: [
        RouterEffects,
        provideMockStore(),
        provideMockActions(() => actions$),
        {
          provide: Router,
          useValue: { navigate: jest.fn() },
        },
        { provide: VendorService, useValue: { getInitialEvents: jest.fn() } },
      ],
    });

    effects = TestBed.inject(RouterEffects);
    actions$ = TestBed.inject(Actions);
    routerService = TestBed.inject(Router);
    mockStore = TestBed.inject(Store);
    jest.spyOn(mockStore, 'dispatch');
  });

  describe('navigateToDetailsPage$', () => {
    it('should dispatch a navigation action to details page', (done: any) => {
      const detailsId = 4;
      const navigateSpy = jest.spyOn(routerService, 'navigate');
      const action = actions.vendorAppointment.redirectToVendorDetailPage({ detailsId });

      actions$ = of(action);

      effects.navigateToDetailsPage$.subscribe(() => {
        expect(navigateSpy).toHaveBeenCalledWith([`/vendor/details/${detailsId}`]);
        done();
      });
    });
  });

  describe('navigateToAppointmentTab$', () => {
    it('should dispatch a navigation action to appointment tab', (done: any) => {
      const routerServiceSpy = jest.spyOn(routerService, 'navigate');
      actions$ = of(actions.vendor.redirectToAppointmentTab);

      effects.navigateToAppointmentTab$.subscribe(() => {
        expect(routerServiceSpy).toHaveBeenCalledWith(['/vendor/appointments']);
        done();
      });
    });
  });

  describe('navigateToBookingTemplatePage$', () => {
    it('should dispatch a navigation action to booking template page', (done: any) => {
      const routerServiceSpy = jest.spyOn(routerService, 'navigate');
      actions$ = of(actions.vendor.redirectToBookingTemplatePage);

      effects.navigateToBookingTemplatePage$.subscribe(() => {
        expect(routerServiceSpy).toHaveBeenCalledWith(['/vendor/booking-templates']);
        done();
      });
    });
  });

  describe('navigateToGooglePopupFinalPage$', () => {
    it('should dispatch a navigation action to booking template page', (done: any) => {
      const routerServiceSpy = jest.spyOn(routerService, 'navigate');
      actions$ = of(actions.googleIntegration.redirectToGoogleFinalPopup);

      effects.navigateToGooglePopupFinalPage$.subscribe(() => {
        expect(routerServiceSpy).toHaveBeenCalledWith(['/google-calendar/google-popup']);
        done();
      });
    });
  });

  describe('navigateToSettingsPage$', () => {
    it('should dispatch a navigation action to settings page', (done: any) => {
      const routerServiceSpy = jest.spyOn(routerService, 'navigate');
      actions$ = of(actions.vendor.redirectToSettingsPage);

      effects.navigateToSettingsPage$.subscribe(() => {
        expect(routerServiceSpy).toHaveBeenCalledWith(['/vendor/settings']);
        done();
      });
    });
  });

  describe('navigateToManageSchedulePage$', () => {
    it('should dispatch a navigation action to manage schedule page', (done: any) => {
      const routerServiceSpy = jest.spyOn(routerService, 'navigate');
      actions$ = of(actions.vendor.redirectToManageSchedulePage);

      effects.navigateToManageSchedulePage$.subscribe(() => {
        expect(routerServiceSpy).toHaveBeenCalledWith(['/vendor/manage-schedule']);
        done();
      });
    });
  });

  describe('navigateToDetailsPageRouterNavigation$', () => {
    it('should be an observable', fakeAsync(() => {
      const routerNavigationAction = {
        type: ROUTER_NAVIGATION,
        payload: {
          event: {
            url: '/vendor',
          },
        },
      };

      actions$ = hot('a-', { a: routerNavigationAction });

      const expected = cold('--');

      expect(effects.navigateToAppointmentTabOnRouterNavigation$).toBeObservable(expected);

      effects.navigateToAppointmentTabOnRouterNavigation$.subscribe(() => {
        expect(routerService.navigate).toBeCalledWith('/vendor/appointments');
      });

      flush();
    }));
  });

  describe('changeRouteOnTabChange', () => {
    it('should call the appointment tab when event index is 0', (done: any) => {
      const tabInfo = {
        id: VendorTabs.appointment,
        title: 'Appointment',
        urlSegment: 'appointment',
      };

      actions$ = of(actions.vendor.routeChangeOnTabChange({ tabInfo }));

      effects.changeRouteOnTabChange$.subscribe(() => {
        expect(mockStore.dispatch).toHaveBeenCalledWith(actions.vendor.redirectToAppointmentTab());
        done();
      });
    });

    it('should call the booking template page when event index is 1', (done: any) => {
      const tabInfo = {
        id: VendorTabs.booking,
        title: 'Booking',
        urlSegment: 'booking',
      };
      actions$ = of(actions.vendor.routeChangeOnTabChange({ tabInfo }));
      effects.changeRouteOnTabChange$.subscribe(() => {
        expect(mockStore.dispatch).toHaveBeenCalledWith(actions.vendor.redirectToBookingTemplatePage());
        done();
      });
    });

    it('should call the settings tab when event index is 2', (done: any) => {
      const tabInfo = {
        id: VendorTabs.settings,
        title: 'Settings',
        urlSegment: 'settings',
      };
      actions$ = of(actions.vendor.routeChangeOnTabChange({ tabInfo }));

      effects.changeRouteOnTabChange$.subscribe(() => {
        expect(mockStore.dispatch).toHaveBeenCalledWith(actions.vendor.redirectToSettingsPage());
        done();
      });
    });
  });
});
