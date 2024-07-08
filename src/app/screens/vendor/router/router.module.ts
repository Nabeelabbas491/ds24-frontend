import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VendorManagementComponent } from '../components/vendor-management/vendor-management.component';
import { AppointmentDetailsComponent } from '../components/appointment-details/appointment-details.component';
import { AppointmentTabComponent } from '../components/appointment-tab/appointment-tab.component';
import { AppointmentCalendarComponent } from '../components/appointment-calendar/appointment-calendar.component';
import { ManageScheduleComponent } from '../components/manage-schedule/manage-schedule.component';
import { SettingsComponent } from '../components/settings/settings.component';
import { VendorTabsName } from '../../../types/tab.type';
import { appointmentDetailsResolver } from './appointment-details.resolver';
import { bookingTemplateResolver } from './booking-template.resolver';
import { vendorSettingsResolver } from './vendor-setting.resolver';

export const routes: Routes = [
  {
    path: '',
    component: VendorManagementComponent,
    data: { title: 'Vendor', page: 'vendor-calendar' },
    children: [
      { path: 'appointments', component: AppointmentTabComponent, data: { tab: VendorTabsName.appointments } },
      {
        path: 'details/:id',
        component: AppointmentDetailsComponent,
        resolve: {
          data: appointmentDetailsResolver,
        },
        data: { tab: VendorTabsName.appointments },
      },
      { path: 'calendar', component: AppointmentCalendarComponent, data: { tab: VendorTabsName.appointments } },
      {
        path: 'manage-schedule',
        component: ManageScheduleComponent,
        data: { tab: VendorTabsName.appointments },
      },
      {
        path: 'booking-templates',
        loadChildren: () => import('../../booking-template/booking-template.module').then(m => m.BookingTempModule),
        resolve: { bookingTemplateResolver },
        data: { tab: VendorTabsName.booking },
      },
      {
        path: 'settings',
        component: SettingsComponent,
        resolve: { vendorSettingsResolver },
        data: { tab: VendorTabsName.settings },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VendorRoutingModule {}
