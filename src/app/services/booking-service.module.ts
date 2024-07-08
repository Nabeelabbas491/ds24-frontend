import { NgModule } from '@angular/core';
import { BookingService } from './booking.service';
import { GoogleIntegrationService } from './google-integration.service';

@NgModule({
  providers: [BookingService, GoogleIntegrationService],
})
export class BookingServiceModule {}
