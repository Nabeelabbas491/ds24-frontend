import { NgModule } from '@angular/core';
import { VendorService } from './vendor.service';
import { VendorCalendarService } from './vendor-calendar.service';

@NgModule({
  providers: [VendorService, VendorCalendarService],
})
export class VendorServicesModule {}
