import { isDevMode } from '@angular/core';
import { MetaReducer, ActionReducerMap } from '@ngrx/store';
import { routerReducer } from '@ngrx/router-store';

import { State } from './state';

/**
 * Every reducer module's default export is the reducer function itself. In
 * addition, each module should export a type or interface that describes
 * the state of the reducer plus any selector functions. The `* as`
 * notation packages up all of the exports into a single object.
 */

import * as calendar from './slices/calendar.store';
import * as booking from './slices/booking.store';
import * as bookingAPI from './slices/booking-api.store';
import * as vendor from './slices/vendor.store';
import * as notification from './slices/notification.store';
import * as viewBreakPoint from './slices/view-breakpoint.store';
import * as vendorBookingTemplate from './slices/vendor-booking-template.store';
import * as vendorSettings from './slices/vendor-settings.store';
import * as vendorAppointment from './slices/vendor-appointment.store';
import * as vendorCalendar from './slices/vendor-calendar.store';
import * as vendorSchedule from './slices/vendor-schedule.store';
import * as timeZoneAPI from './slices/timezone-api.store';
import * as googleIntegration from './slices/google-integration.store';

/**
 * Our state is composed of a map of action reducer functions.
 * These reducer functions are called with each dispatched action
 * and the current or initial state and return a new immutable state.
 */
export const rootReducers: ActionReducerMap<State> = {
  [vendor.featureKey]: vendor.reducer,
  [calendar.featureKey]: calendar.reducer,
  [booking.featureKey]: booking.reducer,
  [bookingAPI.featureKey]: bookingAPI.reducer,
  [notification.featureKey]: notification.reducer,
  [viewBreakPoint.featureKey]: viewBreakPoint.reducer,
  [vendorBookingTemplate.featureKey]: vendorBookingTemplate.reducer,
  [vendorSettings.featureKey]: vendorSettings.reducer,
  [vendorAppointment.featureKey]: vendorAppointment.reducer,
  [vendorCalendar.featureKey]: vendorCalendar.reducer,
  [vendorSchedule.featureKey]: vendorSchedule.reducer,
  [timeZoneAPI.featureKey]: timeZoneAPI.reducer,
  [googleIntegration.featureKey]: googleIntegration.reducer,
  router: routerReducer,
};

/**
 * By default, @ngrx/store uses combineReducers with the reducer map to compose
 * the root meta-reducer. To add more meta-reducers, provide an array of meta-reducers
 * that will be composed to form the root meta-reducer.
 */
export const metaReducers: MetaReducer<State>[] = isDevMode() ? [] : [];
