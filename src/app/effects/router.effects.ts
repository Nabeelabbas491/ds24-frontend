import { Injectable } from '@angular/core';

import { filter, map, tap, withLatestFrom } from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { routerNavigationAction } from '@ngrx/router-store';

import * as selectors from '../store/selectors';
import * as actions from '../store/actions';
import { Router } from '@angular/router';
import { VendorTabs } from '../types/tab.type';

@Injectable()
export class RouterEffects {
  navigateToDetailsPage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(actions.vendorAppointment.redirectToVendorDetailPage),
        tap(value => {
          this.router.navigate(['/vendor/details/' + value.detailsId]);
        }),
      ),
    { dispatch: false },
  );

  navigateToAppointmentTab$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(actions.vendor.redirectToAppointmentTab),
        tap(() => {
          this.router.navigate(['/vendor/appointments']);
        }),
      ),
    { dispatch: false },
  );

  navigateToGooglePopupFinalPage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(actions.googleIntegration.redirectToGoogleFinalPopup),
        map(() => {
          this.router.navigate(['/google-calendar/google-popup']);
        }),
      ),
    { dispatch: false },
  );

  navigateToBookingTemplatePage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(actions.vendor.redirectToBookingTemplatePage),
        tap(() => {
          this.router.navigate(['/vendor/booking-templates']);
        }),
      ),
    { dispatch: false },
  );

  navigateToSettingsPage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(actions.vendor.redirectToSettingsPage),
        tap(() => {
          this.router.navigate(['/vendor/settings']);
        }),
      ),
    { dispatch: false },
  );

  navigateToManageSchedulePage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(actions.vendor.redirectToManageSchedulePage),
        tap(() => {
          this.router.navigate(['/vendor/manage-schedule']);
        }),
      ),
    { dispatch: false },
  );

  navigateToAppointmentTabOnRouterNavigation$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(routerNavigationAction),
        withLatestFrom(this.store.select(selectors.router.selectCurrentPage)),
        filter(([, page]) => page === 'vendor-calendar'),
        map(() => {
          this.router.navigate(['/vendor/appointments']);
        }),
      ),
    { dispatch: false },
  );

  activeTabValueOnRouterNavigation$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(routerNavigationAction),
        withLatestFrom(this.store.select(selectors.router.selectCurrentRoute)),
        map(([, route]) => {
          if (route.data.tab) {
            this.store.dispatch(actions.vendor.setActiveTab({ tabValue: route.data.tab }));
          }
        }),
      ),
    { dispatch: false },
  );

  changeRouteOnTabChange$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(actions.vendor.routeChangeOnTabChange),
        map(action => {
          this.store.dispatch(actions.vendor.setActiveTab({ tabValue: action.tabInfo.urlSegment as string }));

          switch (action.tabInfo.id) {
            case VendorTabs.appointment:
              this.store.dispatch(actions.vendor.redirectToAppointmentTab());
              break;
            case VendorTabs.booking:
              this.store.dispatch(actions.vendor.redirectToBookingTemplatePage());
              break;
            case VendorTabs.settings:
              this.store.dispatch(actions.vendor.redirectToSettingsPage());
              break;
          }
        }),
      ),
    { dispatch: false },
  );

  constructor(
    private actions$: Actions,
    private store: Store,
    private router: Router,
  ) {}
}
