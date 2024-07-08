import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';

import { RouterEffects } from './router.effects';
import { NotificationEffects } from './notification.effects';
import { BookingEffects } from './booking.effects';
import { CalendarEffects } from './calendar.effects';
import { BookingAPIEffects } from './booking-api.effects';
import { BookingServiceModule } from '../services/booking-service.module';
import { VendorServicesModule } from '../services/vendor.service.module';
import { ViewBreakPointEffects } from './view-breakpoint.effects';
import { VendorBookingTemplateEffects } from './vendor-booking-template.effects';
import { VendorCalendarEffects } from './vendor.calendar.effects';
import { VendorSettingsEffects } from './vendor-settings.effects';
import { VendorAppointmentEffects } from './vendor-appointment.effects';
import { VendorScheduleEffects } from './vendor-schedule.effects';
import { TimeZoneApiEffects } from './timezone-api.effect';
import { GoogleIntegrationEffects } from './google-integration.effects';
@NgModule({
  imports: [
    VendorServicesModule,
    /**
     * EffectsModule.forRoot() is imported once in the root module and
     * sets up the effects class to be initialized immediately when the
     * application starts.
     *
     * See: https://ngrx.io/guide/effects#registering-root-effects
     */
    BookingServiceModule,
    EffectsModule.forRoot(
      BookingAPIEffects,
      RouterEffects,
      BookingEffects,
      CalendarEffects,
      NotificationEffects,
      ViewBreakPointEffects,
      VendorBookingTemplateEffects,
      VendorCalendarEffects,
      VendorSettingsEffects,
      VendorAppointmentEffects,
      VendorScheduleEffects,
      TimeZoneApiEffects,
      GoogleIntegrationEffects,
    ),
  ],
})
export class AppEffectsModule {}
