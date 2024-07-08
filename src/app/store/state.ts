import { RouterReducerState } from '@ngrx/router-store';

import * as vendor from './slices/vendor.store';
import * as calendar from './slices/calendar.store';
import * as booking from './slices/booking.store';
import * as bookingAPI from './slices/booking-api.store';
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
 * As mentioned, we treat each reducer like a table in a database. This means
 * our top level state interface is just a map of keys to inner state types.
 */
export interface State {
  [vendor.featureKey]: vendor.State;
  [notification.featureKey]: notification.State;
  [calendar.featureKey]: calendar.State;
  [booking.featureKey]: booking.State;
  [bookingAPI.featureKey]: bookingAPI.State;
  [viewBreakPoint.featureKey]: viewBreakPoint.State;
  [vendorBookingTemplate.featureKey]: vendorBookingTemplate.State;
  [vendorSettings.featureKey]: vendorSettings.State;
  [vendorAppointment.featureKey]: vendorAppointment.State;
  [vendorCalendar.featureKey]: vendorCalendar.State;
  [vendorSchedule.featureKey]: vendorSchedule.State;
  [timeZoneAPI.featureKey]: timeZoneAPI.State;
  [googleIntegration.featureKey]: googleIntegration.State;
  router: RouterReducerState;
}
